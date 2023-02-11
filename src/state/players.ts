import globalConstants from "../simulation/constants/global";

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
  getActiveByDiscordId(discordId) {
    for (var key in players.currentActive) {
      if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].discordId === discordId) {
        return players.currentActive[key];
      }
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
          const loadedInventory = await worldState.db["playerInventories"].methods.getPlayerInventory(
            BigInt(playerData.id)
          );
          if (loadedInventory.inventoryString !== "") playerInventory = JSON.parse(loadedInventory.inventoryString);
          worldState.inventories.setInventory(playerData.id, playerInventory);
          await worldState.db["players"].methods.updateLastLogin(BigInt(playerData["id"]));
        }
        const playerEntityId = await worldState.simulation.createPlayerEntity(
          playerData.id,
          globalConstants.NEW_USER_ROOMNUM
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
};

export default players;
