export const inventories = {
  playerInventories: {},

  removeInventory(playerId) {
    return new Promise<void>((resolve, reject) => {
      try {
        const player = this.playerInventories[playerId];
        if (player) {
          delete this.playerInventories[playerId];
          resolve();
        } else {
          reject(new Error(`Player ${playerId} not found`));
        }
      } catch (err) {
        console.error(`Failed to remove player inventory ${playerId}: ${err}`);
      }
    });
  },
  getActiveInventory(playerId) {
    return this.playerInventories[playerId];
  },
  setInventory(playerId, inventory) {
    this.playerInventories[playerId] = inventory;
  },
  giveItem(playerId, itemData, quantity) {
    playerId = playerId.toString();
    return new Promise<void>((resolve, reject) => {
      try {
        if (typeof this.playerInventories[playerId][itemData.id] !== "undefined") {
          this.playerInventories[playerId][itemData.id]["qty"] += quantity;
        } else {
          this.playerInventories[playerId][itemData.id] = {
            qty: quantity,
            data: itemData,
          };
        }
        resolve();
      } catch (err) {
        console.error(`Failed to give item ${itemData.id} to player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  removeItem(playerId, itemId) {
    playerId = playerId.toString();
    itemId = itemId.toString();
    return new Promise<void>((resolve, reject) => {
      try {
        if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
          delete this.playerInventories[playerId][itemId];
        }
        resolve();
      } catch (err) {
        console.error(`Failed to remove item ${itemId} from player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  hasItem(playerId, itemId) {
    playerId = playerId.toString();
    itemId = itemId.toString();
    return new Promise((resolve, reject) => {
      try {
        if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.error(`Failed to check for item ${itemId} in player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  updateQuanity(playerId, itemId, quantity) {
    playerId = playerId.toString();
    itemId = itemId.toString();
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
          if (this.playerInventories[playerId][itemId]["qty"] + quantity <= 0) {
            delete this.playerInventories[playerId][itemId];
          } else this.playerInventories[playerId][itemId]["qty"] += quantity;
        } else {
          if (this.playerInventories[playerId][itemId]["qty"] + quantity >= 1) {
          }
        }
        resolve();
      } catch (err) {
        console.error(`Failed to update quantity of item ${itemId} to player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  getInventoryAliases(playerId) {
    playerId = playerId.toString();
    return new Promise(async (resolve, reject) => {
      try {
        let inventoryAliases = {};
        const inventory = this.playerInventories[playerId];
        for (const id in inventory) {
          if (!Object.prototype.hasOwnProperty.call(inventory, id)) continue;
          const item = inventory[id];
          if (item.data.aliases.length) inventoryAliases[id] = item.data.aliases;
        }
        resolve(inventoryAliases);
      } catch (err) {
        console.error(`Failed to get inventory aliases for player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  getInventoryItem(playerId, itemId) {
    return new Promise((resolve, reject) => {
      try {
        if (typeof this.playerInventories[playerId][itemId] !== "undefined") {
          resolve(this.playerInventories[playerId][itemId]);
        } else {
          resolve(null);
        }
      } catch (err) {
        console.error(`Failed to get inventory item ${itemId} for player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  getInventory(db, playerId) {
    playerId = playerId.toString();
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(this.playerInventories).indexOf(playerId) !== -1) {
          resolve(this.playerInventories[playerId]);
        } else {
          const playerInventory = await this.loadInventory(db, playerId);
          resolve(playerInventory);
        }
      } catch (err) {
        console.error(`Error getting inventory for ${playerId}:`, err);
        reject(err);
      }
    });
  },
  loadInventory(db, playerId) {
    return new Promise(async (resolve, reject) => {
      try {
        let playerInventory = {};
        let playerInventoryData = await db.methods.getPlayerInventory(playerId);
        if (playerInventoryData.inventoryString.length) {
          try {
            playerInventory = JSON.parse(decodeURIComponent(playerInventoryData["inventoryString"]));
          } catch (err) {
            console.error(`Failed to decode player inventory ${playerId}: ${playerInventory}`);
            console.error(err);
            playerInventory = {};
          }
        }

        this.playerInventories[playerId] = playerInventory;
        resolve(playerInventory);
      } catch (err) {
        console.error(`Error loading inventory for ${playerId}:`, err);
        reject(err);
      }
    });
  },
  saveInventory(db, playerId, inventory) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await db.methods.savePlayerInventory(playerId, inventory);
        resolve();
      } catch (err) {
        console.error(`Error saving inventory for ${playerId}:`, err);
        reject(err);
      }
    });
  },
  updateItemStateData(playerId, itemId, key, val) {
    return new Promise<void>((resolve, reject) => {
      try {
        const item = this.playerInventories[playerId][itemId];
        item.data.stateData[key] = val;
        resolve();
      } catch (err) {
        console.error(`Error updating item ${itemId} stateData: ${err}`);
        reject(err);
      }
    });
  },
};

export default inventories;
