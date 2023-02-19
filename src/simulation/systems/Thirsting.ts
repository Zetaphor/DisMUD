import { defineQuery } from "bitecs";

let Thirst,
  thirstQuery = null;

const thirstSystem = (world) => {
  if (thirstQuery === null) {
    Thirst = world._components["thirst"];
    thirstQuery = defineQuery([Thirst]);
  }

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
