import logger from "./util/logger";
import { WorldState } from "./types";
import systemMessages from "./messages/system";
import parseCommand from "./parseCommand";

export default function msgAuthenticated(worldState: WorldState, msg) {
  if (msg.content.toLowerCase() === "logout" || msg.content.toLowerCase() === "quit") {
    try {
      worldState.players.logout(worldState, msg.user.id);
      systemMessages.logout(msg.user);
    } catch (err) {
      logger.error({ err }, `Error logging out user ${msg.user.id}`);
      systemMessages.logoutFailed(msg.user);
    }
  } else if (msg.content.toLowerCase() === "login") {
    systemMessages.alreadyLoggedIn(msg.user);
  } else {
    if (msg.content.includes("; ")) {
      const commands = msg.content.split("; ");
      for (let i = 0; i < commands.length; i++) {
        parseCommand(worldState, worldState.players.getActiveByDiscordId(`k${msg.user.id}`), commands[i]);
      }
    } else parseCommand(worldState, worldState.players.getActiveByDiscordId(`k${msg.user.id}`), msg.content);
  }
}
