import emoji from "./messages/emoji";
import globalConstants from "./messages/globalConstants";
import roomMessages from "./messages/room";

/**
 * Construct a room from worldData and send it to the user
 * @param {object} worldState - The state of the world
 * @param {object} user - The user object
 * @param {object} roomData - Data for the world
 * @returns {Promise<void>} - Returns a promise that resolves with void
 */
export default function buildRoom(worldState, user, userId, roomData, admin = false) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const roomMobs = worldState.rooms.getMobsInRoom(worldState.simulation.world, roomData.id);
      const roomItems = worldState.rooms.getItemsInRoom(worldState.simulation.world, roomData.id);
      const roomPlayers = worldState.rooms.getPlayersInRoom(worldState.simulation.world, roomData.id);

      let mobDescriptions = "";

      for (let i = 0; i < roomMobs.length; i++) {
        const mobId = roomMobs[i];
        const mobData = worldState.mobs.getActiveMobData(mobId);
        const MobStats = worldState.simulation.world["_components"]["mobStats"];
        if (MobStats.state[mobId] === MobStats.defaultState[mobId]) {
          mobDescriptions += `${mobData.longDesc}\n`;
        } else {
          mobDescriptions += `${mobData.shortDesc} ${globalConstants.mobPlayerStates[MobStats.state[mobId]]}\n`;
        }
      }

      let itemDescriptions = "";

      for (let i = 0; i < roomItems.length; i++) {
        const itemId = roomItems[i];
        const itemData = worldState.items["activeItems"][itemId];
        itemDescriptions += `${itemData.longDesc}\n`;
      }

      let playerDescriptions = "";

      for (let i = 0; i < roomPlayers.length; i++) {
        const playerId = roomPlayers[i];
        if (playerId === userId) continue;
        const playerData = worldState.players.getActiveByEntityId(playerId);
        const playerState = await worldState.simulation.getPlayerStat(playerId, "state");
        playerDescriptions += `${emoji.knight} ${playerData.displayName} ${globalConstants.mobPlayerStates[playerState]}\n`;
      }

      const displayData = {
        name: `${roomData.name}`,
        desc: roomData.desc,
        mobDescriptions,
        itemDescriptions,
        playerDescriptions,
        adminTag: admin ? `_(${roomData.id})_` : "",
      };
      roomMessages.displayRoom(user, displayData);

      resolve();
    } catch (err) {
      console.error(`Error building room #${roomData.id} for user ${user.username}, : ${err}`);
      reject();
    }
  });
}
