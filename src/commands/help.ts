import emoji from "../messages/emoji";
import { helpKeys, helpMessages } from "../messages/help";

export default function help(worldState, userData, msg) {
  try {
    const keyword = msg[0].toLowerCase().trim();
    if (helpKeys.indexOf(keyword) !== -1) {
      userData.sendMessage(userData.user, helpMessages[keyword]);
    } else {
      userData.sendMessage(
        userData.user,
        `${emoji.error} _I don't know that command! Try using_ \`commands\` _to see a list of available commands._`
      );
    }
  } catch (err) {
    console.error(`Error using help ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
