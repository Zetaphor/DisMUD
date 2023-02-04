export const players = {
  currentActive: {},
  login: login,
  logout: logout,
  isActive: isActive,
};

function isActive(playerId) {
  if (Object.keys(players.currentActive).indexOf(playerId) !== -1) return true;
  return false;
}

async function login(db, simulation, user) {
  return new Promise<Object>(async (resolve, reject) => {
    try {
      const playerExists = await db.playerExists(BigInt(user.id));
      if (!playerExists) {
        await db.createPlayer({
          discordId: BigInt(user.id),
          discordUsername: `${user.username}#${user.discriminator}`,
          displayName: user.username,
          roomNum: 18600,
        });
      }
      const playerEntityId = await simulation.createPlayerEntity(user.id);
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
