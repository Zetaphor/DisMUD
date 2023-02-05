import { commands, commandAliases } from "./bot/commands";
import systemMessages from "./bot/systemMessages";

const fillerWords = ["a", "an", "and", "are", "as", "at", "go", "it", "in", "or", "the", "then", "to", "with"];
const commandWords = Object.keys(commands);
const aliasWords = Object.keys(commandAliases);

export default function parseCommand(simulation, userData, command) {
  let words = command.split(" ").filter((word) => !fillerWords.includes(word));
  const commandWord = words[0].toLowerCase();
  if (words.length !== 1) words = words.slice(1);

  if (commandWords.indexOf(commandWord) !== -1) {
    commands[commandWord](simulation, userData, words);
  } else if (aliasWords.indexOf(commandWord) !== -1) {
    commandAliases[commandWord](simulation, userData, words);
  } else {
    systemMessages.unknownCommand(userData.user, words[0]);
  }
}
