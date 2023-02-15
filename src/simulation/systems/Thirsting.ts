import { defineQuery } from "bitecs";

const thirstSystem = (world) => {
  const Thirst = world._components["thirst"];

  const thirstQuery = defineQuery([Thirst]);

  const ents = thirstQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    // Increment age if tickRate has passed
    if (world.time.ticks - BigInt(Thirst.lastTick[eid]) >= BigInt(Thirst.tickRate[eid])) {
      Thirst.lastTick[eid] = Number(world.time.ticks);
      Thirst.val[eid] += 1;
      // console.log(`Age of ${eid} is now ${Thirst.val[eid]}`);
    }
  }
  return world;
};

export default function initThirstingSystem() {
  return thirstSystem;
}
