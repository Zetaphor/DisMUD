import roomConstants from "../simulation/constants/room";

let totalMobs = 0;
let totalItems = 0;
let totalSetDoors = 0;
let totalRemovedItems = 0;

export const zones = {
  loadZones: async (worldState) => {
    return new Promise<void>(async (resolve, reject) => {
      try {
        console.info("\nLoading zones...\n");
        const zones = await worldState.db["zones"].methods.getAllZones();
        for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
          const zoneData = zones[zoneIndex];
          try {
            const zone = JSON.parse(zoneData.data);
            console.info(`Loading zone ${zoneData.vNum} - ${zone.name}`);
            let placedMobs = 0;
            let placedItems = 0;
            let setDoors = 0;
            let removedObjects = 0;
            for (let commandIndex = 0; commandIndex < zone.commands.length; commandIndex++) {
              const command = zone.commands[commandIndex];
              if (command.type === "loadMob") {
                await loadMob(worldState, command, zoneData.vNum);
                placedMobs++;
              } else if (command.type === "setDoor") {
                await setDoor(worldState, command);
                setDoors++;
              } else if (command.type === "loadObj") {
                await loadObj(worldState, command);
                placedItems++;
              } else if (command.type === "removeObj") {
                // await removeObj(worldState, command);
                // removedObjects++;
              }
            }
            // if (placedMobs) console.info(`Placed ${placedMobs} mobs in zone ${zoneData.vNum}`);
            // if (placedItems) console.info(`Placed ${placedItems} items in zone ${zoneData.vNum}`);
            // if (setDoors) console.info(`Set ${setDoors} doors in zone ${zoneData.vNum}`);
            // if (removedObjects) console.info(`Removed ${removedObjects} objects in zone ${zoneData.vNum}`);
            console.info(
              `Placed ${placedMobs} mobs, ${placedItems} items, set ${setDoors} doors, and removed ${removedObjects} items in ${zone.name}`
            );
            totalMobs += placedMobs;
            totalItems += placedItems;
            totalSetDoors += setDoors;
            totalRemovedItems += removedObjects;
          } catch (error) {
            console.error(`Error loading zone ${zoneData.vNum}: ${error}`);
            reject(error);
          }
        }
        console.info(
          `\nLoaded ${totalMobs} mobs, ${totalItems} items, set ${totalSetDoors} doors, and removed ${totalRemovedItems} items\n`
        );
        resolve();
      } catch (err) {
        console.error("Error loading zones:", err);
        reject(err);
      }
    });
  },
};

async function loadMob(worldState, command, zoneNum) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const mob = await worldState.mobs.loadMobData(worldState.db["mobs"], BigInt(command.mobNum));
      if (typeof mob["data"] === "undefined") reject();
      const mobData = JSON.parse(mob.data);
      const newMobId = await worldState.mobs.placeMob(
        worldState,
        mobData,
        Number(command.roomNum),
        Number(command.maxExisting)
      );
      for (const itemKey in command.items) {
        if (Object.prototype.hasOwnProperty.call(command.items, itemKey)) {
          const itemData = command.items[itemKey];

          try {
            const item = await worldState.items.loadItemData(worldState.db["items"], BigInt(itemData.id));
            await worldState.mobs.giveMobItem(newMobId, item.data, itemData.qty);
          } catch (err) {
            console.error(`Error loading mob #${command.mobNum} item #${itemData.qty}: ${err}`);
            reject(err);
          }
        }
      }
      for (let j = 0; j < command.equip.length; j++) {
        try {
          const equip = command.equip[j];
          const item = await worldState.items.loadItemData(worldState.db["items"], BigInt(equip["objNum"]));
          await worldState.mobs.equipMobItem(newMobId, item, equip["position"]);
          resolve();
        } catch (err) {
          console.error(`Error loading mob #${command.mobNum} equip #${command.equip[j]}: ${err}`);
          reject(err);
        }
      }
      resolve();
    } catch (err) {
      console.error(`Error loading mob #${command.mobNum}: ${err}`);
      reject(err);
    }
  });
}

function setDoor(worldState, command) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const exitName = roomConstants.DOOR_DIRS[command.exitNum];
      const doorState = roomConstants.DOOR_STATES[command.state];
      worldState.rooms.setRoomDoorState(command.roomNum, exitName, doorState);
      resolve();
    } catch (err) {
      console.error(`Error setting door: ${err}`);
      reject(err);
    }
  });
}

function loadObj(worldState, command) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const item = await worldState.items.loadItemData(worldState.db["items"], BigInt(command.objNum));
      let newItemIds = await worldState.items.placeItem(worldState, item.data, Number(command.roomNum), 1);
      const newItemId = newItemIds[0];
      if (Object.keys(command.contains).length > 0) {
        for (const itemKey in command.contains) {
          if (Object.prototype.hasOwnProperty.call(command.contains, itemKey)) {
            const contentsItemData = command.contains[itemKey];
            const contentsItem = await worldState.items.loadItemData(
              worldState.db["items"],
              BigInt(contentsItemData.id)
            );
            let containsData = {};
            containsData[contentsItem.data.id] = {
              qty: contentsItemData.qty,
              data: contentsItem.data,
            };
            await worldState.items.updateItemStateData(newItemId, "contents", containsData);
          }
        }
      }
      resolve();
    } catch (err) {
      console.error(`Error loading item: ${err}`);
      reject(err);
    }
  });
}

function removeObj(worldState, command) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // TODO: Implement this
      resolve();
    } catch (err) {
      console.error(`Error removing object: ${err}`);
      reject(err);
    }
  });
}

function resetZones() {
  // Need to check mob max existing here when loading mobs
  return new Promise<void>(async (resolve, reject) => {
    try {
      console.info("Resetting zones...");
    } catch (err) {
      console.error("Error resetting zones:", err);
      reject(err);
    }
  });
}

export default zones;
