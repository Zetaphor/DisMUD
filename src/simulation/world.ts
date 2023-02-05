import setupWorld from "./loaders/world";
import constants from "./utils/constants";
import createEntity from "./utils/createEntity";
import { damageIndexes } from "./indexes/damageIndexes";
import { scaleIndexes } from "./indexes/scaleIndexes";
import { dropIndexes } from "./indexes/dropIndexes";
import { defineQuery, removeEntity } from "bitecs";
import getRoomData from "./world-data/libs/world/roomFromWld";

export const simulation = {
  world: null,
  start() {
    this.world = setupWorld();
  },
  createPlayerEntity(playerId, roomNum) {
    return new Promise((resolve, reject) => {
      try {
        const newEntity = createEntity(this.world, "player", {
          player: { id: playerId },
          position: { roomNum: roomNum },
          scale: { scaleIndex: scaleIndexes.MEDIUM },
          mortal: { enabled: constants.FALSE },
          killable: { enabled: constants.TRUE },
          health: { val: 100, max: 100, min: 0, damageIndex: damageIndexes.NONE },
          deathDrops: { dropIndex: dropIndexes.CORPSE, qty: 1 },
          age: {
            val: 0,
            max: 5,
            adultAge: 5,
            tickRate: 1,
            lastTick: 0,
          },
          flammable: {
            enabled: constants.TRUE,
            causesDamage: constants.TRUE,
            damage: 10,
          },
        });
        resolve(newEntity);
      } catch (err) {
        console.error(`Failed to craete player entity ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  getPlayerEntityByPlayerId(playerId) {
    const Player = this.world._components["player"];
    const playerQuery = defineQuery([Player]);
    const ents = playerQuery(this.world);
    for (let i = 0; i < ents.length; i++) {
      if (ents[i]["id"] === playerId) {
        i = ents.length;
        return ents[i];
      }
    }
  },
  removePlayerEntity(entityId) {
    return new Promise<void>((resolve, reject) => {
      try {
        removeEntity(this.world, entityId);
        resolve();
      } catch (err) {
        console.error(`Failed to remove player entity ${entityId}: ${err}`);
        reject(err);
      }
    });
  },
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
  getPlayerRoomNum(playerEntityId) {
    const Position = this.world._components["position"];
    return Position.roomNum[playerEntityId];
  },
  async getPlayerRoomData(playerEntityId) {
    return this.getRoomData(this.getPlayerRoomNum(playerEntityId));
  },
  async getRoomExits(roomNum) {
    const roomData = await this.getRoomData(roomNum);
    return roomData.exits;
  },
  async getPlayerRoomExits(playerEntityId) {
    const roomData = await this.getPlayerRoomData(playerEntityId);
    return roomData.exits;
  },
};

export default simulation;

// const newEntity = createEntity(world, "person", {
//   position: { x: 0, y: 0 },
//   scale: { scaleIndex: scaleIndexes.MEDIUM },
//   mortal: { enabled: constants.FALSE },
//   killable: { enabled: constants.TRUE },
//   health: { val: 100, max: 100, min: 0, damageIndex: damageIndexes.NONE },
//   deathDrops: { dropIndex: dropIndexes.CORPSE, qty: 1 },
//   age: {
//     val: 0,
//     max: 5,
//     adultAge: 5,
//     tickRate: 1,
//     lastTick: 0,
//   },
//   flammable: {
//     enabled: constants.TRUE,
//     causesDamage: constants.TRUE,
//     damage: 10,
//   },
// });

// const newEntity = createEntity(world, "tree", {
//   position: { x: 0, y: 0 },
//   durability: { val: 100, min: 0, max: 100 },
//   breakable: { enabled: constants.TRUE, damageIndex: damageIndexes.NONE },
//   deathDrops: { dropIndex: dropIndexes.WOOD, qty: 1 },
//   scale: { scaleIndex: scaleIndexes.LARGE },
//   flammable: {
//     enabled: constants.TRUE,
//     causesDamage: constants.TRUE,
//     damage: 10,
//   },
//   age: {
//     val: 0,
//     max: 5,
//     adultAge: 5,
//     tickRate: 1,
//     lastTick: 0,
//   },
//   mortal: { enabled: constants.FALSE },
// });

// const newEntity = createEntity(world, "wood", {
//   position: { x: 0, y: 0 },
//   durability: { val: 100, min: 0, max: 100 },
//   breakable: { enabled: constants.TRUE, damageIndex: damageIndexes.NONE },
//   scale: { scaleIndex: scaleIndexes.MEDIUM },
//   deathDrops: { dropIndex: dropIndexes.WOOD, qty: 1 },
//   flammable: {
//     enabled: constants.TRUE,
//     causesDamage: constants.TRUE,
//     damage: 10,
//   },
// });

// Set the object on fire
// addComponentWithProperty(world, "person", newEntity, "burning", "enabled", constants.TRUE);

// // Validate components
// console.log(newEntity);
// console.log(
//   "position:",
//   hasComponent(world, world["_components"]["position"], newEntity)
// );
// console.log(
//   "durability:",
//   hasComponent(world, world["_components"]["durability"], newEntity)
// );
// console.log(
//   "breakable:",
//   hasComponent(world, world["_components"]["breakable"], newEntity)
// );
// console.log(
//   "flammable:",
//   hasComponent(world, world["_components"]["flammable"], newEntity)
// );
// console.log(
//   "scale:",
//   hasComponent(world, world["_components"]["scale"], newEntity)
// );
// console.log(
//   "deathDrops:",
//   hasComponent(world, world["_components"]["deathDrops"], newEntity)
// );

// // Update components directly
// console.log("Value:", world["_components"]["position"]["x"][newEntity]);
// setComponentProperty(world, newEntity, "position", "x", 100);
// setComponentValue(world, newEntity, "position", { x: 100, y: 100 });
// console.log("Value:", world["_components"]["position"]["x"][newEntity]);
