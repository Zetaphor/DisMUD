import emoji from "../messages/emoji";
import objectConstants from "../messages/objectConstants";

export default async function examine(worldState, userData, msg) {
  if (msg[0] === "examine") {
    userData.user.send(`${emoji.question} _Examine what?_`);
    return;
  }

  // TODO: Implment examining at object and mobs in room
  const inventoryAliases = await worldState.inventories.getInventoryAliases(userData.id);
  let matchedItem = null;
  for (const id in inventoryAliases) {
    if (Object.prototype.hasOwnProperty.call(inventoryAliases, id)) {
      if (inventoryAliases[id].indexOf(msg[0]) !== -1) {
        matchedItem = id;
        break;
      }
    }
  }
  if (matchedItem !== null) {
    const item = await worldState.inventories.getInventoryItem(userData.id, matchedItem);
    let extras = "";
    for (let i = 0; i < item.data.extra.length; i++) {
      extras += objectConstants.effects[item.data.extra[i]] + "\n";
    }

    userData.user.send(`
      ${emoji.examine} **${item.data.shortDesc}**\n
      ${emoji.coins} Value: ${item.data.cost}
      ${objectConstants.types[item.data.type]}
      ${extras.slice(0, -2)}
      ${objectConstants.wear[Number(item.data.wear) - 1]}
    `);
  } else userData.user.send(`${emoji.question} _You don't have an item with that name_`);
}
