export const items = {
  activeItems: {},

  getActiveItemData(eid) {
    return this.activeItems[eid];
  },
  loadItemData(db, vNum) {
    const item = db.methods.getItemData(vNum);
    let stateData = {};
    item.data = JSON.parse(item.data);
    if (Number(item.data.type) === 15) {
      stateData["type"] = "container";
      stateData["capacity"] = Number(item.data.values[0]);
      stateData["flag"] = Number(item.data.values[1]);
      stateData["key"] = Number(item.data.values[2]);
      stateData["contents"] = {};
    } else if (Number(item.data.type) === 17) {
      stateData["type"] = "drinkContainer";
      stateData["capacity"] = Number(item.data.values[0]);
      stateData["current"] = Number(item.data.values[1]);
      stateData["liquidType"] = Number(item.data.values[2]);
      stateData["poisoned"] = Number(item.data.values[3]);
    } else if (Number(item.data.type) === 23) {
      stateData["type"] = "fountain";
      stateData["capacity"] = Number(item.data.values[0]);
      stateData["current"] = Number(item.data.values[1]);
      stateData["liquidType"] = Number(item.data.values[2]);
      stateData["poisoned"] = Number(item.data.values[3]);
    }

    item["data"]["stateData"] = stateData;
    return item;
  },
  placeItem(worldState, itemData, roomNum, quantity) {
    let itemIds = [];
    for (let i = 0; i < quantity; i++) {
      const itemId = worldState.simulation.createItemEntity(itemData, roomNum);
      this.activeItems[itemId] = itemData;
      itemIds.push(itemId);
    }
    return itemIds;
  },
  removeItem(worldState, itemId) {
    worldState.simulation.removeWorldEntity(itemId);
    delete this.activeItems[itemId];
  },
  updateItemStateData(itemId, key, val) {
    const item = this.activeItems[itemId];
    item.stateData[key] = val;
  },
};

export default items;
