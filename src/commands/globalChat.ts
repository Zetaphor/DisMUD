import emoji from "../messages/emoji";

export default function globalChat(worldState, userData, msg) {
  try {
    if (!userData.userPrefs.chanGlobal) {
      userData.sendMessage(
        userData.user,
        `${emoji.error} _You need to have the global chat toggle enabled before you can send messages to that channel!_`
      );
      return;
    }

    const activePlayers = Object.values(worldState.players.currentActive);
    for (let i = 0; i < activePlayers.length; i++) {
      const player = activePlayers[i];
      if (player["userPrefs"]["chanGlobal"]) {
        worldState.broadcasts.sendToPlayer(
          worldState,
          player["eid"],
          `${emoji.globalChat} _${userData.displayName}: ${msg.join(" ")}_`
        );
      }
    }
  } catch (err) {
    console.error(`Error using global chat ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
