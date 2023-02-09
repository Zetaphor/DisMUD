export const items = {
  activeItems: {},

  loadItemData(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const object = await db.methods.getItemData(vNum);
        resolve(object);
      } catch (err) {
        console.error(`Error loading object #${vNum}: ${err.message}`);
        reject(err);
      }
    });
  },
  placeItem(worldState, objectData, roomNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const objectId = await worldState.simulation.createItemEntity(objectData, roomNum);
        this.activeMobs[objectId] = objectData;
        resolve(objectId);
      } catch (err) {
        console.error(`Error placing object ${objectData.id} in room #${roomNum}: ${err.message}`);
        reject(err);
      }
    });
  },
};

export default items;
