import emoji from "../messages/emoji";
import globalMessages from "../messages/global";

export default async function info(worldState, userData, msg) {
  try {
    globalMessages.info(userData.user);
  } catch (err) {
    console.error(`Error using info ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
