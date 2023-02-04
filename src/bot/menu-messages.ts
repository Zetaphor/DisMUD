export const menuMessages = {
  newSession: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \nWelcome ${user.username}to RPG Bot!\n\n✨ You are currently unauthenticated, type \`login\` to join the world.
      \nIf you are new, a player account will automatically be created for you ✨
    `);
    console.log(user);
  },
  logout: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \nGoodbye ${user.username}!
    `);
    console.log(user);
  },
  alreadyLoggedout: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \nYou are already logged out!
    `);
    console.log(user);
  },
};

export default menuMessages;
