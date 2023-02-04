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
  return new Promise((resolve, reject) => {
    db.playerExists(BigInt(user.id))
      .then((exists) => {
        if (exists) {
          user.currentActive[user.id] = user;
          // Send the user a message saying they logged in
          resolve(true);
        }
      })
      .catch((err) => {
        console.error(`Error logging in ${user.username}:`, err);
        reject(err);
      });
    db.console.log(`Logging in user ${user.username}`);
  });
}

async function logout(db, user) {
  console.log(`Logging out user ${user.username}`);
}

export default players;
