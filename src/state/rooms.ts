import { defineQuery } from "bitecs";
import getRoomData from "../simulation/world-data/libs/world/getRoomData";

export const rooms = {
  getRoomData(roomNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const world = Math.floor(roomNum / 100);
        const room = ("0" + (roomNum % 100)).slice(-2);
        const roomData = await getRoomData(world, room);
        resolve(roomData);
      } catch (err) {
        console.error(`Failed to get room data for #${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  getPlayerRoomNum(world, playerEntityId) {
    const Position = world._components["position"];
    return Position.roomNum[playerEntityId];
  },
  async getPlayerRoomData(world, playerEntityId) {
    return this.getRoomData(this.getPlayerRoomNum(world, playerEntityId));
  },
  async getRoomExits(roomNum) {
    const roomData = await this.getRoomData(roomNum);
    return roomData.exits;
  },
  async getPlayerRoomExits(world, playerEntityId) {
    const roomData = await this.getPlayerRoomData(world, playerEntityId);
    return roomData.exits;
  },
  updatePlayerRoomNum(world, playerEntityId, roomNum) {
    return new Promise<void>((resolve, reject) => {
      try {
        const Position = world._components["position"];
        Position.roomNum[playerEntityId] = roomNum;
        resolve();
      } catch (err) {
        console.error(`Failed to update player room num ${roomNum} for ${playerEntityId}: ${err}`);
        reject(err);
      }
    });
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
