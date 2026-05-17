import logger from "./logger";
import emoji from "../messages/emoji";
import { CommandHandler } from "../types";

export function wrapCommand(handler: CommandHandler): CommandHandler {
  return (worldState, userData, words) => {
    try {
      return handler(worldState, userData, words);
    } catch (err) {
      logger.error({ err, command: words }, "Command failed");
      userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
    }
  };
}
