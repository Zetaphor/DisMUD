import systemMessages from "./system";
import buildRoom from "../roomBuilder";

/**
 * Handle messages from unauthenticated users
 * @param {Object} players - players instance
 * @param {Object} db - database object
 * @param {Object} simulation - simulation instance
 * @param {Object} msg - message object
 */
export default async function handleUnauthenticatedMessages(players, db, simulation, msg) {
  if (msg.content.toLowerCase() === "login") {
    try {
      const newPlayer = await players.login(db["players"], simulation, msg.user);
      if (newPlayer) systemMessages.newPlayer(msg.user);
      else systemMessages.returningPlayer(msg.user);
      systemMessages.loggedIn(msg.user);
      const roomData = await simulation.getPlayerRoomData(players["currentActive"][msg.user.id]["eid"]);
      buildRoom(msg.user, roomData);
    } catch (err) {
      console.log(`Failed to login ${msg.user.username}`, err);
      systemMessages.loginFailed(msg.user);
      players.logout();
      simulation.removePlayerEntity();
    }
  } else {
    systemMessages.newSession(msg.user);
  }
}
