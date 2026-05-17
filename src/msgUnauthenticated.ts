import logger from "./util/logger";
import { WorldState } from "./types";
import characterCreation from "./characterCreation";
import systemMessages from "./messages/system";

export default function msgUnauthenticated(worldState: WorldState, msg) {
  const playerExists = worldState.db["players"].methods.playerExists(`k${msg.user.id}`);
  if (!playerExists) {
    if (characterCreation.inCreationQueue(`k${msg.user.id}`)) {
      characterCreation.creationQueueStep(worldState, `k${msg.user.id}`, msg.content);
    } else {
      characterCreation.enterCreationQueue(msg.user);
    }
  } else {
    if (msg.content.toLowerCase() === "login") {
      try {
        const playerData = worldState.players.login(worldState, msg.user, false);
        systemMessages.returningPlayer(msg.user);
        worldState.players.startPlayer(worldState, playerData);
      } catch (err) {
        logger.error({ err }, `Failed to login ${msg.user.username}`);
        systemMessages.loginFailed(msg.user);
        worldState.players.logout(worldState, msg.user.id);
      }
    } else {
      systemMessages.returningSession(msg.user);
    }
  }
}
