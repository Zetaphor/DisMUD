import emoji from "./emoji";

export const systemMessages = {
  notifyOnline: function (client) {
    client.users.fetch("134317574342180864", false).then((user) => {
      user.send("🟢 System Online");
    });
  },
  returningSession: function (user) {
    user.send(`
      ${emoji.sword} **__RPG Bot__** ${emoji.shield}
      \nWelcome back to RPG Bot ${user.username}!\n\n${emoji.sparkles} You are not currently logged in, type \`login\` to join the world.
    `);
  },
  returningPlayer: function (user) {
    user.send(`
      ${emoji.sword} **__RPG Bot__** ${emoji.shield}
      \n${emoji.sparkles} Welcome back to RPG Bot ${user.username}!\n\nEnjoy the world! ${emoji.sparkles}
    `);
  },
  logout: function (user) {
    user.send(`
      ${emoji.sword} **__RPG Bot__** ${emoji.shield}
      \nGoodbye ${user.username}!
    `);
  },
  logoutFailed: function (user) {
    user.send(`
      ${emoji.sword} **__RPG Bot__** ${emoji.shield}
      \n${emoji.error} Failed to log you out.
    `);
  },
  loggedIn: function (user) {
    user.send(`
      \n${emoji.book} You are now logged in as ${user.username} ${emoji.sparkles}
    `);
  },
  loginFailed: function (user) {
    user.send(`
      ${emoji.sword} **__RPG Bot__** ${emoji.shield}
      \n${emoji.error} Login failed!
    `);
  },
  alreadyLoggedIn: function (user) {
    user.send(`
      ${emoji.sword} **__RPG Bot__** ${emoji.shield}
      \n😛 You are already logged in as ${user.username} ${emoji.sparkles}
    `);
  },
  unknownCommand: function (user, command) {
    user.send(`
      \n❓ Unknown command: **${command}**`);
  },
};

export default systemMessages;
