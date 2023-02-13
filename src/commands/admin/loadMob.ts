import emoji from "../../messages/emoji";

export default async function loadMob(worldState, userData, msg) {
  try {
    let roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    let quantity = 1;
    if (msg.length > 1) {
      if (msg[1] !== "here") roomNum = Number(msg[1]);
      if (msg.length === 3) {
        quantity = msg[2];
      }
    }

    if (/^-?\d+(\.\d+)?$/.test(msg[0]) === false) {
      userData.sendMessage(userData.user, `${emoji.error} _You must specify a mob vNum!_`);
      return;
    }
    const mob = await worldState.mobs.loadMobData(worldState.db["mobs"], BigInt(msg[0]));
    const mobData = JSON.parse(mob.data);

    for (let i = 0; i < quantity; i++) {
      const newMobId = await worldState.mobs.placeMob(worldState, mobData, roomNum);
      userData.sendMessage(
        userData.user,
        `${emoji.check} Loaded mob #${mobData.id} \`${mobData.shortDesc}\` to entity #${newMobId} in room #${roomNum}`
      );
      worldState.broadcasts.sendToRoom(
        worldState,
        roomNum,
        userData.eid,
        false,
        `${emoji.sparkles} _${userData.displayName} whispers an incantation and ${mobData.shortDesc} magically appears!_`
      );
    }
  } catch (err) {
    userData.sendMessage(userData.user, `${emoji.error} Failed to load mob #${msg[0]}`);
    console.error(`Error loading mob #${msg[0]}: ${err}`);
  }
}
