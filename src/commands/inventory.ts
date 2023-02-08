import emoji from "../messages/emoji";

export default async function say(worldState, userData, msg) {
  let playerInventory = await worldState.inventories.getInventory(worldState.db["playerInventories"], userData.id);

  if (Object.keys(playerInventory).length === 0) {
    userData.user.send(`${emoji.backpack} _You don't have any items in your inventory. Get out and find some loot!_`);
  } else {
    let inventoryMessage = "";
    let totalQty = 0;
    for (const item in playerInventory) {
      if (!Object.prototype.hasOwnProperty.call(playerInventory, item)) continue;
      if (playerInventory[item]["qty"] > 1) {
        inventoryMessage += `(${playerInventory[item]["qty"]}) ${playerInventory[item]["data"].shortDesc}\n`;
      } else {
        inventoryMessage += `${playerInventory[item]["data"].shortDesc}\n`;
      }
      totalQty += playerInventory[item]["qty"];
    }

    userData.user.send(`
      ${emoji.backpack} __**INVENTORY**__ _${totalQty} item${totalQty > 1 ? "s" : ""}_\n
      ${inventoryMessage}
    `);
  }
}
