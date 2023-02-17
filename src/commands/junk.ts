import emoji from "../messages/emoji";

export default async function junk(worldState, userData, msg) {
  try {
    const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
    let matchedItem = null;
    for (const id in inventoryAliases) {
      if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
        if (inventoryAliases[id].indexOf(msg[0]) !== -1) {
          matchedItem = id;
          break;
        }
      }
    }
    if (matchedItem !== null) {
      const item = await worldState.inventories.getInventoryItem(userData.id, matchedItem);
      const junkValue = Math.max(1, Math.min(200, Math.floor(Number(item.data.cost) / 16)));
      await worldState.inventories.updateQuanity(userData.id, item.data.id, -1);
      worldState.players.updatePlayerBank(userData.id, junkValue);
      userData.sendMessage(
        userData.user,
        `${emoji.coins} _You junked ${item.data.shortDesc} and received ${junkValue} gold coins._`
      );
    } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using junk ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
