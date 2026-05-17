import logger from "../util/logger";
import roomConstants from "../simulation/constants/room";

let totalMobs = 0;
let totalItems = 0;
let totalSetDoors = 0;
let totalRemovedItems = 0;

export const zones = {
  loadZones(worldState) {
    logger.info("\nLoading zones...\n");
    const zones = worldState.db["zones"].methods.getAllZones();
    for (let zoneIndex = 0; zoneIndex < zones.length; zoneIndex++) {
      const zoneData = zones[zoneIndex];
      const zone = JSON.parse(zoneData.data);
      logger.info(`Loading zone ${zoneData.vNum} - ${zone.name}`);
      let placedMobs = 0;
      let placedItems = 0;
      let setDoors = 0;
      let removedObjects = 0;
      for (let commandIndex = 0; commandIndex < zone.commands.length; commandIndex++) {
        const command = zone.commands[commandIndex];
        if (command.type === "loadMob") {
          loadMob(worldState, command, zoneData.vNum);
          placedMobs++;
        } else if (command.type === "setDoor") {
          setDoor(worldState, command);
          setDoors++;
        } else if (command.type === "loadObj") {
          loadObj(worldState, command);
          placedItems++;
        } else if (command.type === "removeObj") {
          // removeObj(worldState, command);
          // removedObjects++;
        }
      }
      logger.info(
        `Placed ${placedMobs} mobs, ${placedItems} items, set ${setDoors} doors, and removed ${removedObjects} items in ${zone.name}`
      );
      totalMobs += placedMobs;
      totalItems += placedItems;
      totalSetDoors += setDoors;
      totalRemovedItems += removedObjects;
    }
    logger.info(
      `\nLoaded ${totalMobs} mobs, ${totalItems} items, set ${totalSetDoors} doors, and removed ${totalRemovedItems} items\n`
    );
  },
};

function loadMob(worldState, command, zoneNum) {
  const mob = worldState.mobs.loadMobData(worldState.db["mobs"], BigInt(command.mobNum));
  if (typeof mob["data"] === "undefined") throw new Error(`Mob #${command.mobNum} has no data`);
  const mobData = JSON.parse(mob.data);
  const newMobId = worldState.mobs.placeMob(
    worldState,
    mobData,
    Number(command.roomNum),
    Number(command.maxExisting)
  );
  for (const itemKey in command.items) {
    if (Object.prototype.hasOwnProperty.call(command.items, itemKey)) {
      const itemData = command.items[itemKey];
      const item = worldState.items.loadItemData(worldState.db["items"], BigInt(itemData.id));
      worldState.mobs.giveMobItem(newMobId, item.data, itemData.qty);
    }
  }
  for (let j = 0; j < command.equip.length; j++) {
    const equip = command.equip[j];
    const item = worldState.items.loadItemData(worldState.db["items"], BigInt(equip["objNum"]));
    worldState.mobs.equipMobItem(newMobId, item, equip["position"]);
  }
}

function setDoor(worldState, command) {
  const exitName = roomConstants.DOOR_DIRS[command.exitNum];
  const doorState = roomConstants.DOOR_STATES[command.state];
  worldState.rooms.setRoomDoorState(command.roomNum, exitName, doorState);
}

function loadObj(worldState, command) {
  const item = worldState.items.loadItemData(worldState.db["items"], BigInt(command.objNum));
  let newItemIds = worldState.items.placeItem(worldState, item.data, Number(command.roomNum), 1);
  const newItemId = newItemIds[0];
  if (Object.keys(command.contains).length > 0) {
    for (const itemKey in command.contains) {
      if (Object.prototype.hasOwnProperty.call(command.contains, itemKey)) {
        const contentsItemData = command.contains[itemKey];
        const contentsItem = worldState.items.loadItemData(
          worldState.db["items"],
          BigInt(contentsItemData.id)
        );
        let containsData = {};
        containsData[contentsItem.data.id] = {
          qty: contentsItemData.qty,
          data: contentsItem.data,
        };
        worldState.items.updateItemStateData(newItemId, "contents", containsData);
      }
    }
  }
}

function removeObj(worldState, command) {
  // TODO: Implement this
}

function resetZones() {
  // TODO: Implement this
  logger.info("Resetting zones...");
}

export default zones;
