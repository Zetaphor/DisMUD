import emoji from "../messages/emoji";
import globalMessages from "../messages/global";

export default async function motd(worldState, userData, msg) {
  try {
    globalMessages.motd(userData.user);
  } catch (err) {
    console.error(`Error using motd ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
