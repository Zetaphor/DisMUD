export const inventories = {
  playerInventories: {},
  setInventory(playerId, inventory) {
    this.playerInventories[playerId] = inventory;
  },
    return new Promise<void>((resolve, reject) => {
      try {
        this.playerInventories[discordId].push(itemData);
        resolve();
      } catch (err) {
        console.error(`Failed to give item to player ${discordId}: ${err}`);
        reject(err);
      }
    });
  },
  getInventory(db, playerId) {
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
