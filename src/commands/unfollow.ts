import emoji from "../messages/emoji";

export default function unfollow(worldState, userData, msg) {
  try {
    if (userData.following !== null) {
      if (userData.followingPlayer) {
        worldState.broadcasts.sendToPlayer(
          worldState,
          userData.following,
          `${emoji.nofollow} _${userData.displayName} has stopped following you._`
        );
        worldState.players.removeFollower(userData.following, userData.eid);
      } else {
        worldState.mobs.removeFollower(userData.following, userData.eid);
      }
      userData.sendMessage(userData.user, `${emoji.nofollow} _You stop following ${userData.followingName}._`);
      worldState.players.stopFollowing(userData.id);
    }
  } catch (err) {
    console.error(`Error using unfollow ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
