import emoji from "../../messages/emoji";

export default async function mobFollow(worldState, userData, msg) {
  try {
    const mobTargetName = msg[0].toLowerCase();
    let targetMob = null;

    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const target = await worldState.rooms.targetAlias(
      worldState,
      userData.id,
      roomNum,
      false,
      false,
      true,
      mobTargetName
    );

    if (target.type === "") {
      userData.sendMessage(userData.user, `${emoji.error} _That person is not here with you!_`);
      return;
    }

    if (target.type === "mob") targetMob = target;

    if (msg.length == 1) {
      worldState.mobs.setFollowing(targetMob.eid, userData.eid, userData.displayName, true);
      worldState.players.addFollower(userData.id, targetMob.eid, false);
      userData.sendMessage(userData.user, `${emoji.follow} _${targetMob.data.shortDesc} is now following you._`);
    } else {
      let targetIsPlayer = false;
      let followTarget = null;
      const followTargetName = msg[1].toLowerCase();
      const roomUsers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);
      for (let i = 0; i < roomUsers.length; i++) {
        const player = worldState.players.getActiveByEntityId(roomUsers[i]);
        if (player.displayName.toLowerCase().includes(followTargetName)) {
          followTarget = player;
          targetIsPlayer = true;
          i = roomUsers.length;
        }
      }

      if (followTarget === null) {
        const mobFollowTarget = await worldState.rooms.targetAlias(
          worldState,
          userData.id,
          roomNum,
          false,
          false,
          true,
          followTargetName
        );
        if (mobFollowTarget.type === "") {
          userData.sendMessage(userData.user, `${emoji.error} _That person is not here with you!_`);
          return;
        } else if (mobFollowTarget.type === "mob") {
          followTarget = mobFollowTarget;
          targetIsPlayer = false;
        }
      }

      worldState.broadcasts.sendToRoom(
        worldState,
        roomNum,
        userData.eid,
        false,
        `${emoji.sparkles} _${userData.displayName} whispers an incantation in an unknown language._`
      );
      if (targetIsPlayer) {
        worldState.players.addFollower(followTarget.id, targetMob.eid, false);
        worldState.mobs.setFollowing(targetMob.eid, followTarget.id, followTarget.displayName, true);
        worldState.broadcasts.sendToPlayer(
          worldState,
          followTarget.eid,
          `${emoji.follow} _${targetMob.data.shortDesc} has started following you._`
        );
        userData.sendMessage(
          userData.user,
          `${emoji.check} _Forced ${targetMob.data.shortDesc} to follow ${followTarget.displayName}._`
        );
      } else {
        worldState.mobs.addFollower(followTarget.eid, targetMob.eid, false);
        worldState.mobs.setFollowing(targetMob.eid, followTarget.eid, targetMob.data.shortDesc, false);
        userData.sendMessage(
          userData.user,
          `${emoji.check} _Forced ${targetMob.data.shortDesc} to follow ${followTarget.data.shortDesc}._`
        );
      }
    }
  } catch (err) {
    console.error(`Error using admin mobfollow ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
