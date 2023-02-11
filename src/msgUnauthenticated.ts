import emoji from "./messages/emoji";
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
      const playerData = await worldState.players.login(worldState, msg.user);
      // systemMessages.loggedIn(msg.user);
      if (playerData.newPlayer) systemMessages.newPlayer(msg.user);
      else systemMessages.returningPlayer(msg.user);
      const roomData = await worldState.rooms.getEntityRoomData(
        worldState.db["rooms"],
        worldState.simulation.world,
        playerData.eid
      );
      buildRoom(worldState, msg.user, playerData.eid, roomData, playerData.admin);
      worldState.broadcasts.sendToRoom(
        worldState,
        roomData.id,
        playerData.eid,
        false,
        `${emoji.glowing} _${playerData.displayName} has joined the world._`
      );
    } catch (err) {
      console.error(`Failed to login ${msg.user.username}`, err);
      systemMessages.loginFailed(msg.user);
      worldState.players.logout();
      // worldState.simulation.removeWorldEntity(); // This is going to fail, there's no entity ID
    }
  } else {
    systemMessages.newSession(msg.user);
  }
}
