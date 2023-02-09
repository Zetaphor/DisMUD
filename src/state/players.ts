import globalConstants from "../simulation/constants/global";

export const players = {
  currentActive: {},
  login,
  logout,
  isActiveId,
  isActiveDiscordId,
  getActiveById,
  getActiveByDiscordId,
};

/**
 * Check if the player is currently active
 * @function
 * @param {string} playerId - The player's unique identifier
 * @returns {boolean} - Returns true if the player is active, otherwise false
 */
function isActiveId(playerId) {
  if (Object.keys(players.currentActive).indexOf(playerId) !== -1) return true;
  return false;
}

/**
 * Check if the player is currently active using a discordId
 * @function
 * @param {string} discordId - The player's Discord ID
 * @returns {boolean} - Returns true if the player is active, otherwise false
 */
function isActiveDiscordId(discordId) {
  for (var key in players.currentActive) {
    if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].discordId === discordId) {
      return true;
    }
  }
}

/**
 * Get an active player by ID
 * @param playerId - The player's unique identifier
 * @returns {Object} - The players data
 */
function getActiveById(playerId) {
  return players.currentActive[playerId];
}

/**
 * Get an active player by Discord ID
 * @param discordId - The player's Discord ID
 * @returns {Object} - The players data
 */
function getActiveByDiscordId(discordId) {
  for (var key in players.currentActive) {
    if (players.currentActive.hasOwnProperty(key) && players.currentActive[key].discordId === discordId) {
      return players.currentActive[key];
    }
  }
}

/**
 * Logs a player into the system
 * @async
 * @function
 * @param {object} db - The database object
 * @param {object} simulation - The simulation object
 * @param {object} user - The player's user object
 * @returns {Promise<Object>} - Returns a promise that resolves to a boolean indicating whether the player was just created (true) or already exists (false)
 */
async function login(worldState, user) {
  return new Promise<Object>(async (resolve, reject) => {
    try {
      let playerData = await worldState.db["players"].methods.getPlayerDataByDiscordId(BigInt(user.id));
      let playerInventory = {};
      if (!playerData) {
        console.log(`Creating new player ${user.username}`);
        playerData = await worldState.db["players"].methods.createPlayer({
          discordId: BigInt(user.id),
          discordUsername: `${user.username}#${user.discriminator}`,
          displayName: user.username,
          roomNum: globalConstants.NEW_USER_ROOMNUM,
        });
        console.log(`Creating new player ${user.username}'s inventory`);
        await worldState.db["playerInventories"].methods.initPlayerInventory(playerData.id);
      } else {
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
      playerData["eid"] = playerEntityId;
      playerData["user"] = user;
      players["currentActive"][playerData.id] = playerData;
      resolve(!playerData);
    } catch (err) {
      console.error(`Error logging in ${user.username}:`, err);
      reject(err);
    }
  });
}

/**
 * Logs a player out of the system
 * @async
 * @function
 * @param {object} players - The players object
 * @param {object} simulation - The simulation object
 * @param {object} user - The player's user object
 * @returns {Promise<void>} - Returns a promise that resolves when the player has been successfully logged out
 */
async function logout(id, players, simulation, user) {
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
}

function initPlayerStats() {
  return {};
}

export default players;
