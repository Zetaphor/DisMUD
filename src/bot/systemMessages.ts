export const systemMessages = {
  notifyOnline: function (client) {
    client.users.fetch("134317574342180864", false).then((user) => {
      user.send("🟢 System Online");
    });
  },
  newSession: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \nWelcome to RPG Bot ${user.username}!\n\n✨ You are currently unauthenticated, type \`login\` to join the world.
      \nIf you are new, a player account will automatically be created for you ✨
    `);
  },
  newPlayer: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \n✨ Welcome to RPG Bot ${user.username}!\n\n You now have a user account.\n\nEnjoy the world! ✨
    `);
  },
  returningPlayer: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \n✨ Welcome back to RPG Bot ${user.username}!\n\nEnjoy the world! ✨
    `);
  },
  logout: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \nGoodbye ${user.username}!
    `);
  },
  logoutFailed: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \n⛔ Failed to log you out.
    `);
  },
  loggedIn: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \nYou are now logged in as ${user.username} ✨
    `);
  },
  loginFailed: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \n⛔ Login failed!
    `);
  },
  alreadyLoggedIn: function (user) {
    user.send(`
      🗡️ **__RPG Bot__** 🛡️
      \n😛 You are already logged in as ${user.username} ✨
    `);
  },
  unknownCommand: function (user, command) {
    user.send(`
      \n❓ Unknown command: **${command}**`);
  },
};

export default systemMessages;
