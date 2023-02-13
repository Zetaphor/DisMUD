import systemMessages from "./messages/system";
import parseCommand from "./parseCommand";

/**
 * Handles messages sent by an authenticated user.
 * @param {Object} worldState - The state of the world.
 * @param {Object} msg - The message object sent by the user.
 */
export default async function msgAuthenticated(worldState, msg) {
  if (msg.content.toLowerCase() === "logout" || msg.content.toLowerCase() === "quit") {
    try {
      await worldState.players.logout(worldState, msg.user.id);
      systemMessages.logout(msg.user);
    } catch (err) {
      console.error(`Error logging out user ${msg.user.id}`);
      systemMessages.logoutFailed(msg.user);
    }
  } else if (msg.content.toLowerCase() === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    if (msg.content.includes("; ")) {
      const commands = msg.content.split("; ");
      for (let i = 0; i < commands.length; i++) {
        await parseCommand(worldState, worldState.players.getActiveByDiscordId(`k${msg.user.id}`), commands[i]);
      }
    } else parseCommand(worldState, worldState.players.getActiveByDiscordId(`k${msg.user.id}`), msg.content);
  }
}
