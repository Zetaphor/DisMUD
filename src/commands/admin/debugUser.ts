import emoji from "../../messages/emoji";

export default function debugUser(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const roomUsers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);

    let debugTarget = null;

    for (let i = 0; i < roomUsers.length; i++) {
      const player = worldState.players.getActiveByEntityId(roomUsers[i]);
      if (player.displayName.toLowerCase().includes(msg[0].toLowerCase().trim())) {
        debugTarget = player;
        i = roomUsers.length;
      }
    }
    if (debugTarget === null) {
      userData.sendMessage(userData.user, `${emoji.error} _That person is not here with you!_`);
    } else {
      console.info(debugTarget);
      userData.sendMessage(userData.user, `${emoji.info} _${debugTarget.displayName} sent to debug console._`);
    }
  } catch (err) {
    console.error(`Error using admin debugUser ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
