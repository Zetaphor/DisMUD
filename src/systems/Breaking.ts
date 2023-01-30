import { defineQuery, removeEntity } from "bitecs";
import constants from "../utils/constants";
import lookupDamageIndex from "../utils/damageIndexes";

const breakingSystem = (world) => {
  const Breakable = world._components["breakable"];
  const Durability = world._components["durability"];

  const breakableQuery = defineQuery([Breakable]);

  const ents = breakableQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    if (Breakable.enabled[eid] === constants.TRUE) {
      if (Durability.val[eid] <= Durability.min[eid]) {
        console.log(
          `Breaking ${eid} from ${lookupDamageIndex(
            Breakable.damageIndex[eid]
          )}`
        );
        removeEntity(world, eid);
      }
    }
  }
  return world;
};

export function initBreakingSystem() {
  return breakingSystem;
}

export default initBreakingSystem;
