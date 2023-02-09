export const mobs = {
  activeMobs: {}, // { mobEID: mobData }

  loadMobData(db, vNum) {
    return new Promise(async (resolve, reject) => {
      try {
        const mob = await db.methods.getMobData(vNum);
        resolve(mob);
      } catch (err) {
        console.error(`Error loading mob ${vNum}: ${err.message}`);
        reject(err);
      }
    });
  },
  placeMob(worldState, mobData, roomNum: BigInt) {
    return new Promise(async (resolve, reject) => {
      try {
        const mobId = await worldState.simulation.createMobEntity(mobData, roomNum);
        this.activeMobs[mobId] = mobData;
        resolve(mobId);
      } catch (err) {
        console.error(`Error placing mob ${mobData.id} in room #${roomNum}: ${err.message}`);
        reject(err);
      }
    });
  },
};

export default mobs;
