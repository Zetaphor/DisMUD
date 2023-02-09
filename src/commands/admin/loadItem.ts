import emoji from "../../messages/emoji";

export default async function loadItem(worldState, userData, msg) {
  try {
    const object = await worldState.objects.loadObjectData(worldState.db["objects"], BigInt(msg[0]));
    if (object) {
      const objectData = JSON.parse(object.data);
      let quantity = 1;
      if (msg[1]) quantity = Number(msg[1]);
      await worldState.inventories.giveItem(userData.id, objectData, quantity);
      userData.user.send(`${emoji.check} Loaded ${quantity} \`${objectData.shortDesc}\` into your inventory`);
    }
  } catch (err) {
    userData.user.send(`${emoji.error} Failed to load object #${msg[0]}`);
    console.error(`Error loading object #${msg[0]}: ${err.message}`);
  }
}
