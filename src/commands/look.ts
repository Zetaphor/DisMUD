import emoji from "../messages/emoji";
import itemConstants from "../messages/itemConstants";
import buildRoom from "../roomBuilder";

export default async function look(worldState, userData, msg) {
  if (msg[0] === "look") {
    const roomData = await worldState.rooms.getEntityRoomData(
      worldState.db["rooms"],
      worldState.simulation.world,
      userData.eid
    );
    buildRoom(worldState, userData.user, roomData);
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

    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

    if (moveDir !== "") {
      // Look move direction
      const roomExits = await worldState.rooms.getRoomExits(worldState.simulation.world, roomNum);
      if (roomExits[moveDir] && roomExits[moveDir]["desc"].length) {
        userData.user.send(`${emoji.binoculars} _${roomExits[moveDir]["desc"]}_`);
        return;
      } else {
        userData.user.send(`${emoji.blind} _You can't see anything in that direction._`);
        return;
      }
    } else {
      let foundLookTarget = false;
      let targetData = null;
      let targetingObject = false;
      let targetingObjectInventory = false;

      const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
      for (const id in inventoryAliases) {
        if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
          if (inventoryAliases[id].indexOf(msg[0]) !== -1) {
            targetData = await worldState.inventories.getInventoryItem(userData.id, id);
            targetData = targetData["data"];
            targetingObject = true;
            targetingObjectInventory = true;
            break;
          }
        }
      }

      // We didn't find an object in inventory, look in the room
      if (!targetingObject) {
        const roomItems = worldState.rooms.getItemsInRoom(worldState.simulation.world, roomNum);

        for (let i = 0; i < roomItems.length; i++) {
          const roomItemData = worldState.items.getActiveItemData(roomItems[i]);
          for (let i = 0; i < roomItemData.aliases.length; i++) {
            if (roomItemData.aliases[i].indexOf(msg[0]) !== -1) {
              targetData = roomItemData;
              targetingObject = true;
              i = roomItemData.aliases.length;
            }
          }
        }
      }

      // We didn't find any objects, look for mobs
      if (!targetingObject) {
        const roomMobs = worldState.rooms.getMobsInRoom(worldState.simulation.world, roomNum);

        for (let i = 0; i < roomMobs.length; i++) {
          const roomMobData = worldState.mobs.getActiveMobData(roomMobs[i]);
          for (let i = 0; i < roomMobData.aliases.length; i++) {
            if (roomMobData.aliases[i].indexOf(msg[0]) !== -1) {
              targetData = roomMobData;
              targetingObject = false;
              i = roomMobData.aliases.length;
            }
          }
        }
      }

      if (targetData === null) {
        userData.user.send(`${emoji.question} _You do not see that here._`);
        return;
      } else if (targetingObject) {
        let itemTitle = `${emoji.examine} **${
          targetData.shortDesc.charAt(0).toUpperCase() + targetData.shortDesc.slice(1)
        }**`;
        if (targetingObjectInventory) itemTitle += " _(In Inventory)_";
        itemTitle += "\n";
        userData.user.send(`
            ${itemTitle}${itemConstants.types[targetData.type]}
          `);
        if (targetingObjectInventory) {
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `${emoji.eye} _${userData.displayName} looks at an object in their inventory._`
          );
        } else {
          worldState.broadcasts.sendToRoom(
            worldState,
            roomNum,
            userData.eid,
            false,
            `${emoji.eye} _${userData.displayName} looks at ${targetData.shortDesc}._`
          );
        }
      } else {
        userData.user.send(`
            ${emoji.examine} _You look at ${targetData.shortDesc}_\n
            ${targetData.detailedDesc}
          `);
        worldState.broadcasts.sendToRoom(
          worldState,
          roomNum,
          userData.eid,
          false,
          `${emoji.eye} _${userData.displayName} looks at ${targetData.shortDesc}._`
        );
      }
    }
  }
}
