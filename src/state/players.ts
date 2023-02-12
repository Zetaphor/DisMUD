import globalConstants from "../simulation/constants/global";
import playerStatConstants from "../simulation/constants/playerStats";

export const players = {
  currentActive: {},

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
  login(worldState, user) {
    return new Promise<Object>(async (resolve, reject) => {
      try {
        let playerData = await worldState.db["players"].methods.getPlayerDataByDiscordId(`k${user.id}`);
        let playerInventory = {};
        let newPlayer = false;
        if (!playerData) {
          newPlayer = true;
          console.info(`Creating new player ${user.username} with discordId: ${user.id}`);
          playerData = await worldState.db["players"].methods.createPlayer({
            discordId: `k${user.id}`,
            discordUsername: `${user.username}#${user.discriminator}`,
            displayName: user.username,
            roomNum: globalConstants.NEW_USER_ROOMNUM,
          });
          console.info(`Creating new player ${user.username}'s inventory`);
          await worldState.db["playerInventories"].methods.initPlayerInventory(playerData.id);
        } else {
          // console.info(`Logging in existing player ${user.username} with discordId: ${playerData["discordId"]}`);
          const playerInventory = await worldState.inventories.loadInventory(
            worldState.db["playerInventories"],
            playerData.id
          );
          worldState.inventories.setInventory(playerData.id, playerInventory);
          await worldState.db["players"].methods.updateLastLogin(BigInt(playerData["id"]));
        }
        const playerEntityId = await worldState.simulation.createPlayerEntity(
          playerData.id,
          globalConstants.NEW_USER_ROOMNUM,
          playerStatConstants.START_STATS.warrior.stats // TODO: Load stats from the DB
        );
        playerData["newPlayer"] = newPlayer;
        playerData["eid"] = playerEntityId;
        playerData["user"] = user;
        players["currentActive"][playerData.id] = playerData;
        resolve(playerData);
      } catch (err) {
        console.error(`Error logging in ${user.username}:`, err);
        reject(err);
      }
    });
  },
  logout(id, players, simulation, user) {
    return new Promise<void>((resolve, reject) => {
      try {
        simulation.removeWorldEntity(players["currentActive"][id].eid);
        delete players["currentActive"][user.id];
        resolve();
      } catch (error) {
        console.error(`Error logging out ${user.username}:`, error);
        reject(error);
      }
    });
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
};

export default players;
