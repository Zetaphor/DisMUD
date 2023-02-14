import characterCreation from "./characterCreation";
import systemMessages from "./messages/system";

/**
 * Handle messages from unauthenticated users
 * @param {Object} worldState - The state of the world.
 * @param {Object} msg - message object
 */
export default async function msgUnauthenticated(worldState, msg) {
  const playerExists = await worldState.db["players"].methods.playerExists(`k${msg.user.id}`);
  if (!playerExists) {
    if (characterCreation.inCreationQueue(`k${msg.user.id}`)) {
      characterCreation.creationQueueStep(worldState, `k${msg.user.id}`, msg.content);
    } else {
      characterCreation.enterCreationQueue(msg.user);
    }
  } else {
    if (msg.content.toLowerCase() === "login") {
      try {
        const playerData = await worldState.players.login(worldState, msg.user);
        systemMessages.returningPlayer(msg.user);
        worldState.players.startPlayer(worldState, playerData);
      } catch (err) {
        console.error(`Failed to login ${msg.user.username}`, err);
        systemMessages.loginFailed(msg.user);
        worldState.players.logout();
        // worldState.simulation.removeWorldEntity(); // This is going to fail, there's no entity ID
        // TODO: Create automated process to clean up dangling entities
      }
    } else {
      systemMessages.returningSession(msg.user);
    }
  }
}
