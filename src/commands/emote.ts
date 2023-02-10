import emoji from "../messages/emoji";

export default function emote(worldState, userData, msg) {
  const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
  worldState.broadcasts.sendToRoom(
    worldState,
    roomNum,
    userData.eid,
    false,
    `${emoji.info} _${userData.displayName} ${msg.join(" ")}_`
  );
}
