import emoji from "../messages/emoji";

export default async function balance(worldState, userData, msg) {
  try {
    // TODO: Check if they're next to an ATM
    userData.sendMessage(
      userData.user,
      `${emoji.coins} _You currently have **${userData.bank}** gold coins in the bank, and **${userData.gold}** on your person_`
    );
  } catch (err) {
    console.error(`Error using balance ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
