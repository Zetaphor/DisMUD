import { commands, commandWords, commandAliases, aliasWords, adminCommands, adminCommandWords } from "./commands";
import systemMessages from "./messages/system";

const fillerWords = ["a", "an", "and", "are", "as", "at", "go", "it", "in", "or", "the", "then", "to", "with"];

/**
 * Parses the user's command and executes the corresponding function.
 * @param {Object} worldState - The state of the world.
 * @param {Object} userData - The user data.
 * @param {string} command - The command string inputted by the user.
 */
export default function parseCommand(worldState, userData, command) {
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
    systemMessages.unknownCommand(userData.user, words[0]);
  }
}
