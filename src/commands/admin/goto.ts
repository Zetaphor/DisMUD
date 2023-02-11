import emoji from "../../messages/emoji";
import buildRoom from "../../roomBuilder";

export default async function goto(worldState, userData, msg) {
  try {
    const newRoomData = await worldState.rooms.loadRoomData(worldState.db["rooms"], msg[0]);
    if (newRoomData) {
      const oldRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
      await worldState.rooms.updateEntityRoomNum(worldState.simulation.world, userData.eid, newRoomData.id);
      buildRoom(worldState, userData.user, newRoomData, userData.admin);
      worldState.broadcasts.sendToRoom(
        worldState,
        oldRoomNum,
        userData.eid,
        false,
        `${emoji.sparkles} _The world around you momentarily distorts and ${userData.displayName} dissapears in a flash of light!_`
      );
      worldState.broadcasts.sendToRoom(
        worldState,
        newRoomData.id,
        userData.eid,
        false,
        `${emoji.sparkles} _The world around you momentarily distorts and ${userData.displayName} appears in a flash of light!_`
      );
    }
  } catch (err) {
    userData.user.send(`${emoji.error} Failed to goto #${msg[0]}`);
    console.error(`Error using goto #${msg[0]}: ${err}`);
  }
}