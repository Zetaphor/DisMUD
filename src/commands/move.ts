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
      userData.sendMessage(userData.user, `${emoji.question} _Unknown direction: **${dir}**_`);
      return;
    }

    const roomExits = await worldState.rooms.getEntityRoomExits(
      worldState.db["rooms"],
      worldState.simulation.world,
      userData.eid
    );
    if (Object.keys(roomExits).indexOf(moveDir) === -1) {
      userData.sendMessage(userData.user, `${emoji.error} _You cannot move ${moveDir} from here!_`);
    } else if (roomExits[moveDir].roomId === -1) {
      userData.sendMessage(userData.user, `${emoji.error} _You can't go that way!_`);
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
      buildRoom(worldState, userData.user, userData.eid, newRoomData, userData.admin);

      for (const follower in userData.followers) {
        if (Object.prototype.hasOwnProperty.call(userData.followers, follower)) {
          const followerData = userData.followers[follower];
          const followerRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, followerData.eid);

          if (followerRoomNum === oldRoomNum) {
            if (followerData.player) {
              const followerPlayer = await worldState.players.getActiveByEntityId(followerData.eid);
              await worldState.players.sendCommandAsUser(worldState, followerPlayer.id, `move ${moveDir}`);
            } else {
              const mobData = worldState.mobs.getActiveMobData(followerData.eid);

              await worldState.rooms.updateEntityRoomNum(
                worldState.simulation.world,
                followerData.eid,
                roomExits[moveDir].roomId
              );

              worldState.broadcasts.sendToRoom(
                worldState,
                oldRoomNum,
                -1,
                false,
                `${emoji.exit} _${mobData.shortDesc} leaves ${moveDir}._`
              );

              worldState.broadcasts.sendToRoom(
                worldState,
                roomExits[moveDir].roomId - 1,
                false,
                `${emoji.enter} _${mobData.shortDesc} has arrived._`
              );
            }
          }
        }
      }
    }
  } catch (err) {
    console.error(`Error using move ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
