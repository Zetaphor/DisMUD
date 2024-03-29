import emoji from "../messages/emoji";

export default async function say(worldState, userData, msg) {
  try {
    let playerInventory = await worldState.inventories.getInventory(worldState.db["playerInventories"], userData.id);

    if (playerInventory === null || Object.keys(playerInventory).length === 0) {
      userData.sendMessage(
        userData.user,
        `${emoji.backpack} _You don't have any items in your inventory. Get out and find some loot!_`
      );
    } else {
      let inventoryMessage = "";
      let totalQty = 0;
      for (const item in playerInventory) {
        if (!Object.prototype.hasOwnProperty.call(playerInventory, item)) continue;
        const itemDesc = worldState.utils.capitalizeFirst(playerInventory[item]["data"].shortDesc);

        if (playerInventory[item]["qty"] > 1) {
          inventoryMessage += `(${playerInventory[item]["qty"]}) ${itemDesc}\n`;
        } else {
          inventoryMessage += `${itemDesc}\n`;
        }
        totalQty += playerInventory[item]["qty"];
      }

      userData.sendMessage(
        userData.user,
        `
        ${emoji.backpack} __**INVENTORY**__ _${totalQty} item${totalQty > 1 ? "s" : ""}_\n
        ${inventoryMessage}
      `
      );
    }
  } catch (err) {
    console.error(`Error using inventory ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
