import { addComponent, defineQuery, hasComponent } from "bitecs";
import globalConstants from "../constants/global";

let Age,
  Mortal,
  Destroyed,
  ageQuery = null;

const agingSystem = (world) => {
  if (ageQuery === null) {
    Age = world._components["age"];
    Mortal = world._components["mortal"];
    Destroyed = world._components["destroyed"];
    ageQuery = defineQuery([Age]);
  }

  const ents = ageQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    // Increment age if tickRate has passed
    if (world.time.ticks - BigInt(Age.lastTick[eid]) >= BigInt(Age.tickRate[eid])) {
      Age.lastTick[eid] = Number(world.time.ticks);
      Age.val[eid] += 1;
      // console.log(`Age of ${eid} is now ${Age.val[eid]}`);
    }

    // Check if we're immortal
    if (hasComponent(world, Mortal, eid) && Mortal.enabled[eid] === globalConstants.TRUE) {
      //If not, destroy if too old
      if (Age.val[eid] >= Age.max[eid]) {
        addComponent(world, Destroyed, eid);
        console.log(`${eid} is destroyed from old age`);
      }
    }
  }
  return world;
};

export default function initAgingSystem() {
  return agingSystem;
}
