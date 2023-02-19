import { addComponent, defineQuery } from "bitecs";
import globalConstants from "../constants/global";
import { lookupDamageIndex } from "../indexes/damageIndexes";

let Breakable,
  Durability,
  Destroyed,
  breakableQuery = null;

const breakingSystem = (world) => {
  if (breakableQuery === null) {
    Breakable = world._components["breakable"];
    Durability = world._components["durability"];
    Destroyed = world._components["destroyed"];
    breakableQuery = defineQuery([Breakable]);
  }

  const ents = breakableQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    if (Breakable.enabled[eid] === globalConstants.TRUE) {
      if (Durability.val[eid] <= Durability.min[eid]) {
        console.log(`Breaking ${eid} from ${lookupDamageIndex(Breakable.damageIndex[eid])}`);
        addComponent(world, Destroyed, eid);
      }
    }
  }
  return world;
};

export default function initBreakingSystem() {
  return breakingSystem;
}
