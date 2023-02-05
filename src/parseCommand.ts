import { commands, commandAliases } from "./bot/commands";
import systemMessages from "./bot/systemMessages";

const fillerWords = ["a", "an", "and", "are", "as", "at", "go", "it", "in", "or", "the", "then", "to", "with"];
const commandWords = Object.keys(commands);
const aliasWords = Object.keys(commandAliases);

export default function parseCommand(simulation, userData, command) {
  let words = command.split(" ");
  words = words.filter((word) => !fillerWords.includes(word));

  if (commandWords.indexOf(words[0].toLowerCase()) !== -1) {
    commands[words[0].toLowerCase()](simulation, userData, words.slice(1));
  } else if (aliasWords.indexOf(words[0].toLowerCase()) !== -1) {
    console.log(words[0].toLowerCase());
    console.log(commandAliases[words[0].toLowerCase()]);
    commandAliases[words[0].toLowerCase()](simulation, userData, words.slice(1));
  } else {
    systemMessages.unknownCommand(userData.user, words[0]);
  }
}
