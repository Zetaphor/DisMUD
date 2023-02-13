import { defineQuery } from "bitecs";
import emoji from "../messages/emoji";
import globalConstants from "../simulation/constants/global";

export const mobs = {
  activeMobs: {}, // { mobEID: mobData }

  getActiveMobData(eid) {
    return this.activeMobs[eid];
  },
  loadMobData(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const mob = await db.methods.getMobData(vNum);
        resolve(mob);
      } catch (err) {
        console.error(`Error loading mob ${vNum}: ${err}`);
        reject(err);
      }
    });
  },
  placeMob(worldState, mobData, roomNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const mobId = await worldState.simulation.createMobEntity(
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
        resolve(mobId);
      } catch (err) {
        console.error(`Error placing mob ${mobData.id} in room #${roomNum}: ${err}`);
        reject(err);
      }
    });
  },
  removeMob(worldState, mobId) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        await worldState.simulation.removeWorldEntity(mobId);
        delete this.activeMobs[mobId];
        resolve();
      } catch (err) {
        console.error(`Error removing mob ${mobId}: ${err}`);
        reject(err);
      }
    });
  },
  getMobInventory(mobId) {
    return new Promise(async (resolve, reject) => {
      try {
        return this.activeMobs[mobId].items;
      } catch (err) {
        console.error(`Error getting mob inventory for ${mobId}: ${err}`);
        reject(err);
      }
    });
  },
  mobHasItem(mobId, itemId) {
    return new Promise(async (resolve, reject) => {
      try {
        const mob = this.activeMobs[mobId];
        if (mob.items[itemId] !== undefined) {
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.error(`Error checking mob inventory for ${mobId}: ${err}`);
        reject(err);
      }
    });
  },
  updateMobItemQty(mobId, itemId, qty) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (this.activeMobs[mobId].items[itemId] !== undefined) {
          this.activeMobs[mobId].items[itemId].qty += qty;
          if (this.activeMobs[mobId].items[itemId].qty === 0) {
            delete this.activeMobs[mobId].items[itemId];
          }
        }
        resolve();
      } catch (err) {
        console.error(`Error update mob ${mobId} item ${itemId} qty ${qty}: ${err}`);
        reject(err);
      }
    });
  },
  giveMobItem(mobId, itemData, quantity) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (typeof this.activeMobs[mobId].items[itemData.id] === "undefined") {
          this.activeMobs[mobId].items[itemData.id] = {
            qty: quantity,
            data: itemData,
          };
        } else this.activeMobs[mobId].items[itemData.id].qty += quantity;
        resolve();
        this.activeMobs[mobId].items[itemData.id] = itemData;
        resolve();
      } catch (err) {
        console.error(`Error giving mob ${mobId} item ${itemData.id}: ${err}`);
        reject(err);
      }
    });
  },
  removeMobItem(mobId, itemId) {
    return new Promise<void>(async (resolve, reject) => {
      try {
        if (this.activeMobs[mobId].items[itemId] !== undefined) {
          delete this.activeMobs[mobId].items[itemId];
        }
        resolve();
      } catch (err) {
        console.error(`Error removing mob ${mobId} item ${itemId}: ${err}`);
        reject(err);
      }
    });
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
      console.error(`Error adding ${player ? "player" : "mob"} ${mobId} follower ${eid}: ${err}`);
    }
  },
  removeFollower(mobId, eid) {
    try {
      if (typeof this.activeMobs[mobId].followers[eid] !== "undefined") {
        delete this.activeMobs[mobId].followers[eid];
      }
    } catch (err) {
      console.error(`Error removing ${mobId}'s follower ${eid}: ${err}`);
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
  async timedMobMovement(worldState) {
    const Wander = worldState.simulation.world._components["wander"];
    const wanderQuery = defineQuery([Wander]);

    const ents = wanderQuery(worldState.simulation.world);
    for (let i = 0; i < ents.length; i++) {
      const eid = ents[i];
      if (Wander.pending[eid] === globalConstants.FALSE) continue;
      const oldRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, eid);
      const roomExits = await worldState.rooms.getRoomExits(worldState.db["rooms"], oldRoomNum);
      const exitData = Object.values(roomExits);
      const directionNames = Object.keys(roomExits);

      const mobData = worldState.mobs.getActiveMobData(eid);

      if (mobData.following !== null) {
        continue; // Don't randomly move if we're following someone
      }

      const direction = Math.floor(Math.random() * exitData.length);
      if (!exitData.length || exitData[direction]["roomId"] === -1) continue;
      else {
        await worldState.rooms.updateEntityRoomNum(worldState.simulation.world, eid, exitData[direction]["roomId"]);
        Wander.pending[eid] = globalConstants.FALSE;
        Wander.lastTick[eid] = Number(worldState.simulation.world.time.ticks);
      }

      worldState.broadcasts.sendToRoom(
        worldState,
        oldRoomNum,
        -1,
        false,
        `${emoji.exit} _${mobData.shortDesc} leaves ${directionNames[direction]}._`
      );

      if (exitData[direction]["roomId"] !== -1) {
        worldState.broadcasts.sendToRoom(
          worldState,
          exitData[direction]["roomId"],
          -1,
          false,
          `${emoji.enter} _${mobData.shortDesc} has arrived._`
        );
      }

      for (const follower in mobData.followers) {
        if (Object.prototype.hasOwnProperty.call(mobData.followers, follower)) {
          const followerData = mobData.followers[follower];
          const followerRoomNum = worldState.rooms.getEntityRoomNum(worldState.simulation.world, followerData.eid);

          if (followerRoomNum === oldRoomNum) {
            if (followerData.player) {
              const followerPlayer = await worldState.players.getActiveByEntityId(followerData.eid);
              await worldState.players.sendCommandAsUser(
                worldState,
                followerPlayer.id,
                `move ${directionNames[direction]}`
              );
            } else {
              const followerMobData = worldState.mobs.getActiveMobData(followerData.eid);

              await worldState.rooms.updateEntityRoomNum(
                worldState.simulation.world,
                followerData.eid,
                exitData[direction]["roomId"]
              );

              worldState.broadcasts.sendToRoom(
                worldState,
                oldRoomNum,
                -1,
                false,
                `${emoji.exit} _${followerMobData.shortDesc} leaves ${directionNames[direction]}._`
              );

              worldState.broadcasts.sendToRoom(
                worldState,
                roomExits[directionNames[direction]].roomId,
                -1,
                false,
                `${emoji.enter} _${mobData.shortDesc} has arrived._`
              );
            }
          }
        }
      }
    }
  },
};

export default mobs;
