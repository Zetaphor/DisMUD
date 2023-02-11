import emoji from "../../messages/emoji";

export default async function loadItem(worldState, userData, msg) {
  try {
    const item = await worldState.items.loadItemData(worldState.db["items"], BigInt(msg[0]));
    if (item) {
      const itemData = JSON.parse(item.data);
      let quantity = 1;
      if (msg[1]) quantity = Number(msg[1]);
      await worldState.inventories.giveItem(userData.id, itemData, quantity);
      userData.user.send(`${emoji.check} Loaded ${quantity} \`${itemData.shortDesc}\` into your inventory`);
      const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
      worldState.broadcasts.sendToRoom(
        worldState,
        roomNum,
        userData.eid,
        false,
        `${emoji.sparkles} _${userData.displayName} whispers an incantation in an unknown language._`
      );
    }
  } catch (err) {
    userData.user.send(`${emoji.error} Failed to load item #${msg[0]}`);
    console.error(`Error loading item #${msg[0]}: ${err}`);
  }
}
