export const items = {
  activeItems: {},

  getActiveItemData(eid) {
    return this.activeItems[eid];
  },
  loadItemData(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const item = await db.methods.getItemData(vNum);
        let stateData = {};
        item.data = JSON.parse(item.data);
        if (Number(item.data.type) === 15) {
          // Container
          stateData["type"] = "container";
          stateData["capacity"] = Number(item.data.values[0]);
          stateData["flag"] = Number(item.data.values[1]);
          stateData["key"] = Number(item.data.values[2]);
          stateData["contents"] = {};
        } else if (Number(item.data.type) === 17) {
          // Drink Container
          stateData["type"] = "drinkContainer";
          stateData["capacity"] = Number(item.data.values[0]);
          stateData["current"] = Number(item.data.values[1]);
          stateData["liquidType"] = Number(item.data.values[2]);
          stateData["poisoned"] = Number(item.data.values[3]);
        } else if (Number(item.data.type) === 23) {
          // Fountain
          stateData["type"] = "fountain";
          stateData["capacity"] = Number(item.data.values[0]);
          stateData["current"] = Number(item.data.values[1]);
          stateData["liquidType"] = Number(item.data.values[2]);
          stateData["poisoned"] = Number(item.data.values[3]);
        }
        item["data"]["stateData"] = stateData;
        resolve(item);
      } catch (err) {
        console.error(`Error loading item data #${vNum}: ${err}`);
        reject(err);
      }
    });
  },
  placeItem(worldState, itemData, roomNum, quantity, itemState = {}) {
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
  updateItemStateData(itemId, key, val) {
    return new Promise<void>((resolve, reject) => {
      try {
        const item = this.activeItems[itemId];
        item.data.stateData[key] = val;
        resolve();
      } catch (err) {
        console.error(`Error updating item ${itemId} stateData: ${err}`);
        reject(err);
      }
    });
  },
};

export default items;
