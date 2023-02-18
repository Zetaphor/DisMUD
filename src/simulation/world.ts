import setupWorld from "./loaders/world";
import globalConstants from "./constants/global";
import createEntity from "./utils/createEntity";
import { damageIndexes } from "./indexes/damageIndexes";
import { scaleIndexes } from "./indexes/scaleIndexes";
import { dropIndexes } from "./indexes/dropIndexes";
import { defineQuery, removeEntity } from "bitecs";
import diceRoll from "./utils/diceRoll";
import { hasBitvector } from "./utils/bitvectors";
import mobConstants from "./constants/mobs";
import PlayerDefinition from "./entities/Player";

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
  createNewPlayerEntity(playerId, roomNum, playerStats) {
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
          playerStats: playerStats,
          hunger: {
            val: 0,
            max: 5,
            tickRate: 1,
            lastTick: 0,
          },
          thirst: {
            val: 0,
            max: 5,
            tickRate: 1,
            lastTick: 0,
          },
        });
        resolve(newEntity);
      } catch (err) {
        console.error(`Failed to create player entity ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  createExistingPlayerEntity(playerId, simulationData) {
    return new Promise((resolve, reject) => {
      try {
        const newEntity = createEntity(this.world, "player", simulationData);
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
  createMobEntity(lastTick, mobData, roomNum) {
    return new Promise((resolve, reject) => {
      try {
        const maxHp = diceRoll(mobData.maxHP);
        const attackDamange = diceRoll(mobData.bareHandDamage);

        let wanderingEnabled = globalConstants.TRUE;

        if (hasBitvector(mobConstants.ACTION_BITVECTOR.SENTINEL, mobData.actionBitVector)) {
          wanderingEnabled = globalConstants.FALSE;
        }

        const newEntity = createEntity(this.world, "mob", {
          mob: { id: mobData.id },
          wander: { enabled: wanderingEnabled, pending: globalConstants.FALSE, lastTick: lastTick },
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
            lastTick: lastTick,
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
        console.error(`Failed to create mob entity #${mobData.id} ${mobData.shortDesc} in room #${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  createItemEntity(itemData, roomNum) {
    return new Promise((resolve, reject) => {
      try {
        const newEntity = createEntity(this.world, "item", {
          item: { id: itemData.id },
          position: { roomNum: roomNum },
          scale: { scaleIndex: scaleIndexes.MEDIUM },
        });
        resolve(newEntity);
      } catch (err) {
        console.error(`Failed to create item entity #${itemData.id} ${itemData.shortDesc} in room #${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  getPlayerStat(entityId, statName) {
    return new Promise((resolve, reject) => {
      try {
        const PlayerStats = this.world._components["playerStats"];
        const playerStatsQuery = defineQuery([PlayerStats]);
        const ents = playerStatsQuery(this.world);
        for (let i = 0; i < ents.length; i++) {
          if (ents[i] === entityId) {
            resolve(PlayerStats[statName][ents[i]]);
          }
        }
      } catch (err) {
        console.error(`Failed to get player stat ${statName} for entity ${entityId}: ${err}`);
        reject(err);
      }
    });
  },
  getPlayerStats(playerId) {
    return new Promise((resolve, reject) => {
      try {
        const PlayerStats = this.world._components["playerStats"];
        const playerStatsQuery = defineQuery([PlayerStats]);
        const ents = playerStatsQuery(this.world);
        let foundStats = {};
        for (let i = 0; i < ents.length; i++) {
          if (ents[i] === playerId) {
            const statProperties = Object.keys(PlayerStats);
            for (let j = 0; j < statProperties.length; j++) {
              foundStats[statProperties[j]] = PlayerStats[statProperties[j]][ents[i]];
            }
            i = ents.length;
          }
        }
        resolve(foundStats);
      } catch (err) {
        console.error(`Failed to get player stats for player ${playerId}: ${err}`);
        reject(err);
      }
    });
  },
  serializePlayer(playerEntityId) {
    return new Promise((resolve, reject) => {
      try {
        const completePlayerEntity = {};
        const playerEntityDefinition = PlayerDefinition.components;
        for (let i = 0; i < playerEntityDefinition.length; i++) {
          const component = playerEntityDefinition[i];
          const componentProperties = Object.keys(this.world["_components"][component]);
          completePlayerEntity[component] = {};
          for (let j = 0; j < componentProperties.length; j++) {
            const property = componentProperties[j];
            completePlayerEntity[component][property] = this.world["_components"][component][property][playerEntityId];
          }
        }
        resolve(completePlayerEntity);
      } catch (err) {
        console.error(`Failed to serialize player entity ${playerEntityId}: ${err}`);
        reject(err);
      }
    });
  },
  getPlayersInZone(zoneNum) {
    return new Promise((resolve, reject) => {
      try {
        const Player = this.world._components["player"];
        const Position = this.world._components["position"];
        const playerQuery = defineQuery([Player]);
        const ents = playerQuery(this.world);
        const playersInZone = [];
        for (let i = 0; i < ents.length; i++) {
          if (Math.floor(Position["roomNum"][ents[i]] / 100) === zoneNum) {
            playersInZone.push(ents[i]);
          }
        }
        resolve(playersInZone);
      } catch (err) {
        console.error(`Failed to get players in zone ${zoneNum}: ${err}`);
        reject(err);
      }
    });
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

// Set the entity on fire
// addComponentWithProperty(world, "person", newEntity, "burning", "enabled", globalConstants.TRUE);

// // Validate components
// console.info(newEntity);
// console.info(
//   "position:",
//   hasComponent(world, world["_components"]["position"], newEntity)
// );
// console.info(
//   "durability:",
//   hasComponent(world, world["_components"]["durability"], newEntity)
// );
// console.info(
//   "breakable:",
//   hasComponent(world, world["_components"]["breakable"], newEntity)
// );
// console.info(
//   "flammable:",
//   hasComponent(world, world["_components"]["flammable"], newEntity)
// );
// console.info(
//   "scale:",
//   hasComponent(world, world["_components"]["scale"], newEntity)
// );
// console.info(
//   "deathDrops:",
//   hasComponent(world, world["_components"]["deathDrops"], newEntity)
// );

// // Update components directly
// console.info("Value:", world["_components"]["position"]["x"][newEntity]);
// setComponentProperty(world, newEntity, "position", "x", 100);
// setComponentValue(world, newEntity, "position", { x: 100, y: 100 });
// console.info("Value:", world["_components"]["position"]["x"][newEntity]);
