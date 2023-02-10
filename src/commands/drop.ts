import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";
import buildRoom from "../roomBuilder";

export default async function look(worldState, userData, msg) {
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
    let roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

    await worldState.inventories.updateQuanity(userData.id, item.data.id, -1);
    await worldState.items.placeItem(worldState, item.data, roomNum);

    userData.user.send(`${emoji.drop} _You dropped ${item.data.shortDesc} to the ground_`);
  } else userData.user.send(`${emoji.question} _You don't have an item with that name_`);
}
