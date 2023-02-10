const { performance } = require("perf_hooks");

const timeSystem = (world) => {
  const time = world.time;
  const now = performance.now();
  const delta = now - time.then;

  world.time.delta = delta;
  world.time.elapsed += delta;
  world.time.then = now;
  world.time.ticks = BigInt(Math.floor(world.time.elapsed / world.time.tickRate));

  const dateTime = calculateDateTime(world.time.ticks);
  if (world.time.hour !== dateTime.hour) {
    // console.log("Increase hour:", world.time.hour);
    world.time.hour = dateTime.hour;
  }
  if (world.time.weekday !== dateTime.weekday) {
    // console.log("Increase day:", world.time.weekday);
    world.time.weekday = dateTime.weekday;
  }
  if (world.time.month !== dateTime.month) {
    // console.log("Increase month:", world.time.month);
    world.time.month = dateTime.month;
  }
  if (world.time.year !== dateTime.year) {
    // console.log("Increase year:", world.time.year);
    world.time.year = dateTime.year;
  }
  return world;
};

// const tickRate = 1; // 1 second
// const ticksPerDay = 1000n; // Debug
// const daysPerMonth = 2n; // Debug
// const monthsPerYear = 5n; // Debug

const tickRate = 1000; // 1 second
const ticksPerDay = 3600000n; // 1 hour
const hoursPerDay = 24n;
const daysPerMonth = 30n; // 1 month = 210 hours = 8.75 days
const monthsPerYear = 17n; // 1 year = 3,750 hours = 148.75 days = ~6 months

const moveTickRate = 15; // Move every 10 seconds

const ticksPerHour = BigInt(ticksPerDay / hoursPerDay);
const ticksPerMonth = BigInt(ticksPerDay * daysPerMonth);
const ticksPerYear = BigInt(ticksPerMonth * monthsPerYear);
const sunsetHour = 9;
const sunriseHour = 6;

function calculateDateTime(ticks: bigint) {
  return {
    year: Number(ticks / ticksPerYear),
    month: Number((ticks % ticksPerYear) / ticksPerMonth),
    weekday: Number((ticks % ticksPerMonth) / ticksPerDay),
    hour: Number((ticks % ticksPerDay) / ticksPerHour),
  };
}

export default function initTimeSystem(world) {
  world["time"] = {
    tickRate: tickRate,
    moveTickRate: moveTickRate,
    delta: 0,
    elapsed: 0,
    ticks: 0n,
    then: performance.now(),
    hour: 0,
    weekday: 0,
    month: 0,
    year: 1,
    sunriseHour: sunriseHour,
    sunsetHour: sunsetHour,
  };

  return timeSystem;
}
