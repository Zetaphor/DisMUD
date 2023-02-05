import roomMessages from "./messages/room";

/**
 * Construct a room from worldData and send it to the user
 * @param {object} user - The user object
 * @param {object} wldData - Data for the world
 * @returns {Promise<void>} - Returns a promise that resolves with void
 */
export default function buildRoom(user, wldData) {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const roomData = {
        name: wldData.name,
        desc: wldData.desc,
        descriptors: "",
      };
      roomMessages.displayRoom(user, roomData);

      resolve();
    } catch (err) {
      console.error(`Error building room #${wldData.id} for user ${user.username}, : ${err}`);
      reject();
    }
  });
}
