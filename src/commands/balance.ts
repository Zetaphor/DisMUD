import emoji from "../messages/emoji";

export default async function balance(worldState, userData, msg) {
  try {
    // TODO: Check if they're next to an ATM
    userData.user.send(
      `${emoji.coins} _You currently have **${userData.bank}** gold coins in the bank, and **${userData.gold}** on your person_`
    );
  } catch (err) {
    console.error(`Error using balance ${msg}: ${err}`);
    userData.send(`${emoji.error} _Something went wrong!_`);
  }
}
