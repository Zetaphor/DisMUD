import emoji from "./emoji";
import sendMessage from "./sendMessage";

export const systemMessages = {
  notifyOnline: function (client) {
    client.users.fetch("134317574342180864", false).then((user) => {
      user.send("🟢 System Online");
    });
  },
  returningSession: function (user) {
    sendMessage(user, `
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \nWelcome back to DisMUD ${user.username}!\n\n${emoji.sparkles} You are not currently logged in, type \`login\` to join the world.
    `);
  },
  returningPlayer: function (user) {
    sendMessage(user, `
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \n${emoji.sparkles} Welcome back to DisMUD ${user.username}!\n\nEnjoy the world! ${emoji.sparkles}
    `);
  },
  logout: function (user) {
    sendMessage(user, `
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \nGoodbye ${user.username}!
    `);
  },
  logoutFailed: function (user) {
    sendMessage(user, `
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \n${emoji.error} Failed to log you out.
    `);
  },
  loggedIn: function (user) {
    sendMessage(user, `
      \n${emoji.book} You are now logged in as ${user.username} ${emoji.sparkles}
    `);
  },
  loginFailed: function (user) {
    sendMessage(user, `
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \n${emoji.error} Login failed!
    `);
  },
  alreadyLoggedIn: function (user) {
    sendMessage(user, `
      ${emoji.sword} **__DisMUD__** ${emoji.shield}
      \n😛 You are already logged in as ${user.username} ${emoji.sparkles}
    `);
  },
  unknownCommand: function (user, command) {
    sendMessage(user, `
      \n❓ Unknown command: **${command}**`);
  },
};

export default systemMessages;
