import { adminCommandList, commandList } from "../commands";
import emoji from "../messages/emoji";

export default async function listCommands(worldState, userData, msg) {
  let availableCommands = commandList;
  if (Number(userData.admin)) availableCommands = adminCommandList.concat(availableCommands);

  userData.user.send(
    `${emoji.scroll} _The following commmands are available to you:_\n**${availableCommands.join(", ")}**`
  );
}
