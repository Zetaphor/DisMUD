import emoji from "../messages/emoji";

export default async function pour(worldState, userData, msg) {
  try {
    const targetItem = msg[0].trim().toLowerCase();
    const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
    let matchedItem = null;
    for (const id in inventoryAliases) {
      if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
        if (inventoryAliases[id].indexOf(targetItem.toLowerCase()) !== -1) {
          matchedItem = id;
          break;
        }
      }
    }
    if (matchedItem !== null) {
      const item = await worldState.inventories.getInventoryItem(userData.id, matchedItem);
      if (typeof item["data"]["stateData"] === "undefined" || item["data"]["stateData"]["type"] !== "drinkContainer") {
        userData.sendMessage(userData.user, `${emoji.error} _You cannot drink from ${item.data.shortDesc}!_`);
        return;
      } else if (item["data"]["stateData"]["current"] === 0) {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You can't pour out ${item.data.shortDesc} because it's already empty!_`
        );
        return;
      } else {
        worldState.inventories.updateItemStateData(userData.id, item.data.id, "current", 0);
        userData.sendMessage(
          userData.user,
          `${emoji.bottle} _You pour the contents of ${item.data.shortDesc} onto the ground._`
        );
        let roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
        worldState.broadcasts.sendToRoom(
          worldState,
          roomNum,
          userData.eid,
          false,
          `_${emoji.bottle} ${userData.displayName} empties a container onto the ground._`
        );
      }
    } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using pour ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
