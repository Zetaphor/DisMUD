export const inventories = {
  playerInventories: {},

  giveItem(discordId, itemData) {},
  getInventory(db, discordId) {
    return new Promise(async (resolve, reject) => {
      try {
        if (Object.keys(this.playerInventories).indexOf(discordId) !== -1) {
          resolve(this.playerInventories[discordId]);
        } else {
          let playerInventory = {};
          const playerInventoryData = await db.methods.getPlayerInventory(discordId);
          console.log("playerInventoryData", playerInventoryData["inventoryString"]);
          if (!playerInventoryData) await db.methods.initPlayerInventory(discordId);
          if (playerInventoryData["inventoryString"] !== "")
            playerInventory = JSON.parse(playerInventoryData["inventoryString"]);
          this.playerInventories["discordId"] = playerInventory;
          resolve(playerInventory);
        }
      } catch (err) {
        console.error(`Error getting inventory for ${discordId}:`, err);
        reject(err);
      }
    });
  },
};

export default inventories;
