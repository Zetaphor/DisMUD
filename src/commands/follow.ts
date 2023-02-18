import emoji from "../messages/emoji";

export default async function follow(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const roomUsers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);
    let targetIsPlayer = false;
    let targetName = msg[0].toLowerCase();

    let followTarget = null;

    for (let i = 0; i < roomUsers.length; i++) {
      const player = worldState.players.getActiveByEntityId(roomUsers[i]);
      if (player.displayName.toLowerCase().includes(targetName)) {
        followTarget = player;
        targetIsPlayer = true;
      }
    }

    if (followTarget === null) {
      const target = await worldState.rooms.targetAlias(
        worldState,
        userData.id,
        roomNum,
        false,
        false,
        true,
        targetName
      );

      if (target.type === "") {
        userData.sendMessage(userData.user, `${emoji.error} _That person is not here with you!_`);
        return;
      } else if (target.type === "mob") {
        followTarget = target;
        targetIsPlayer = false;
      }
    }

    if (userData.following !== null) {
      userData.sendMessage(userData.user, `${emoji.nofollow} _You are already following ${userData.followingName}!_`);
      return;
    }

    if (targetIsPlayer) {
      if (followTarget.eid === userData.eid) {
        userData.sendMessage(userData.user, `${emoji.error} _You can't follow yourself!_`);
        return;
      } else if (!followTarget.userPrefs.follow) {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You can't follow ${followTarget.displayName} because they have disabled following!_`
        );
        return;
      }

      if (worldState.players.isFollower(userData.id, followTarget.eid)) {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You can't follow ${followTarget.displayName} because they're already following you!_`
        );
        return;
      }

      worldState.players.addFollower(followTarget.id, userData.eid, true);
      worldState.players.setFollowing(userData.id, followTarget.eid, followTarget.displayName, true);
      userData.sendMessage(userData.user, `${emoji.follow} _You start following ${followTarget.displayName}._`);
      worldState.broadcasts.sendToPlayer(
        worldState,
        followTarget.eid,
        `${emoji.follow} _${userData.displayName} has started following you._`
      );
    } else {
      if (worldState.players.isFollower(userData.id, followTarget.eid)) {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You can't follow ${followTarget.displayName} because they're already following you!_`
        );
        return;
      }

      worldState.mobs.addFollower(followTarget.eid, userData.eid, true);
      worldState.players.setFollowing(userData.id, followTarget.eid, followTarget.data.shortDesc, false);
      userData.sendMessage(userData.user, `${emoji.follow} _You start following ${followTarget.data.shortDesc}._`);
    }
  } catch (err) {
    console.error(`Error using follow ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
