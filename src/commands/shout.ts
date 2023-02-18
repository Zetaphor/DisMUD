import emoji from "../messages/emoji";

export default async function shout(worldState, userData, msg) {
  try {
    if (!userData.userPrefs.hearShout) {
      userData.sendMessage(
        userData.user,
        `${emoji.error} _You need to have the hear shouts toggle enabled before you can send shout messages!_`
      );
      return;
    }

    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const zoneNum = Math.floor(roomNum / 100);
    const zonePlayers = await worldState.simulation.getPlayersInZone(zoneNum);

    for (let i = 0; i < zonePlayers.length; i++) {
      const player = worldState.players.getActiveByEntityId(zonePlayers[i]);
      if (player.eid !== userData.eid && player.userPrefs.hearShout) {
        worldState.broadcasts.sendToPlayer(
          worldState,
          player["eid"],
          `${emoji.shout} _You hear ${userData.displayName} shout from a distance, "${msg.join(" ")}"_`
        );
      }
    }

    userData.sendMessage(userData.user, `${emoji.shout} _You shout "${msg.join(" ")}"_`);
  } catch (err) {
    console.error(`Error using shout ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
