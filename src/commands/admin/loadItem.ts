import emoji from "../../messages/emoji";

export default async function loadItem(worldState, userData, msg) {
  try {
    const object = await worldState.objects.loadObject(worldState.db["objects"], BigInt(msg[0]));
    // console.log(object.data);
    const objectData = JSON.parse(object.data);
    console.log(objectData);
    userData.user.send(`${emoji.check} Loaded ${objectData.shortDesc}`);
  } catch (err) {
    userData.user.send(`${emoji.error} Failed to load object #${msg[0]}`);
    console.error(`Error loading object ${msg[0]}: ${err.message}`);
  }
}
