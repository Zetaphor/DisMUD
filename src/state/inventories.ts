import logger from "../util/logger";

export const inventories = {
  playerInventories: {},

  removeInventory(playerId) {
    const player = this.playerInventories[playerId];
    if (player) {
      delete this.playerInventories[playerId];
    } else {
      throw new Error(`Player ${playerId} not found`);
    }
  },
  getActiveInventory(playerId) {
    return this.playerInventories[playerId];
  },
  setInventory(playerId, inventory) {
    this.playerInventories[playerId] = inventory;
  },
  giveItem(playerId, itemData, quantity) {
    playerId = playerId.toString();
    if (typeof this.playerInventories[playerId][itemData.id] !== "undefined") {
      this.playerInventories[playerId][itemData.id]["qty"] += quantity;
    } else {
      this.playerInventories[playerId][itemData.id] = {
        qty: quantity,
        data: itemData,
      };
    }
  },
  removeItem(playerId, itemId) {
    playerId = playerId.toString();
    itemId = itemId.toString();
    if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
      delete this.playerInventories[playerId][itemId];
    }
  },
  hasItem(playerId, itemId) {
    playerId = playerId.toString();
    itemId = itemId.toString();
    return typeof this.playerInventories[playerId][itemId] !== "undefined";
  },
  updateQuanity(playerId, itemId, quantity) {
    playerId = playerId.toString();
    itemId = itemId.toString();
    if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
      if (this.playerInventories[playerId][itemId]["qty"] + quantity <= 0) {
        delete this.playerInventories[playerId][itemId];
      } else this.playerInventories[playerId][itemId]["qty"] += quantity;
    }
  },
  getInventoryAliases(playerId) {
    playerId = playerId.toString();
    let inventoryAliases = {};
    const inventory = this.playerInventories[playerId];
    for (const id in inventory) {
      if (!Object.prototype.hasOwnProperty.call(inventory, id)) continue;
      const item = inventory[id];
      if (item.data.aliases.length) inventoryAliases[id] = item.data.aliases;
    }
    return inventoryAliases;
  },
  getInventoryItem(playerId, itemId) {
    if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
      return this.playerInventories[playerId][itemId];
    }
    return null;
  },
  getInventory(db, playerId) {
    playerId = playerId.toString();
    if (Object.keys(this.playerInventories).indexOf(playerId) !== -1) {
      return this.playerInventories[playerId];
    }
    return this.loadInventory(db, playerId);
  },
  loadInventory(db, playerId) {
    let playerInventory = {};
    let playerInventoryData = db.methods.getPlayerInventory(playerId);
    if (playerInventoryData.inventoryString.length) {
      try {
        playerInventory = JSON.parse(decodeURIComponent(playerInventoryData["inventoryString"]));
      } catch (err) {
        logger.error(
          { err, playerId, inventoryString: playerInventoryData.inventoryString },
          "Failed to decode player inventory"
        );
        playerInventory = {};
      }
    }

    this.playerInventories[playerId] = playerInventory;
    return playerInventory;
  },
  saveInventory(db, playerId, inventory) {
    db.methods.savePlayerInventory(playerId, inventory);
  },
  updateItemStateData(playerId, itemId, key, val) {
    const item = this.playerInventories[playerId][itemId];
    item.data.stateData[key] = val;
  },
};

export default inventories;
