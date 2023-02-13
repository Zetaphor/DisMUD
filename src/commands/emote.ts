import emoji from "../messages/emoji";

export default function emote(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `${emoji.info} _${userData.displayName} ${msg.join(" ")}_`
    );
  } catch (err) {
    console.error(`Error using emote ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
