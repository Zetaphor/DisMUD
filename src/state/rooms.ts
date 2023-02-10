import { defineQuery } from "bitecs";

export const rooms = {
  loadRoomData(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const room = await db.methods.getRoomData(vNum);
        resolve(JSON.parse(room.data));
      } catch (err) {
        console.error(`Error loading room ${vNum}: ${err}`);
        reject(err);
      }
    });
  },
  getEntityRoomNum(world, entityId) {
    const Position = world._components["position"];
    return Position.roomNum[entityId];
  },
  async getEntityRoomData(db, world, entityId) {
    return new Promise(async (resolve, reject) => {
      try {
        const roomData = await this.loadRoomData(db, this.getEntityRoomNum(world, entityId));
        resolve(roomData);
      } catch (err) {
        console.error(`Error getting room data for entity ${entityId}: ${err}`);
        reject(err);
      }
    });
  },
  getRoomExits(db, roomNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const roomData = await this.loadRoomData(db, Number(roomNum));
        resolve(roomData.exits);
      } catch (err) {
        console.error(`Error getting room exits for room ${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  getEntityRoomExits(db, world, entityId) {
    return new Promise(async (resolve, reject) => {
      try {
        const roomData = await this.getEntityRoomData(db, world, entityId);
        resolve(roomData.exits);
      } catch (err) {
        console.error(`Error getting room exits for entity ${entityId}: ${err}`);
        reject(err);
      }
    });
  },
  updateEntityRoomNum(world, entityId, roomNum) {
    return new Promise<void>((resolve, reject) => {
      try {
        const Position = world._components["position"];
        Position.roomNum[entityId] = roomNum;
        resolve();
      } catch (err) {
        console.error(`Failed to update player room num ${roomNum} for ${entityId}: ${err}`);
        reject(err);
      }
    });
  },
  getPlayersInRoom(world, roomNum) {
    const Player = world._components["player"];
    const Position = world._components["position"];
    const playerQuery = defineQuery([Player]);
    const ents = playerQuery(world);

    let playerList = [];
    for (let i = 0; i < ents.length; i++) {
      if (Position.roomNum[ents[i]] === roomNum) playerList.push(ents[i]);
    }
    return playerList;
  },
  getMobsInRoom(world, roomNum) {
    const Mob = world._components["mob"];
    const Position = world._components["position"];
    const mobQuery = defineQuery([Mob]);
    const ents = mobQuery(world);

    let mobList = [];
    for (let i = 0; i < ents.length; i++) {
      if (Position.roomNum[ents[i]] === roomNum) mobList.push(ents[i]);
    }
    return mobList;
  },
  getItemsInRoom(world, roomNum) {
    const Item = world._components["item"];
    const Position = world._components["position"];
    const itemQuery = defineQuery([Item]);
    const ents = itemQuery(world);
    let itemList = [];
    for (let i = 0; i < ents.length; i++) {
      if (Position.roomNum[ents[i]] === roomNum) itemList.push(ents[i]);
    }
    return itemList;
  },
};

export default rooms;
