import emoji from "../messages/emoji";

export default function say(worldState, userData, msg) {
  const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
  worldState.broadcasts.sendToRoom(
    worldState,
    roomNum,
    `${emoji.speak} ${userData.displayName} says "${msg.join(" ")}"`
  );
  console.log(`${userData.user.username} says: ${msg.join(" ")}`);
}
