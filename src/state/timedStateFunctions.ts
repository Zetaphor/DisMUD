export const timedStateFunctions = {
  stateFunctions: [],
  interval: null,

  setupTimedStateFunctions(worldState) {
    worldState.mobs.timedMobMovement(worldState);
    this.interval = setInterval(() => {
      worldState.mobs.timedMobMovement(worldState, worldState.simulation.world.time);
    }, worldState.simulation.world.time.tickRate);
  },
};

export default timedStateFunctions;
