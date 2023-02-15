import emoji from "../messages/emoji";
import globalConstants from "../messages/globalConstants";

export default async function fill(worldState, userData, msg) {
  try {
    if (msg.length !== 2) {
      userData.sendMessage(
        userData.user,
        `${emoji.error} _You must specify a container and a source to fill it from._`
      );
      return;
    }
    const targetItemName = msg[0].trim().toLowerCase();
    const sourceItemName = msg[1].trim().toLowerCase();

    const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
    let matchedItem = null;
    for (const id in inventoryAliases) {
      if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
        if (inventoryAliases[id].indexOf(targetItemName.toLowerCase()) !== -1) {
          matchedItem = id;
          break;
        }
      }
    }
    if (matchedItem !== null) {
      const targetItem = await worldState.inventories.getInventoryItem(userData.id, matchedItem);
      if (
        typeof targetItem["data"]["stateData"] === "undefined" ||
        targetItem["data"]["stateData"]["type"] !== "drinkContainer"
      ) {
        userData.sendMessage(userData.user, `${emoji.error} _You cannot drink from ${targetItem.data.shortDesc}!_`);
        return;
      } else if (targetItem["data"]["stateData"]["current"] === targetItem["data"]["stateData"]["capacity"]) {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You can't fill ${targetItem.data.shortDesc} because it's already full!_`
        );
        return;
      } else {
        const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
        const sourceItem = await worldState.rooms.targetAlias(
          worldState,
          userData.id,
          roomNum,
          true,
          false,
          false,
          sourceItemName
        );

        if (sourceItem !== null && sourceItem.type === "item") {
          if (
            typeof sourceItem["data"]["stateData"] === "undefined" ||
            sourceItem["data"]["stateData"]["type"] !== "fountain"
          ) {
            userData.sendMessage(
              userData.user,
              `${emoji.error} _You can't fill your ${targetItem.data.shortDesc} from ${sourceItem.data.shortDesc}!_`
            );
            return;
          } else {
            if (
              targetItem["data"]["stateData"]["current"] !== 0 &&
              targetItem["data"]["stateData"]["liquidType"] !== sourceItem["data"]["stateData"]["liquidType"]
            ) {
              userData.sendMessage(
                userData.user,
                `${emoji.error} _You can't fill your ${targetItem.data.shortDesc}, it contains ${
                  globalConstants.liquidTypes[targetItem.data.stateData.liquidType.toString()]["type"]
                } and ${sourceItem.data.shortDesc} contains ${
                  globalConstants.liquidTypes[sourceItem.data.stateData.liquidType.toString()]["type"]
                }!_`
              );
              return;
            }
            worldState.inventories.updateItemStateData(
              userData.id,
              targetItem.data.id,
              "current",
              targetItem["data"]["stateData"]["capacity"]
            );
            worldState.inventories.updateItemStateData(
              userData.id,
              targetItem.data.id,
              "liquidType",
              sourceItem["data"]["stateData"]["liquidType"]
            );
            userData.sendMessage(
              userData.user,
              `${emoji.bottle} _You filled ${targetItem.data.shortDesc} with ${
                globalConstants.liquidTypes[sourceItem.data.stateData.liquidType.toString()]["type"]
              } from ${sourceItem.data.shortDesc}_`
            );
            worldState.broadcasts.sendToRoom(
              worldState,
              roomNum,
              userData.eid,
              false,
              `_${emoji.bottle} ${userData.displayName} fills a container from ${sourceItem.data.shortDesc}._`
            );
          }
        } else {
          userData.sendMessage(userData.user, `${emoji.question} _You don't see that item here._`);
        }
      }
    } else userData.sendMessage(userData.user, `${emoji.question} _You don't have an item with that name_`);
  } catch (err) {
    console.error(`Error using fill ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
