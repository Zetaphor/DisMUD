import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";

export default async function wear(worldState, userData, msg) {
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
      const equipSlot = Number(item.data.wear) - 1;
      if (typeof userData.equipment[equipSlot] !== "undefined") {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You already wearing something ${itemConstants.slot_names[equipSlot]}!_`
        );
        return;
      } else {
        await worldState.inventories.updateQuanity(userData.id, item.data.id, -1);
        userData.equipment[equipSlot] = item.data;
        userData.sendMessage(
          userData.user,
          `${emoji.check} _You put ${item.data.shortDesc} ${itemConstants.slot_names[equipSlot]}._`
        );
      }
    } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using wear ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
