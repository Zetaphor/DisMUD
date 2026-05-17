import { defineQuery } from "bitecs";
import logger from "../util/logger";
import emoji from "../messages/emoji";
import globalConstants from "../simulation/constants/global";

export const mobs = {
  activeMobs: {},
  mobCounts: {},

  getActiveMobData(eid) {
    return this.activeMobs[eid];
  },
  loadMobData(db, vNum) {
    return db.methods.getMobData(vNum);
  },
  placeMob(worldState, mobData, roomNum, maxExisting = -1) {
    const mobId = worldState.simulation.createMobEntity(
      Number(worldState.simulation.world.time.ticks),
      mobData,
      roomNum
    );
    mobData.items = {};
    mobData.equipment = {};
    mobData.followers = {};
    mobData.following = null;
    mobData.followingPlayer = false;
    mobData.followingName = "";
    this.activeMobs[mobId] = mobData;

    if (this.mobCounts[mobData.id] === undefined) {
      this.mobCounts[mobData.id] = { qty: 1, max: maxExisting };
    } else this.mobCounts[mobData.id]["qty"] += 1;
    return mobId;
  },
  removeMob(worldState, mobId) {
    worldState.simulation.removeWorldEntity(mobId);
    delete this.activeMobs[mobId];
    this.mobCounts[mobId]--;
  },
  getMobInventory(mobId) {
    return this.activeMobs[mobId].items;
  },
  mobHasItem(mobId, itemId) {
    const mob = this.activeMobs[mobId];
    return mob.items[itemId] !== undefined;
  },
  updateMobItemQty(mobId, itemId, qty) {
    if (this.activeMobs[mobId].items[itemId] !== undefined) {
      this.activeMobs[mobId].items[itemId].qty += qty;
      if (this.activeMobs[mobId].items[itemId].qty === 0) {
        delete this.activeMobs[mobId].items[itemId];
      }
    }
  },
  giveMobItem(mobId, itemData, quantity) {
    if (typeof this.activeMobs[mobId].items[itemData.id] === "undefined") {
      this.activeMobs[mobId].items[itemData.id] = {
        qty: quantity,
        data: itemData,
      };
    } else this.activeMobs[mobId].items[itemData.id].qty += quantity;
  },
  removeMobItem(mobId, itemId) {
    if (this.activeMobs[mobId].items[itemId] !== undefined) {
      delete this.activeMobs[mobId].items[itemId];
    }
  },
  equipMobItem(mobId, itemData, position) {
    if (typeof this.activeMobs[mobId].equipment[itemData.id] === "undefined") {
      this.activeMobs[mobId].equipment[itemData.id] = {
        position: position,
        data: itemData,
      };
    }
  },
  addFollower(mobId, eid, player = false) {
    try {
      if (typeof this.activeMobs[mobId].followers[eid] === "undefined") {
        this.activeMobs[mobId].followers[eid] = {
          eid: eid,
          player: player,
        };
      }
    } catch (err) {
      logger.error({ err }, `Error adding ${player ? "player" : "mob"} ${mobId} follower ${eid}`);
    }
  },
  removeFollower(mobId, eid) {
    try {
      if (typeof this.activeMobs[mobId].followers[eid] !== "undefined") {
        delete this.activeMobs[mobId].followers[eid];
      }
    } catch (err) {
      logger.error({ err }, `Error removing ${mobId}'s follower ${eid}`);
    }
  },
  setFollowing(mobId, eid, name, player = false) {
    this.activeMobs[mobId].following = eid;
    this.activeMobs[mobId].followingName = name;
    this.activeMobs[mobId].followingPlayer = player;
  },
  stopFollowing(mobId) {
    this.activeMobs[mobId].following = null;
    this.activeMobs[mobId].followingName = "";
    this.activeMobs[mobId].followingPlayer = false;
  },
  wanderQuery: null,
  wanderComponent: null,
  setupMobMovementQuery(worldState) {
    this.wanderComponent = worldState.simulation.world._components["wander"];
    this.wanderQuery = defineQuery([this.wanderComponent]);
  },
  timedMobMovement(worldState) {
    const ents = this.wanderQuery(worldState.simulation.world);
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i];
      if (this.wanderComponent.pending[eid] === globalConstants.FALSE) continue;
      const oldRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, eid);
      const roomExits = worldState.rooms.getRoomExits(worldState.db["rooms"], oldRoomNum);
      const exitData = Object.values(roomExits);
      const directionNames = Object.keys(roomExits);

      const mobData = worldState.mobs.getActiveMobData(eid);

      if (mobData.following !== null) {
        continue;
      }

      const direction = Math.floor(Math.random() * exitData.length);
      if (
        !exitData.length ||
        exitData[direction]["roomId"] === -1 ||
        !worldState.rooms.getRoomExitOpen(oldRoomNum, directionNames[direction]) ||
        worldState.rooms.getRoomExitLocked(oldRoomNum, directionNames[direction])
      )
        continue;
      else {
        worldState.rooms.updateEntityRoomNum(worldState.simulation.world, eid, exitData[direction]["roomId"]);
        this.wanderComponent.pending[eid] = globalConstants.FALSE;
        this.wanderComponent.lastTick[eid] = Number(worldState.simulation.world.time.ticks);
      }

      worldState.broadcasts.sendToRoom(
        worldState,
        oldRoomNum,
        -1,
        false,
        `${emoji.exit} _${worldState.utils.capitalizeFirst(mobData.shortDesc)} leaves ${directionNames[direction]}._`
      );

      if (exitData[direction]["roomId"] !== -1) {
        worldState.broadcasts.sendToRoom(
          worldState,
          exitData[direction]["roomId"],
          -1,
          false,
          `${emoji.enter} _${worldState.utils.capitalizeFirst(mobData.shortDesc)} has arrived._`
        );
      }

      for (const follower in mobData.followers) {
        if (Object.prototype.hasOwnProperty.call(mobData.followers, follower)) {
          const followerData = mobData.followers[follower];
          const followerRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, followerData.eid);

          if (followerRoomNum === oldRoomNum) {
            if (followerData.player) {
              worldState.players.sendCommandAsUser(
                worldState,
                followerData.eid,
                `move ${directionNames[direction]}`
              );
            } else {
              const followerMobData = worldState.mobs.getActiveMobData(followerData.eid);

              worldState.rooms.updateEntityRoomNum(
                worldState.simulation.world,
                followerData.eid,
                exitData[direction]["roomId"]
              );

              worldState.broadcasts.sendToRoom(
                worldState,
                oldRoomNum,
                -1,
                false,
                `${emoji.exit} _${worldState.utils.capitalizeFirst(followerMobData.shortDesc)} leaves ${
                  directionNames[direction]
                }._`
              );

              worldState.broadcasts.sendToRoom(
                worldState,
                roomExits[directionNames[direction]].roomId,
                -1,
                false,
                `${emoji.enter} _${worldState.utils.capitalizeFirst(mobData.shortDesc)} has arrived._`
              );
            }
          }
        }
      }
    }
  },
};

export default mobs;
