export const broadcasts = {
  sendToRoom(worldState, roomNum, senderId, localBroadcast, message) {
    const roomPlayers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);
    for (let i = 0; i < roomPlayers.length; i++) {
      if (roomPlayers[i] === senderId && !localBroadcast) continue;
      const player = worldState.players.getActiveByEntityId(roomPlayers[i]);
      player.sendMessage(player.user, message);
    }
  },
  sendToPlayer(worldState, id, message) {
    const player = worldState.players.getActiveByEntityId(id);
    player.sendMessage(player.user, message);
  },
  sendToAll(worldState, message) {
    const worldPlayers = Object.values(worldState.players.currentActive);
    for (let i = 0; i < worldPlayers.length; i++) {
      worldPlayers[i]["sendMessage"](worldPlayers[i]["user"], message);
    }
  },
};

export default broadcasts;
