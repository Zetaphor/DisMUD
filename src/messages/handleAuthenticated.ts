import systemMessages from "./system";
import parseCommand from "../parseCommand";

/**
 * Handles messages sent by an authenticated user.
 * @param {Object} worldState - The state of the world.
 * @param {Object} msg - The message object sent by the user.
 */
export default async function handleAuthenticatedMessages(worldState, msg) {
  if (msg.content.toLowerCase() === "logout" || msg.content.toLowerCase() === "quit") {
    try {
      await worldState.players.logout(worldState.players, worldState.simulation, msg.user);
      systemMessages.logout(msg.user);
    } catch (err) {
      console.error(`Error logging out user ${msg.user.id}`);
      systemMessages.logoutFailed(msg.user);
    }
  } else if (msg.content.toLowerCase() === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    parseCommand(worldState, worldState.players["currentActive"][msg.user.id], msg.content);
  }
}
