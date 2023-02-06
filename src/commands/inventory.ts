import emoji from "../messages/emoji";

export default async function say(worldState, userData, msg) {
  let playerInventory = await worldState.inventories.getInventory(
    worldState.db["playerInventories"],
    userData.discordId
  );
  const inventoryKeys = Object.keys(playerInventory);
  if (!inventoryKeys.length) {
    userData.user.send(`${emoji.backpack} _You don't have any items in your inventory. Get out and find some loot!_`);
  } else {
    userData.user.send(`
      ${emoji.backpack} __**Inventory**__ (${inventoryKeys.length}) items\n
      ${inventoryKeys.map((key) => `${key}: ${playerInventory[key].name}`).join("\n")}
    `);
  }
  console.log(`${userData.user.username} inventory:`, playerInventory);
}
