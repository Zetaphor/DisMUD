import emoji from "../messages/emoji";

export default async function look(worldState, userData, msg) {
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
      let roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

      await worldState.inventories.updateQuanity(userData.id, item.data.id, -1);
      await worldState.items.placeItem(worldState, item.data, roomNum);

      userData.user.send(`${emoji.drop} _You dropped ${item.data.shortDesc} to the ground_`);
      worldState.broadcasts.sendToRoom(
        worldState,
        roomNum,
        userData.eid,
        false,
        `_${emoji.drop} ${userData.displayName} dropped ${item.data.shortDesc} to the ground._`
      );
    } else userData.user.send(`${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using drop ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
