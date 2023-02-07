import emoji from "../messages/emoji";
import buildRoom from "../roomBuilder";

export default async function move(worldState, userData, msg) {
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

  const roomExits = await worldState.simulation.getPlayerRoomExits(userData.eid);
  if (Object.keys(roomExits).indexOf(moveDir) === -1) {
    userData.user.send(`${emoji.error} _You cannot move ${moveDir} from here!_`);
  } else if (roomExits[moveDir].roomId === -1) {
    userData.user.send(`${emoji.error} _You can't go that way!_`);
  } else {
    await worldState.simulation.updatePlayerRoomNum(userData.eid, roomExits[moveDir].roomId);
    const newRoomData = await worldState.simulation.getPlayerRoomData(userData.eid);
    // console.log("newRoomData", newRoomData);
    buildRoom(userData.user, newRoomData);
    // console.log(`move: ${userData.user.username}, ${moveDir}`);
  }
}
