import emoji from "../messages/emoji";

export default function unfollow(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    if (userData.following !== null) {
      if (userData.followingPlayer) {
        worldState.broadcasts.sendToPlayer(
          worldState,
          userData.following,
          `${emoji.nofollow} _${userData.displayName} has stopped following you._`
        );
        worldState.players.removeFollower(userData.following, userData.eid);
      }
      userData.sendMessage(userData.user, `${emoji.nofollow} _You stop following ${userData.followingName}._`);
      worldState.players.stopFollowing(userData.id);
    }
  } catch (err) {
    console.error(`Error using unfollow ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
