export const broadcasts = {
  sendToRoom(worldState, roomNum, message) {
    return new Promise<void>((resolve, reject) => {
      try {
        const roomPlayers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomNum);
        for (let i = 0; i < roomPlayers.length; i++) {
          const player = worldState.players.getActiveByEntityId(roomPlayers[i]);
          player.user.send(message);
        }
        resolve();
      } catch (err) {
        console.error(`Error broadcasting message to room ${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  sendToPlayer(worldState, id, message) {
    return new Promise<void>((resolve, reject) => {
      try {
        const player = worldState.players.getActiveById(id);
        player.user.send(message);
        resolve();
      } catch (err) {
        console.error(`Error sending message to player ${id}: ${err}`);
        reject(err);
      }
    });
  },
  sendToAll(worldState, message) {
    return new Promise<void>((resolve, reject) => {
      try {
        const worldPlayers = Object.values(worldState.players.currentActive);
        for (let i = 0; i < worldPlayers.length; i++) {
          worldPlayers[i]["user"].send(message);
        }
        resolve();
      } catch (err) {
        console.error(`Error broadcasting message: ${err}`);
        reject(err);
      }
    });
  },
};

export default broadcasts;
