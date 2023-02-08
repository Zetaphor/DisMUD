export const inventories = {
  playerInventories: {},
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
  getInventory(db, playerId) {
    playerId = playerId.toString();
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(this.playerInventories).indexOf(playerId) !== -1) {
          resolve(this.playerInventories[playerId]);
        } else {
          let playerInventory = {};

          let playerInventoryData = await db.methods.getPlayerInventory(playerId);
          if (!playerInventoryData) playerInventoryData = await db.methods.initPlayerInventory(playerId);
          if (playerInventoryData["inventoryString"] !== "") {
            playerInventory = JSON.parse(playerInventoryData["inventoryString"]);
          }

          this.playerInventories[playerId] = playerInventory;
          resolve(playerInventory);
        }
      } catch (err) {
        console.error(`Error getting inventory for ${playerId}:`, err);
        reject(err);
      }
    });
  },
};

export default inventories;
