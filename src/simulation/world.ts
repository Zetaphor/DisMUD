import setupWorld from "./loaders/world";
import globalConstants from "./constants/global";
import createEntity from "./utils/createEntity";
import { damageIndexes } from "./indexes/damageIndexes";
import { scaleIndexes } from "./indexes/scaleIndexes";
import { dropIndexes } from "./indexes/dropIndexes";
import { defineQuery, removeEntity } from "bitecs";
import diceRoll from "./utils/diceRoll";

export const simulation = {
  world: null,
  start() {
    this.world = setupWorld();
  },
  removeWorldEntity(entityId) {
    return new Promise<void>((resolve, reject) => {
      try {
        removeEntity(this.world, entityId);
        resolve();
      } catch (err) {
        console.error(`Failed to remove entity ${entityId}: ${err}`);
        reject(err);
      }
    });
  },
  createPlayerEntity(playerId, roomNum) {
    return new Promise((resolve, reject) => {
      try {
        const newEntity = createEntity(this.world, "player", {
          player: { id: playerId },
          position: { roomNum: roomNum },
          scale: { scaleIndex: scaleIndexes.MEDIUM },
          mortal: { enabled: globalConstants.FALSE },
          killable: { enabled: globalConstants.TRUE },
          health: { val: 100, max: 100, damageIndex: damageIndexes.NONE },
          deathDrops: { dropIndex: dropIndexes.CORPSE, qty: 1 },
          age: {
            val: 0,
            max: 5,
            adultAge: 5,
            tickRate: 1,
            lastTick: 0,
          },
          flammable: {
            enabled: globalConstants.TRUE,
            causesDamage: globalConstants.TRUE,
            damage: 10,
          },
        });
        resolve(newEntity);
      } catch (err) {
        console.error(`Failed to create player entity ${playerId}: ${err}`);
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
  createMobEntity(mobData, roomNum) {
    return new Promise((resolve, reject) => {
      try {
        const maxHp = diceRoll(mobData.maxHP);
        const attackDamange = diceRoll(mobData.bareHandDamage);

        const newEntity = createEntity(this.world, "mob", {
          mob: { id: mobData.id },
          position: { roomNum: roomNum },
          scale: { scaleIndex: scaleIndexes.MEDIUM },
          mortal: { enabled: globalConstants.FALSE },
          killable: { enabled: globalConstants.TRUE },
          health: { val: maxHp, max: maxHp, damageIndex: damageIndexes.NONE },
          deathDrops: { dropIndex: dropIndexes.CORPSE, qty: 1 },
          age: {
            val: 0,
            max: 5,
            adultAge: 5,
            tickRate: 1,
            lastTick: 0,
          },
          flammable: {
            enabled: globalConstants.TRUE,
            causesDamage: globalConstants.TRUE,
            damage: 10,
          },
          mobStats: {
            alignment: Number(mobData.alignment),
            level: Number(mobData.level),
            ac: Number(mobData.armorClass),
            exp: Number(mobData.xp),
            gold: Number(mobData.gold),
            gender: Number(mobData.gender),
            loadState: Number(mobData.loadPosition),
            defaultState: Number(mobData.defaultPosition),
            state: Number(mobData.defaultPosition),
            attackDamange: Number(attackDamange),
          },
        });
        resolve(newEntity);
      } catch (err) {
        console.error(`Failed to create mob entity #${mobData.id} ${mobData.shortDesc}: ${err}`);
        reject(err);
      }
    });
  },
  createItemEntity(itemData, roomNum) {
    // TODO: implement
  },
};

export default simulation;

// const newEntity = createEntity(world, "person", {
//   position: { x: 0, y: 0 },
//   scale: { scaleIndex: scaleIndexes.MEDIUM },
//   mortal: { enabled: globalConstants.FALSE },
//   killable: { enabled: globalConstants.TRUE },
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
//     enabled: globalConstants.TRUE,
//     causesDamage: globalConstants.TRUE,
//     damage: 10,
//   },
// });

// const newEntity = createEntity(world, "tree", {
//   position: { x: 0, y: 0 },
//   durability: { val: 100, min: 0, max: 100 },
//   breakable: { enabled: globalConstants.TRUE, damageIndex: damageIndexes.NONE },
//   deathDrops: { dropIndex: dropIndexes.WOOD, qty: 1 },
//   scale: { scaleIndex: scaleIndexes.LARGE },
//   flammable: {
//     enabled: globalConstants.TRUE,
//     causesDamage: globalConstants.TRUE,
//     damage: 10,
//   },
//   age: {
//     val: 0,
//     max: 5,
//     adultAge: 5,
//     tickRate: 1,
//     lastTick: 0,
//   },
//   mortal: { enabled: globalConstants.FALSE },
// });

// const newEntity = createEntity(world, "wood", {
//   position: { x: 0, y: 0 },
//   durability: { val: 100, min: 0, max: 100 },
//   breakable: { enabled: globalConstants.TRUE, damageIndex: damageIndexes.NONE },
//   scale: { scaleIndex: scaleIndexes.MEDIUM },
//   deathDrops: { dropIndex: dropIndexes.WOOD, qty: 1 },
//   flammable: {
//     enabled: globalConstants.TRUE,
//     causesDamage: globalConstants.TRUE,
//     damage: 10,
//   },
// });

// Set the object on fire
// addComponentWithProperty(world, "person", newEntity, "burning", "enabled", globalConstants.TRUE);

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
