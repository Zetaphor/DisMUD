import { adminCommandList, commandList } from "../commands";
import emoji from "../messages/emoji";

export default async function listCommands(worldState, userData, msg) {
  try {
    let availableCommands = commandList;
    if (Number(userData.admin)) availableCommands = adminCommandList.concat(availableCommands);

    userData.user.send(
      `${emoji.openScroll} _The following commmands are available to you:_\n**${availableCommands.join(", ")}**`
    );
  } catch (err) {
    console.error(`Error using listCommands ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
