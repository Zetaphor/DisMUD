import emoji from "../messages/emoji";

export default async function drop(worldState, userData, msg) {
  try {
    let roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

    if (msg[0] === "all") {
      const inventoryItems = worldState.inventories.getActiveInventory(userData.id);
      for (const id in inventoryItems) {
        if (Object.prototype.hasOwnProperty.call(inventoryItems, id)) {
          const item = inventoryItems[id];
          dropItem(worldState, userData, roomNum, item, item.qty);
        }
      }
    } else if (/^-?\d+(\.\d+)?$/.test(msg[0])) {
      const dropQuantity = Number(msg[0]);
      const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
      let matchedItem = null;
      for (const id in inventoryAliases) {
        if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
          if (inventoryAliases[id].indexOf(msg[1]) !== -1) {
            matchedItem = id;
            break;
          }
        }
      }
      if (matchedItem !== null) {
        const item = await worldState.inventories.getInventoryItem(userData.id, matchedItem);
        if (item.qty < dropQuantity)
          userData.sendMessage(
            userData.user,
            `${emoji.error} _You do not have that many of \`${item.data.shortDesc}\`._`
          );
        else dropItem(worldState, userData, roomNum, item, 0 - dropQuantity);
      } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
    } else {
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
        dropItem(worldState, userData, roomNum, item, -1);
      } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
    }
  } catch (err) {
    console.error(`Error using drop ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}

async function dropItem(worldState, userData, roomNum, item, quantity) {
  try {
    await worldState.inventories.updateQuanity(userData.id, item.data.id, quantity);
    await worldState.items.placeItem(worldState, item.data, roomNum, Math.abs(quantity));

    userData.sendMessage(
      userData.user,
      `${emoji.drop} _You dropped ${quantity < -1 ? Math.abs(quantity) : ""} ${item.data.shortDesc}${
        quantity < -1 ? "s" : ""
      } to the ground_`
    );
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `_${emoji.drop} ${userData.displayName} dropped ${quantity < -1 ? Math.abs(quantity) : ""} ${
        item.data.shortDesc
      }${quantity < -1 ? "s" : ""} to the ground._`
    );
  } catch (err) {
    console.error(`Error using drop ${item}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
