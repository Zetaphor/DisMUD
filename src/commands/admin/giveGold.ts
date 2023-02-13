import emoji from "../../messages/emoji";

export default async function goto(worldState, userData, msg) {
  try {
    const player = worldState.players.getActiveByDisplayName(msg[0]);
    if (player === null) {
      userData.sendMessage(userData.user, `${emoji.error} _Unable to find an online player named ${msg[0]}!_`);
      return;
    }

    const qty = Number(msg[1]);
    let bank = false;

    if (msg.length === 3 && msg[2] === "bank") bank = true;

    if (bank) {
      worldState.players.updatePlayerBank(player.id, qty);
      userData.sendMessage(
        userData.user,
        `${emoji.coins} _You added ${qty} gold coins to ${player.displayName}'s bank. Their balance is now ${player.bank}._`
      );
      worldState.broadcasts.sendToPlayer(
        worldState,
        player.eid,
        `${emoji.coins} _${userData.displayName} sent ${qty} gold coins to your bank account! Your balance is now ${player.gold}._`
      );
    } else {
      worldState.players.updatePlayerGold(player.id, qty);
      userData.sendMessage(
        userData.user,
        `${emoji.coins} _You gave ${qty} gold coins to ${player.displayName}. They now have ${player.gold}._`
      );
      worldState.broadcasts.sendToPlayer(
        worldState,
        player.eid,
        `${emoji.coins} _${userData.displayName} gave you ${qty} gold coins! You now have ${player.gold}._`
      );
    }

    const roomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, userData.eid);
    worldState.broadcasts.sendToRoom(
      worldState,
      roomNum,
      userData.eid,
      false,
      `${emoji.sparkles} _${userData.displayName} whispers an incantation in an unknown language._`
    );
  } catch (err) {
    userData.sendMessage(userData.user, `${emoji.error} Failed to give gold ${msg[0]}`);
    console.error(`Error using give gold ${msg[0]}: ${err}`);
  }
}
