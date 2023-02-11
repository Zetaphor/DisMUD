export const items = {
  activeItems: {},

  getActiveItemData(eid) {
    return this.activeItems[eid];
  },
  loadItemData(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await db.methods.getItemData(vNum);
        resolve(item);
      } catch (err) {
        console.error(`Error loading item #${vNum}: ${err}`);
        reject(err);
      }
    });
  },
  placeItem(worldState, itemData, roomNum, quantity) {
    return new Promise(async (resolve, reject) => {
      try {
        let itemIds = [];
        for (let i = 0; i < quantity; i++) {
          const itemId = await worldState.simulation.createItemEntity(itemData, roomNum);
          this.activeItems[itemId] = itemData;
          itemIds.push(itemId);
        }
        resolve(itemIds);
      } catch (err) {
        console.error(`Error placing item ${itemData.id} in room #${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  removeItem(worldState, itemId) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await worldState.simulation.removeWorldEntity(itemId);
        delete this.activeItems[itemId];
        resolve();
      } catch (err) {
        console.error(`Error removing item ${itemId}: ${err}`);
        reject(err);
      }
    });
  },
};

export default items;
