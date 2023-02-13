import emoji from "../messages/emoji";
import globalMessages from "../messages/global";

export default async function info(worldState, userData, msg) {
  try {
    globalMessages.info(userData.user);
  } catch (err) {
    console.error(`Error using info ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
