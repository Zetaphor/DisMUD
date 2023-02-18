import emoji from "../../messages/emoji";

export default async function force(worldState, userData, msg) {
  try {
    const forceTargetName = msg[0].toLowerCase();
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const roomUsers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);

    let forceTarget = null;
    for (let i = 0; i < roomUsers.length; i++) {
      const player = worldState.players.getActiveByEntityId(roomUsers[i]);
      if (player.displayName.toLowerCase().includes(forceTargetName)) {
        forceTarget = player;
        i = roomUsers.length;
      }
    }

    if (forceTarget === null) {
      userData.sendMessage(userData.user, `${emoji.error} _That person is not here with you!_`);
      return;
    }

    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `${emoji.sparkles} _${userData.displayName} whispers an incantation while staring directly at ${forceTarget.displayName}._`
    );

    worldState.broadcasts.sendToPlayer(
      worldState,
      forceTarget.eid,
      `${emoji.sparkles} _You feel your body being posessed!_`
    );

    worldState.players.sendCommandAsUser(worldState, forceTarget.eid, msg.slice(1).join(" "));

    userData.sendMessage(
      userData.user,
      `${emoji.check} You forced ${forceTarget.displayName} to ${msg.slice(1).join(" ")}`
    );
  } catch (err) {
    console.error(`Error using admin force ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
