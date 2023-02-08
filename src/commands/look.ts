import emoji from "../messages/emoji";
import objectConstants from "../messages/objectConstants";
import buildRoom from "../roomBuilder";

export default async function look(worldState, userData, msg) {
  if (msg[0] === "look") {
    const roomData = await worldState.rooms.getPlayerRoomData(worldState.simulation.world, userData.eid);
    buildRoom(userData.user, roomData);
  } else {
    let moveDir = "";
    if (msg[0] === "n" || msg[0] === "north") {
      moveDir = "north";
    } else if (msg[0] === "s" || msg[0] === "south") {
      moveDir = "south";
    } else if (msg[0] === "e" || msg[0] === "east") {
      moveDir = "east";
    } else if (msg[0] === "w" || msg[0] === "west") {
      moveDir = "west";
    } else if (msg[0] === "u" || msg[0] === "up") {
      moveDir = "up";
    } else if (msg[0] === "d" || msg[0] === "down") {
      moveDir = "down";
    }

    if (moveDir !== "") {
      // Look move direction
      const roomExits = await worldState.rooms.getPlayerRoomExits(worldState.simulation.world, userData.eid);
      if (roomExits[moveDir] && roomExits[moveDir]["desc"].length) {
        userData.user.send(`${emoji.binoculars} _${roomExits[moveDir]["desc"]}_`);
      } else {
        userData.user.send(`${emoji.blind} _You can't see anything in that direction_`);
      }
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
        userData.user.send(`
          ${emoji.examine} **${item.data.shortDesc}**\n
          ${objectConstants.types[item.data.type]}
        `);
      } else userData.user.send(`${emoji.question} _You don't have an item with that name_`);
    }
  }
}