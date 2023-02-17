import emoji from "../../messages/emoji";

export default async function debugExits(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const roomExits = await worldState.rooms.getRoomExits(worldState.db["rooms"], roomNum);
    console.info(`\nDebugging exits for #${roomNum}`, roomExits, "\n");
    userData.sendMessage(userData.user, `${emoji.check} _Room exit data sent to console._`);
  } catch (err) {
    console.error(`Error using admin debugExits ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
