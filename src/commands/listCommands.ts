import { adminCommandList, commandList } from "../commands";
import emoji from "../messages/emoji";

export default async function listCommands(worldState, userData, msg) {
  try {
    let availableCommands = commandList;
    if (Number(userData.admin)) availableCommands = adminCommandList.concat(availableCommands);

    userData.sendMessage(
      userData.user,
      `${
        emoji.openScroll
      } _Type_ \`help <command name>\` _to get help on a specific command._\n_The following commmands are available to you:_\n**${availableCommands.join(
        ", "
      )}**`
    );
  } catch (err) {
    console.error(`Error using listCommands ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
