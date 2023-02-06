import roomMessages from "./messages/room";
import constants from "./simulation/constants/global";

export const players = {
  currentActive: {},
  login: login,
  logout: logout,
  isActive: isActive,
};

/**
 * Check if the player is currently active
 * @function
 * @param {string} playerId - The player's unique identifier
 * @returns {boolean} - Returns true if the player is active, otherwise false
 */
function isActive(playerId) {
  if (Object.keys(players.currentActive).indexOf(playerId) !== -1) return true;
  return false;
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
async function login(db, simulation, user) {
  return new Promise<Object>(async (resolve, reject) => {
    try {
      const playerExists = await db.playerExists(BigInt(user.id));
      if (!playerExists) {
        await db.createPlayer({
          discordId: BigInt(user.id),
          discordUsername: `${user.username}#${user.discriminator}`,
          displayName: user.username,
          roomNum: constants.NEW_USER_ROOMNUM,
        });
      }
      const playerEntityId = await simulation.createPlayerEntity(user.id, constants.NEW_USER_ROOMNUM);
      players["currentActive"][user.id] = {
        eid: playerEntityId,
        user: user,
      };
      resolve(!playerExists);
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
async function logout(players, simulation, user) {
  return new Promise<void>((resolve, reject) => {
    try {
      simulation.removePlayerEntity(players["currentActive"][user.id].eid);
      delete players["currentActive"][user.id];
      resolve();
    } catch (error) {
      console.error(`Error logging out ${user.username}:`, error);
      reject(error);
    }
  });
}

export default players;
