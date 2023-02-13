import emoji from "../messages/emoji";
import globalMessages from "../messages/global";

export default async function policy(worldState, userData, msg) {
  try {
    globalMessages.policy(userData.user);
  } catch (err) {
    console.error(`Error using policy ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
