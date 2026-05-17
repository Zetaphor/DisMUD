import logger from "../util/logger";
import emoji from "../messages/emoji";
import sendMessage from "../messages/sendMessage";
import parseCommand from "../parseCommand";
import buildRoom from "../roomBuilder";
import globalConstants from "../simulation/constants/global";
import playerStatConstants from "../simulation/constants/playerStats";

const byPlayerId = new Map<number, any>();
const byDiscordId = new Map<string, any>();
const byEntityId = new Map<number, any>();

function indexPlayer(playerData) {
  byPlayerId.set(playerData.id, playerData);
  byDiscordId.set(playerData.discordId, playerData);
  byEntityId.set(playerData.eid, playerData);
}

function unindexPlayer(playerData) {
  byPlayerId.delete(playerData.id);
  byDiscordId.delete(playerData.discordId);
  byEntityId.delete(playerData.eid);
}

export const players = {
  currentActive: {} as Record<string | number, any>,

  displayNameExists(db, displayName) {
    return db.methods.displayNameExists(displayName);
  },
  removePlayer(worldState, playerId) {
    const player = this.currentActive[playerId];
    if (player) {
      unindexPlayer(player);
      worldState.simulation.removeWorldEntity(player.id);
      delete this.currentActive[playerId];
      worldState.inventories.removeInventory(playerId);
    } else {
      throw new Error(`Player ${playerId} not found`);
    }
  },
  isActiveEntityId(playerId) {
    return byPlayerId.has(playerId);
  },
  isActiveDiscordId(discordId) {
    return byDiscordId.has(discordId);
  },
  getActiveByEntityId(eid) {
    return byEntityId.get(eid);
  },
  getActiveByPlayerId(playerId) {
    return byPlayerId.get(playerId);
  },
  getActiveByDiscordId(discordId) {
    return byDiscordId.get(discordId);
  },
  getActiveByDisplayName(name) {
    const lowerName = name.toLowerCase();
    for (const player of byPlayerId.values()) {
      if (player.displayName.toLowerCase().includes(lowerName)) {
        return player;
      }
    }
    return null;
  },
  updatePlayerGold(playerId, amount) {
    const player = byPlayerId.get(playerId);
    if (player) player.gold += amount;
  },
  updatePlayerBank(playerId, amount) {
    const player = byPlayerId.get(playerId);
    if (player) player.bank += amount;
  },
  createNewPlayer(worldState, user, className, displayName) {
    logger.info(`Creating new player ${user.username} with discordId: ${user.id}`);
    const playerData = worldState.db["players"].methods.createPlayer({
      discordId: `k${user.id}`,
      discordUsername: `${user.username}#${user.discriminator}`,
      displayName: displayName,
      roomNum: globalConstants.NEW_USER_ROOMNUM,
      equipment: "",
      simulationData: "",
      className: className,
      userPrefs: encodeURIComponent(
        JSON.stringify({
          localRepeat: false,
          hearTell: true,
          hearShout: true,
          chanGlobal: true,
          chanAuction: true,
          roomBrief: false,
          autoExits: false,
          follow: true,
          discordId: true,
        })
      ),
    });
    logger.info(`Creating new player ${user.username}'s inventory`);
    worldState.db["playerInventories"].methods.initPlayerInventory(playerData["id"]);
    return playerData;
  },
  login(worldState, user, newPlayer = false) {
    let playerData = worldState.db["players"].methods.getPlayerDataByDiscordId(`k${user.id}`);
    if (!playerData) {
      throw new Error(`Player not found ${user.id} ${user.username}`);
    }

    playerData["newPlayer"] = newPlayer;
    if (
      typeof playerData.equipment === "string" &&
      playerData.equipment !== "" &&
      playerData.equipment !== "null"
    ) {
      playerData.equipment = JSON.parse(decodeURIComponent(playerData.equipment));
    } else playerData.equipment = {};
    playerData.sendMessage = sendMessage;
    playerData.followers = {};
    playerData.following = null;
    playerData.followingPlayer = false;
    playerData.followingName = "";
    playerData.userPrefs = JSON.parse(decodeURIComponent(playerData.userPrefs));

    const playerInventory = worldState.inventories.loadInventory(
      worldState.db["playerInventories"],
      playerData.id
    );
    worldState.inventories.setInventory(playerData.id, playerInventory);
    worldState.db["players"].methods.updateLastLogin(playerData["id"]);

    let playerEntityId = null;
    if (newPlayer) {
      playerEntityId = worldState.simulation.createNewPlayerEntity(
        playerData.id,
        globalConstants.NEW_USER_ROOMNUM,
        playerStatConstants.START_STATS[playerData.className]["stats"]
      );
    } else {
      const simulationData = JSON.parse(decodeURIComponent(playerData.simulationData));
      playerData["roomNum"] = simulationData["position"]["roomNum"];
      playerEntityId = worldState.simulation.createExistingPlayerEntity(playerData.id, simulationData);
    }
    playerData["eid"] = playerEntityId;
    playerData["user"] = user;
    playerData.sendMessage = sendMessage;
    players["currentActive"][playerData.id] = playerData;
    indexPlayer(playerData);
    this.save(worldState, playerData);
    return playerData;
  },
  logout(worldState, discordId) {
    const userData = this.getActiveByDiscordId(`k${discordId}`);
    this.save(worldState, userData);
    this.removePlayer(worldState, userData.id);
  },
  startPlayer(worldState, playerData) {
    const roomData = worldState.rooms.getEntityRoomData(
      worldState.db["rooms"],
      worldState.simulation.world,
      playerData.eid
    );
    buildRoom(
      worldState,
      playerData.user,
      playerData.eid,
      roomData,
      playerData.admin,
      playerData.userPrefs.autoExits,
      playerData.userPrefs.roomBrief
    );
    worldState.broadcasts.sendToRoom(
      worldState,
      roomData.id,
      playerData.eid,
      false,
      `${emoji.glowing} _${playerData.displayName} has joined the world._`
    );
  },
  save(worldState, userData) {
    const serializedPlayerEntity = worldState.simulation.serializePlayer(userData.eid);
    const playerInventory = worldState.inventories.getActiveInventory(userData.id);
    worldState.db["players"].methods.savePlayer(userData.id, userData, serializedPlayerEntity);
    worldState.inventories.saveInventory(worldState.db["playerInventories"], userData.id, playerInventory);
  },
  addFollower(playerId, eid, player = false) {
    try {
      const playerData = byPlayerId.get(playerId);
      if (playerData && typeof playerData.followers[eid] === "undefined") {
        playerData.followers[eid] = { eid, player };
      }
    } catch (err) {
      logger.error({ err }, `Error adding ${player ? "player" : "mob"} ${playerId} follower ${eid}`);
    }
  },
  removeFollower(eid, followerEid) {
    try {
      const player = this.getActiveByEntityId(eid);
      delete player.followers[followerEid];
    } catch (err) {
      logger.error({ err }, `Error removing player ${eid}'s follower ${followerEid}`);
    }
  },
  isFollower(playerId, followerEid) {
    try {
      const playerData = byPlayerId.get(playerId);
      return playerData?.followers[followerEid] !== undefined;
    } catch (err) {
      logger.error({ err }, `Error checking player ${playerId}'s follower ${followerEid}`);
    }
  },
  setFollowing(playerId, eid, name, player = false) {
    const playerData = byPlayerId.get(playerId);
    if (playerData) {
      playerData.following = eid;
      playerData.followingName = name;
      playerData.followingPlayer = player;
    }
  },
  stopFollowing(playerId) {
    const playerData = byPlayerId.get(playerId);
    if (playerData) {
      playerData.following = null;
      playerData.followingName = "";
      playerData.followingPlayer = false;
    }
  },
  sendCommandAsUser(worldState, playerEntityId, command) {
    const userData = this.getActiveByEntityId(playerEntityId);
    parseCommand(worldState, userData, command);
  },
};

export default players;
