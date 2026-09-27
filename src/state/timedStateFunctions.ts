export const timedStateFunctions = {
  stateFunctions: [],
  interval: null,
  saveCounter: 0,

  setupTimedStateFunctions(worldState) {
    worldState.mobs.setupMobMovementQuery(worldState);
    worldState.mobs.timedMobMovement(worldState);
    this.interval = setInterval(() => {
      worldState.mobs.timedMobMovement(worldState, worldState.simulation.world.time);
      this.saveCounter += 1;
      if (this.saveCounter % 30 === 0) {
        worldState.worldPersistence.saveRuntimeState(worldState);
      }
    }, worldState.simulation.world.time.tickRate);
  },
};

export default timedStateFunctions;
