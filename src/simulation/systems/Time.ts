const { performance } = require("perf_hooks");

const timeSystem = (world) => {
  const time = world.time;
  const now = performance.now();
  const delta = now - time.then;
  world.time.delta = delta;
  world.time.elapsed += delta;
  world.time.then = now;
  world.time.ticks = Math.floor(world.time.elapsed / world.time.tickRate);
  return world;
};

export default function initTimeSystem(world) {
  world["time"] = {
    tickRate: 1000,
    delta: 0,
    elapsed: 0,
    ticks: 0,
    then: performance.now(),
  };

  return timeSystem;
}
