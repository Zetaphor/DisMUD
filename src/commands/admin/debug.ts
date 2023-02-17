import emoji from "../../messages/emoji";

export default async function debug(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const debugTarget = await worldState.rooms.targetAlias(
      worldState,
      userData.id,
      roomNum,
      true,
      true,
      true,
      msg[0].toLowerCase()
    );

    userData.sendMessage(userData.user, `${emoji.info} _Debug target sent to console._`);
    console.info("\nDebug Target:", debugTarget, "\n");
  } catch (err) {
    console.error(`Error using admin debug ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
