import emoji from "../messages/emoji";
import globalConstants from "../simulation/constants/global";

export default async function donate(worldState, userData, msg) {
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

      let donate = Math.random() < 0.75;

      userData.sendMessage(
        userData.user,
        `${emoji.sparkles} _You drop ${item.data.shortDesc} which disappears in a puff of smoke!_`
      );
      worldState.broadcasts.sendToRoom(
        worldState,
        roomNum,
        userData.eid,
        false,
        `_${emoji.sparkles} ${userData.displayName} drops ${item.data.shortDesc} which disappears in a puff of smoke!_`
      );

      if (donate) {
        await worldState.items.placeItem(worldState, item.data, globalConstants.DONATION_ROOMNUM, 1);
        worldState.broadcasts.sendToRoom(
          worldState,
          globalConstants.DONATION_ROOMNUM,
          userData.eid,
          true,
          `_${emoji.sparkles} ${item.data.shortDesc} suddenly appears in a puff a smoke!_`
        );
      }
    } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using donate ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
