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
        userData.user.send(`${emoji.error} _That person is not here with you!_`);
        return;
      } else if (target.type === "mob") {
        followTarget = target;
        targetIsPlayer = false;
      }
    }

    if (targetIsPlayer) {
      if (worldState.players.isFollower(userData.id, followTarget.eid)) {
        userData.user.send(
          `${emoji.error} _You can't follow ${followTarget.displayName} because they're already following you!_`
        );
        return;
      }

      worldState.players.addFollower(followTarget.id, userData.eid, true);
      worldState.players.setFollowing(userData.id, followTarget.eid, followTarget.displayName, true);
      userData.user.send(`${emoji.follow} _You start following ${followTarget.displayName}._`);
      worldState.broadcasts.sendToPlayer(
        worldState,
        followTarget.eid,
        `${emoji.follow} _${userData.displayName} has started following you._`
      );
    } else {
      if (worldState.players.isFollower(userData.id, followTarget.eid)) {
        userData.user.send(
          `${emoji.error} _You can't follow ${followTarget.displayName} because they're already following you!_`
        );
        return;
      }

      worldState.mobs.addFollower(followTarget.eid, userData.eid, true);
      worldState.players.setFollowing(userData.id, followTarget.id, followTarget.data.shortDesc, false);
      userData.user.send(`${emoji.follow} _You start following ${followTarget.data.shortDesc}._`);
    }
  } catch (err) {
    console.error(`Error using follow ${msg}: ${err}`);
    userData.user.send(`${emoji.error} _Something went wrong!_`);
  }
}
