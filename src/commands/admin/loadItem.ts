import emoji from "../../messages/emoji";

export default async function loadItem(worldState, userData, msg) {
  try {
    if (/^-?\d+(\.\d+)?$/.test(msg[0]) === false) {
      userData.sendMessage(userData.user, `${emoji.error} _You must specify an item vNum!_`);
      return;
    }

    const item = await worldState.items.loadItemData(worldState.db["items"], BigInt(msg[0]));
    if (item) {
      let quantity = 1;
      if (msg[1]) quantity = Number(msg[1]);
      await worldState.inventories.giveItem(userData.id, item.data, quantity);
      userData.sendMessage(
        userData.user,
        `${emoji.check} Loaded ${quantity} \`${item.data.shortDesc}\` into your inventory`
      );
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
    userData.sendMessage(userData.user, `${emoji.error} Failed to load item #${msg[0]}`);
    console.error(`Error admin loading item #${msg[0]}: ${err}`);
  }
}
