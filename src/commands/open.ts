import emoji from "../messages/emoji";

export default async function open(worldState, userData, msg) {
  try {
    if (msg[0].toLowerCase() === "open") {
      userData.sendMessage(userData.user, `${emoji.question} _Open what?_`);
      return;
    }

    let targetDir = "";
    let targetIsDir = false;
    if (msg[0] === "n" || msg[0] === "north") {
      targetDir = "north";
      targetIsDir = true;
    } else if (msg[0] === "s" || msg[0] === "south") {
      targetDir = "south";
      targetIsDir = true;
    } else if (msg[0] === "e" || msg[0] === "east") {
      targetDir = "east";
      targetIsDir = true;
    } else if (msg[0] === "w" || msg[0] === "west") {
      targetDir = "west";
      targetIsDir = true;
    } else if (msg[0] === "u" || msg[0] === "up") {
      targetDir = "up";
      targetIsDir = true;
    } else if (msg[0] === "d" || msg[0] === "down") {
      targetDir = "down";
      targetIsDir = true;
    }

    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    let doorState = null;

    if (targetIsDir) {
      doorState = worldState.rooms.getRoomDoorState(roomNum, targetDir);
    } else {
      const target = await worldState.rooms.targetExitAlias(worldState, roomNum, msg[0].toLowerCase());
      doorState = doorState = worldState.rooms.getRoomDoorState(roomNum, target.dir);
      targetDir = target.dir;
    }

    if (doorState === null) {
      userData.sendMessage(userData.user, `${emoji.error} _You can't find anything to open in that direction._`);
      return;
    } else if (doorState === "locked") {
      userData.sendMessage(userData.user, `${emoji.error} _The exit leading ${targetDir} is locked!_`);
      return;
    } else if (doorState === "open") {
      userData.sendMessage(userData.user, `${emoji.error} _The exit leading ${targetDir} is already opened!_`);
      return;
    } else {
      worldState.rooms.setRoomDoorState(roomNum, targetDir, "open");
      userData.sendMessage(userData.user, `${emoji.door} _You open the exit leading ${targetDir}._`);
      worldState.broadcasts.sendToRoom(
        worldState,
        roomNum,
        userData.eid,
        false,
        `_${emoji.door} ${userData.displayName} opened the exit leading ${targetDir}._`
      );
    }
  } catch (err) {
    console.error(`Error using open ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
