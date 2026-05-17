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
    removeEntity(this.world, entityId);
  },
  createNewPlayerEntity(playerId, roomNum, playerStats) {
    return createEntity(this.world, "player", {
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
  },
  createExistingPlayerEntity(playerId, simulationData) {
    return createEntity(this.world, "player", simulationData);
  },
  getPlayerEntityByPlayerId(playerId) {
    const Player = this.world._components["player"];
    const playerQuery = defineQuery([Player]);
    const ents = playerQuery(this.world);
    for (let i = 0; i < ents.length; i++) {
      if (ents[i]["id"] === playerId) {
        return ents[i];
      }
    }
  },
  createMobEntity(lastTick, mobData, roomNum) {
    const maxHp = diceRoll(mobData.maxHP);
    const attackDamange = diceRoll(mobData.bareHandDamage);

    let wanderingEnabled = globalConstants.TRUE;

    if (hasBitvector(mobConstants.ACTION_BITVECTOR.SENTINEL, mobData.actionBitVector)) {
      wanderingEnabled = globalConstants.FALSE;
    }

    return createEntity(this.world, "mob", {
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
  },
  createItemEntity(itemData, roomNum) {
    return createEntity(this.world, "item", {
      item: { id: itemData.id },
      position: { roomNum: roomNum },
      scale: { scaleIndex: scaleIndexes.MEDIUM },
    });
  },
  getPlayerStat(entityId, statName) {
    const PlayerStats = this.world._components["playerStats"];
    const playerStatsQuery = defineQuery([PlayerStats]);
    const ents = playerStatsQuery(this.world);
    for (let i = 0; i < ents.length; i++) {
      if (ents[i] === entityId) {
        return PlayerStats[statName][ents[i]];
      }
    }
  },
  getPlayerStats(playerId) {
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
        break;
      }
    }
    return foundStats;
  },
  serializePlayer(playerEntityId) {
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
    return completePlayerEntity;
  },
  getPlayersInZone(zoneNum) {
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
    return playersInZone;
  },
};

export default simulation;
