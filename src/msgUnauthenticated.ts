import systemMessages from "./messages/system";
import buildRoom from "./roomBuilder";

/**
 * Handle messages from unauthenticated users
 * @param {Object} worldState - The state of the world.
 * @param {Object} msg - message object
 */
export default async function msgUnauthenticated(worldState, msg) {
  if (msg.content.toLowerCase() === "login") {
    try {
      const newPlayer = await worldState.players.login(worldState, msg.user);
      systemMessages.loggedIn(msg.user);
      if (newPlayer) systemMessages.newPlayer(msg.user);
      else systemMessages.returningPlayer(msg.user);
      const roomData = await worldState.rooms.getPlayerRoomData(
        worldState.simulation.world,
        worldState.players.getActiveByDiscordId(BigInt(msg.user.id))["eid"]
      );
      buildRoom(msg.user, roomData);
    } catch (err) {
      console.log(`Failed to login ${msg.user.username}`, err);
      systemMessages.loginFailed(msg.user);
      worldState.players.logout();
      worldState.simulation.removePlayerEntity();
    }
  } else {
    systemMessages.newSession(msg.user);
  }
}
