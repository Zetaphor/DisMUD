import emoji from "../messages/emoji";

export default function auctionChat(worldState, userData, msg) {
  try {
    if (!userData.userPrefs.auctionChat) {
      userData.sendMessage(
        userData.user,
        `${emoji.error} _You need to have the auction chat toggle enabled before you can send messages to that channel!_`
      );
      return;
    }

    const activePlayers = Object.values(worldState.players.currentActive);
    for (let i = 0; i < activePlayers.length; i++) {
      const player = activePlayers[i];
      if (player["userPrefs"]["chanAuction"]) {
        worldState.broadcasts.sendToPlayer(
          worldState,
          player["eid"],
          `${emoji.auctionChat} _${userData.displayName}: ${msg.join(" ")}_`
        );
      }
    }
  } catch (err) {
    console.error(`Error using auction ${msg}: ${err}`);
    userData.sendMessage(userData.user, `${emoji.error} _Something went wrong!_`);
  }
}
