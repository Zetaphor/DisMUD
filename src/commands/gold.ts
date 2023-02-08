import emoji from "../messages/emoji";

export default async function gold(worldState, userData, msg) {
  userData.user.send(`${emoji.coins} _You currently have **${userData.gold}** gold coins on your person_`);
}
