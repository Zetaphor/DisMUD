import { defineQuery } from "bitecs";

const hungerSystem = (world) => {
  const Hunger = world._components["hunger"];

  const hungerQuery = defineQuery([Hunger]);

  const ents = hungerQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    // Increment age if tickRate has passed
    if (world.time.ticks - BigInt(Hunger.lastTick[eid]) >= BigInt(Hunger.tickRate[eid])) {
      Hunger.lastTick[eid] = Number(world.time.ticks);
      Hunger.val[eid] += 1;
      // console.log(`Age of ${eid} is now ${Hunger.val[eid]}`);
    }
  }
  return world;
};

export default function initHungeringSystem() {
  return hungerSystem;
}
