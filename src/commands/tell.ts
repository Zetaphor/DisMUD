import emoji from "../messages/emoji";

export default function tell(worldState, userData, msg) {
  try {
    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    const roomUsers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);

    let targetName = msg[0].toLowerCase();
    if (msg.length === 1 && msg[0].toLowerCase() === "tell") {
      userData.sendMessage(userData.user, `${emoji.question} _Tell who what?_`);
      return;
    } else if (msg.length === 1) {
      userData.sendMessage(userData.user, `${emoji.question} _Tell them what?_`);
      return;
    }

    let tellTarget = null;

    for (let i = 0; i < roomUsers.length; i++) {
      const player = worldState.players.getActiveByEntityId(roomUsers[i]);
      if (player.displayName.toLowerCase().includes(targetName)) {
        tellTarget = player;
        i = roomUsers.length;
      }
    }

    if (tellTarget !== null) {
      if (tellTarget.eid === userData.eid) {
        userData.sendMessage(userData.user, `${emoji.error} _You cannot tell yourself._`);
        return;
      } else if (!tellTarget.userPrefs.hearTell) {
        userData.sendMessage(
          userData.user,
          `${emoji.error} _You can't tell ${tellTarget.displayName} because they have the receive tells toggle disabled!_`
        );
        return;
      }

      worldState.broadcasts.sendToPlayer(
        worldState,
        tellTarget["eid"],
        `${emoji.whisper} _${userData.displayName} tells you "${msg.slice(1).join(" ")}"_`
      );

      userData.sendMessage(
        userData.user,
        `${emoji.whisper} _You tell ${tellTarget.displayName} "${msg.slice(1).join(" ")}"_`
      );
    } else {
      userData.sendMessage(userData.user, `${emoji.error} _That person is not here with you!_`);
    }
  } catch (err) {
    console.error(`Error using tell ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
