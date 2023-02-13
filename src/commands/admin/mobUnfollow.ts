import emoji from "../../messages/emoji";

export default async function mobunfollow(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const mobTargetName = msg[0].toLowerCase();
    let targetMob = null;
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

    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `${emoji.sparkles} _${userData.displayName} whispers an incantation in an unknown language._`
    );
    if (target.type === "mob") {
      if (target.data.followingPlayer) {
        worldState.broadcasts.sendToPlayer(
          worldState,
          userData.following,
          `${emoji.nofollow} _${target.data.shortDesc} has stopped following you._`
        );
        worldState.players.removeFollower(target.data.following, target.eid);
        worldState.mobs.stopFollowing(target.data.eid);
      } else {
        worldState.mobs.removeFollower(target.data.following, target.eid);
        worldState.mobs.stopFollowing(target.eid);
        userData.sendMessage(userData.user, `${emoji.check} _Forced ${target.data.shortDesc} to stop following._`);
      }
    }
  } catch (err) {
    console.error(`Error using mobunfollow ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
