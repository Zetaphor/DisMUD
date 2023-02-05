import systemMessages from "./system";
import parseCommand from "../parseCommand";

/**
 * Handles messages sent by an authenticated user.
 * @param {Object} players - The current players in the simulation.
 * @param {Object} db - The database object.
 * @param {Object} simulation - The current simulation object.
 * @param {Object} msg - The message object sent by the user.
 */
export default async function handleAuthenticatedMessages(players, db, simulation, msg) {
  if (msg.content.toLowerCase() === "logout" || msg.content.toLowerCase() === "quit") {
    try {
      await players.logout(players, simulation, msg.user);
      systemMessages.logout(msg.user);
    } catch (err) {
      console.error(`Error logging out user ${msg.user.id}`);
      systemMessages.logoutFailed(msg.user);
    }
  } else if (msg.content.toLowerCase() === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    parseCommand(simulation, players["currentActive"][msg.user.id], msg.content);
  }
}