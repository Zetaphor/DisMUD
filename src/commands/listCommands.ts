import { commandList } from "../commands";
import emoji from "../messages/emoji";

export default async function listCommands(simulation, userData, msg) {
  userData.user.send(`${emoji.scroll} _The following commmands are available to you:_\n**${commandList.join(", ")}**`);
}
