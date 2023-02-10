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
    const mob = await worldState.mobs.loadMobData(worldState.db["mobs"], BigInt(msg[0]));
    const mobData = JSON.parse(mob.data);

    for (let i = 0; i < quantity; i++) {
      const newMobId = await worldState.mobs.placeMob(worldState, mobData, roomNum);
      userData.user.send(
        `${emoji.check} Loaded mob #${mobData.id} \`${mobData.shortDesc}\` to entity #${newMobId} in room #${roomNum}`
      );
    }
  } catch (err) {
    userData.user.send(`${emoji.error} Failed to load mob #${msg[0]}`);
    console.error(`Error loading mob #${msg[0]}: ${err}`);
  }
}
