import logger from "./util/logger";
import { WorldState, UserData } from "./types";
import { commands, commandWords, commandAliases, aliasWords, adminCommands, adminCommandWords } from "./commands";
import systemMessages from "./messages/system";

const fillerWords = ["a", "an", "and", "are", "as", "at", "go", "it", "in", "or", "the", "then", "to", "with"];

export default function parseCommand(worldState: WorldState, userData: UserData, command: string) {
  try {
    let words = command.split(" ").filter((word) => !fillerWords.includes(word));
    const keyword = words[0].toLowerCase();
    if (words.length !== 1) words = words.slice(1);

    if (Boolean(userData.admin) && adminCommandWords.indexOf(keyword) !== -1) {
      adminCommands[keyword](worldState, userData, words);
    } else if (commandWords.indexOf(keyword) !== -1) {
      commands[keyword](worldState, userData, words);
    } else if (aliasWords.indexOf(keyword) !== -1) {
      commandAliases[keyword](worldState, userData, words);
    } else {
      systemMessages.unknownCommand(userData.user, command.split(" ")[0]);
    }
  } catch (err) {
    logger.error({ err }, `Failed to parse command ${command}`);
  }
}
