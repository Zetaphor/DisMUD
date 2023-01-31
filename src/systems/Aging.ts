import { addComponent, defineQuery } from "bitecs";
import constants from "../utils/constants";

const agingSystem = (world) => {
  const Age = world._components["age"];
  const Destroyed = world._components["destroyed"];

  const ageQuery = defineQuery([Age]);

  const ents = ageQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    // Skip if we're already at max age and weren't destroyed
    if (Age.val[eid] === Age.max[eid]) continue;

    // Increment age if tickRate has passed
    if (world.time.ticks - Age.lastTick[eid] >= Age.tickRate[eid]) {
      Age.lastTick[eid] = world.time.ticks;
      Age.val[eid] += 1;
      // console.log(`Age of ${eid} is now ${Age.val[eid]}`);
    }

    // Max out age
    if (Age.val[eid] > Age.max[eid]) Age.val[eid] = Age.max[eid];

    //Destroy if too old
    if (
      Age.destroyAtMax[eid] === constants.TRUE &&
      Age.val[eid] === Age.max[eid]
    ) {
      addComponent(world, Destroyed, eid);
      console.log(`${eid} is destroyed from old age`);
    }
  }
  return world;
};

export default function initAgingSystem() {
  return agingSystem;
}
