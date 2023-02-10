import emoji from "../messages/emoji";

export default async function gold(worldState, userData, msg) {
  try {
    userData.user.send(`${emoji.coins} _You currently have **${userData.gold}** gold coins on your person_`);
  } catch (err) {
    console.error(`Error using gold ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
