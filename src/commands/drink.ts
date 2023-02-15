import emoji from "../messages/emoji";
import globalConstants from "../messages/globalConstants";

export default async function drink(worldState, userData, msg) {
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
          `${emoji.error} _You can't drink from ${item.data.shortDesc} because it's empty!_`
        );
        return;
      } else {
        worldState.inventories.updateItemStateData(
          userData.id,
          item.data.id,
          "current",
          item["data"]["stateData"]["current"] - 1
        );
        userData.sendMessage(
          userData.user,
          `${emoji.bottle} _You drink ${
            globalConstants.liquidTypes[item.data.stateData.liquidType.toString()]["type"]
          } from ${item.data.shortDesc}._`
        );
        let roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
        worldState.broadcasts.sendToRoom(
          worldState,
          roomNum,
          userData.eid,
          false,
          `_${emoji.bottle} ${userData.displayName} takes a drink from a container._`
        );
      }
    } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using drink ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
