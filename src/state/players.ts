import emoji from "../messages/emoji";
import sendMessage from "../messages/sendMessage";
import parseCommand from "../parseCommand";
import buildRoom from "../roomBuilder";
import globalConstants from "../simulation/constants/global";
import playerStatConstants from "../simulation/constants/playerStats";

export const players = {
  currentActive: {},
  displayNameExists(db, displayName) {
    return new Promise(async (resolve, reject) => {
      try {
        const exists = await db.methods.displayNameExists(displayName);
        resolve(exists);
      } catch (err) {
        console.error(`Error checking if player exists ${displayName}:`, err);
        reject(err);
      }
    });
  },
  removePlayer(worldState, playerId) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const player = this.currentActive[playerId];
        if (player) {
          worldState.simulation.removeWorldEntity(player.id);
          delete this.currentActive[playerId];
          await worldState.inventories.removeInventory(playerId);
          resolve();
        } else {
          reject(new Error(`Player ${playerId} not found`));
        }
      } catch (err) {
        console.error(`Failed to remove player ${playerId}: ${err}`);
      }
    });
  },
  isActiveEntityId(playerId) {
    if (Object.keys(players.currentActive).indexOf(playerId) !== -1) return true;
    return false;
  },
  isActiveDiscordId(discordId) {
    for (var key in players.currentActive) {
      if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].discordId === discordId) {
        return true;
      }
    }
  },
  getActiveByEntityId(eid) {
    for (var key in players.currentActive) {
      if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].eid === eid) {
        return players.currentActive[key];
      }
    }
  },
  getActiveByPlayerId(playerId) {
    for (var key in players.currentActive) {
      if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].id === playerId) {
        return players.currentActive[key];
      }
    }
  },
  getActiveByDiscordId(discordId) {
    for (var key in players.currentActive) {
      if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].discordId === discordId) {
        return players.currentActive[key];
      }
    }
  },
  getActiveByDisplayName(name) {
    for (var key in players.currentActive) {
      if (
        players.currentActive.hasOwnProperty(key) &&
        players.currentActive[key].displayName.toLowerCase().includes(name.toLowerCase())
      ) {
        return players.currentActive[key];
      }
    }
    return null;
  },
  updatePlayerGold(playerId, amount) {
    if (players.currentActive.hasOwnProperty(playerId)) {
      players.currentActive[playerId].gold += amount;
    }
  },
  updatePlayerBank(playerId, amount) {
    if (players.currentActive.hasOwnProperty(playerId)) {
      players.currentActive[playerId].bank += amount;
    }
  },
  async createNewPlayer(worldState, user, className, displayName) {
    return new Promise(async (resolve, reject) => {
      try {
        let playerData = {};
        console.info(`Creating new player ${user.username} with discordId: ${user.id}`);
        playerData = await worldState.db["players"].methods.createPlayer({
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
            })
          ),
        });
        console.info(`Creating new player ${user.username}'s inventory`);
        await worldState.db["playerInventories"].methods.initPlayerInventory(playerData["id"]);
        resolve(playerData);
      } catch (err) {
        console.error(`Error creating new player ${user.discordId} ${user.username}:`, err);
        reject(err);
      }
    });
  },
  login(worldState, user, newPlayer = false) {
    return new Promise<Object>(async (resolve, reject) => {
      try {
        let playerData = await worldState.db["players"].methods.getPlayerDataByDiscordId(`k${user.id}`);
        if (!playerData) {
          console.error(`Player not found ${user.discordId} ${user.username}`);
          reject();
        } else {
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
          // console.info(`Logging in existing player ${user.username} with discordId: ${playerData["discordId"]}`);
          const playerInventory = await worldState.inventories.loadInventory(
            worldState.db["playerInventories"],
            playerData.id
          );
          worldState.inventories.setInventory(playerData.id, playerInventory);
          await worldState.db["players"].methods.updateLastLogin(BigInt(playerData["id"]));
        }

        let playerEntityId = null;
        if (newPlayer) {
          playerEntityId = await worldState.simulation.createNewPlayerEntity(
            playerData.id,
            globalConstants.NEW_USER_ROOMNUM,
            playerStatConstants.START_STATS[playerData.className]["stats"] // TODO: Load stats from the DB
          );
        } else {
          const simulationData = JSON.parse(decodeURIComponent(playerData.simulationData));
          playerData["roomNum"] = simulationData["position"]["roomNum"];
          playerEntityId = await worldState.simulation.createExistingPlayerEntity(playerData.id, simulationData);
        }
        playerData["eid"] = playerEntityId;
        playerData["user"] = user;
        playerData.sendMessage = sendMessage;
        players["currentActive"][playerData.id] = playerData;
        await this.save(worldState, playerData);
        resolve(playerData);
      } catch (err) {
        console.error(`Error logging in ${user.username}:`, err);
        reject(err);
      }
    });
  },
  logout(worldState, discordId) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const userData = this.getActiveByDiscordId(`k${discordId}`);
        await this.save(worldState, userData);
        await this.removePlayer(worldState, userData.id);
        resolve();
      } catch (error) {
        console.error(`Error logging out ${discordId}:`, error);
        reject(error);
      }
    });
  },
  async startPlayer(worldState, playerData) {
    const roomData = await worldState.rooms.getEntityRoomData(
      worldState.db["rooms"],
      worldState.simulation.world,
      playerData.eid
    );
    buildRoom(worldState, playerData.user, playerData.eid, roomData, playerData.admin);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomData.id,
      playerData.eid,
      false,
      `${emoji.glowing} _${playerData.displayName} has joined the world._`
    );
  },
  save(worldState, userData) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const serializedPlayerEntity = await worldState.simulation.serializePlayer(userData.eid);
        const playerInventory = worldState.inventories.getActiveInventory(userData.id);
        await worldState.db["players"].methods.savePlayer(userData.id, userData, serializedPlayerEntity);
        await worldState.inventories.saveInventory(worldState.db["playerInventories"], userData.id, playerInventory);
        resolve();
      } catch (error) {
        console.error(`Error saving player ${userData.id} ${userData.displayName}:`, error);
        reject(error);
      }
    });
  },
  addFollower(playerId, eid, player = false) {
    try {
      if (typeof this.currentActive[playerId].followers[eid] === "undefined") {
        this.currentActive[playerId].followers[eid] = {
          eid: eid,
          player: player,
        };
      }
    } catch (err) {
      console.error(`Error adding ${player ? "player" : "mob"} ${playerId} follower ${eid}: ${err}`);
    }
  },
  removeFollower(eid, followerEid) {
    try {
      let player = this.getActiveByEntityId(eid);
      delete this.currentActive[player.id].followers[followerEid];
    } catch (err) {
      console.error(`Error removing player ${eid}'s follower ${followerEid}: ${err}`);
    }
  },
  isFollower(playerId, followerEid) {
    try {
      return this.currentActive[playerId].followers[followerEid] !== undefined;
    } catch (err) {
      console.error(`Error checking player ${playerId}'s follower ${followerEid}: ${err}`);
    }
  },
  setFollowing(playerId, eid, name, player = false) {
    this.currentActive[playerId].following = eid;
    this.currentActive[playerId].followingName = name;
    this.currentActive[playerId].followingPlayer = player;
  },
  stopFollowing(playerId) {
    this.currentActive[playerId].following = null;
    this.currentActive[playerId].followingName = "";
    this.currentActive[playerId].followingPlayer = false;
  },
  sendCommandAsUser(worldState, playerId, command) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        const userData = worldState.players.getActiveByPlayerId(playerId);
        parseCommand(worldState, userData, command);
        resolve();
      } catch (err) {
        console.error(`Error sending command ${command} as player ${playerId}:`, err);
        reject(err);
      }
    });
  },
};

export default players;
