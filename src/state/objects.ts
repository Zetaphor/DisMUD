import getObjData from "../simulation/world-data/libs/obj/getObjData";

export const objects = {
  getObjectData(objectNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const world = Math.floor(objectNum / 100);
        const room = ("0" + (objectNum % 100)).slice(-2);
        const objectData = await getObjData(world, room);
        resolve(objectData);
      } catch (err) {
        console.error(`Failed to get object data for #${objectNum}: ${err}`);
        reject(err);
      }
    });
  },
};

export default objects;
