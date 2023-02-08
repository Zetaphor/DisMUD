import emoji from "../messages/emoji";

export default async function balance(worldState, userData, msg) {
  // TODO: Check if they're next to an ATM
  userData.user.send(
    `${emoji.coins} _You currently have **${userData.bank}** gold coins in the bank, and **${userData.gold}** on your person_`
  );
}
