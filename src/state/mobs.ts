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

      const direction = Math.floor(Math.random() * exitData.length);
      if (exitData[direction]["roomId"] === -1) this.removeMob(worldState, eid);
      else {
        await worldState.rooms.updateEntityRoomNum(worldState.simulation.world, eid, exitData[direction]["roomId"]);
        Wander.pending[eid] = globalConstants.FALSE;
        Wander.lastTick[eid] = Number(worldState.simulation.world.time.ticks);
      }

      const mobData = worldState.mobs.getActiveMobData(eid);
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
    }
  },
};

export default mobs;
