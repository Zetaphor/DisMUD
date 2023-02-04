export const players = {
  currentActive: {},
  login: login,
  logout: logout,
  checkActive: checkActive,
};

function checkActive(playerId) {
  if (Object.keys(players.currentActive).indexOf(playerId) !== -1) return true;
  return false;
}

async function login(db, user) {
  return new Promise<Boolean>((resolve, reject) => {
    db.playerExists(BigInt(user.id))
      .then((exists) => {
        if (exists) {
          players["currentActive"][user.id] = user;
          resolve(false);
        } else {
          db.createPlayer({
            discordId: BigInt(user.id),
            discordUsername: `${user.username}#${user.discriminator}`,
            displayName: user.username,
            roomNum: 18600,
          })
            .then(() => {
              players["currentActive"][user.id] = user;
              resolve(true);
            })
            .catch((err) => {
              console.error(`Error creating player ${user.username}: ${err}`);
              reject(err);
            });
        }
      })
      .catch((err) => {
        console.error(`Error logging in ${user.username}:`, err);
        reject(err);
      });
  });
}

async function logout(user) {
  delete players["currentActive"][user.id];
  // console.log(`Logging out user ${user.username}`);
}

export default players;
