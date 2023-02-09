import mobConstants from "./messages/mobConstants";
import roomMessages from "./messages/room";

/**
 * Construct a room from worldData and send it to the user
 * @param {object} worldState - The state of the world
 * @param {object} user - The user object
 * @param {object} roomData - Data for the world
 * @param {array} roomMobs - A list of mob ids in the room
 * @returns {Promise<void>} - Returns a promise that resolves with void
 */
export default function buildRoom(worldState, user, roomData) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // const roomObjects = worldState.objects.getRoomObjects(roomData.id);
      const roomMobs = worldState.rooms.getMobsInRoom(worldState.simulation.world, roomData.id);

      let mobDescriptions = "";

      for (let i = 0; i < roomMobs.length; i++) {
        const mobId = roomMobs[i];
        const mobData = await worldState.mobs["activeMobs"][mobId];
        const MobStats = worldState.simulation.world["_components"]["mobStats"];
        if (MobStats.state[mobId] === MobStats.defaultState[mobId]) {
          mobDescriptions += `${mobData.longDesc}\n`;
        } else {
          mobDescriptions += `${mobData.shortDesc} ${mobConstants.positions[MobStats.state[mobId]]}\n`;
        }
      }

      const displayData = {
        name: roomData.name,
        desc: roomData.desc,
        mobDescriptions,
      };
      roomMessages.displayRoom(user, displayData);

      resolve();
    } catch (err) {
      console.error(`Error building room #${roomData.id} for user ${user.username}, : ${err}`);
      reject();
    }
  });
}
