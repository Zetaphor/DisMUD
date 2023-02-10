import emoji from "../messages/emoji";
import globalMessages from "../messages/global";

export default async function news(worldState, userData, msg) {
  try {
    globalMessages.news(userData.user);
  } catch (err) {
    console.error(`Error using news ${msg}: ${err}`);
    userData.send(`${emoji.error} _Something went wrong!_`);
  }
}
