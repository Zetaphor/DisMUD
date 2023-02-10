import emoji from "../messages/emoji";

export default function say(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `${emoji.speak} ${userData.displayName} says "${msg.join(" ")}"`
    );
    console.log(`${userData.user.username} says: ${msg.join(" ")}`);
  } catch (error) {
    console.error(`Error using say ${msg}: ${error}`);
    userData.send(`${emoji.error} _Something went wrong!_`);
  }
}
