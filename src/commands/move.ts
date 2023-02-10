import emoji from "../messages/emoji";
import buildRoom from "../roomBuilder";

export default async function move(worldState, userData, msg) {
  try {
    const dir = msg.length === 1 ? msg[0] : msg[1];
    let moveDir = "";

    if (dir === "n" || dir === "north") {
      moveDir = "north";
    } else if (dir === "s" || dir === "south") {
      moveDir = "south";
    } else if (dir === "e" || dir === "east") {
      moveDir = "east";
    } else if (dir === "w" || dir === "west") {
      moveDir = "west";
    } else if (dir === "u" || dir === "up") {
      moveDir = "up";
    } else if (dir === "d" || dir === "down") {
      moveDir = "down";
    } else {
      userData.user.send(`${emoji.question} _Unknown direction: **${dir}**_`);
      return;
    }

    const roomExits = await worldState.rooms.getEntityRoomExits(
      worldState.db["rooms"],
      worldState.simulation.world,
      userData.eid
    );
    if (Object.keys(roomExits).indexOf(moveDir) === -1) {
      userData.user.send(`${emoji.error} _You cannot move ${moveDir} from here!_`);
    } else if (roomExits[moveDir].roomId === -1) {
      userData.user.send(`${emoji.error} _You can't go that way!_`);
    } else {
      const oldRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);

      await worldState.rooms.updateEntityRoomNum(worldState.simulation.world, userData.eid, roomExits[moveDir].roomId);
      worldState.broadcasts.sendToRoom(
        worldState,
        oldRoomNum,
        userData.eid,
        false,
        `${emoji.exit} _${userData.displayName} leaves ${moveDir}._`
      );
      worldState.broadcasts.sendToRoom(
        worldState,
        roomExits[moveDir].roomId,
        userData.eid,
        false,
        `${emoji.enter} _${userData.displayName} has arrived._`
      );
      const newRoomData = await worldState.rooms.getEntityRoomData(
        worldState.db["rooms"],
        worldState.simulation.world,
        userData.eid
      );
      // console.log("newRoomData", newRoomData);
      buildRoom(worldState, userData.user, newRoomData);
      // console.log(`move: ${userData.user.username}, ${moveDir}`);
    }
  } catch (err) {
    console.error(`Error using move ${msg}: ${err}`);
    userData.send(`${emoji.error} _Something went wrong!_`);
  }
}
