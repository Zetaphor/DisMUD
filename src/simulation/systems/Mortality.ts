import { addComponent, defineQuery, hasComponent } from "bitecs";
import globalConstants from "../constants/global";
import { lookupDamageIndex } from "../indexes/damageIndexes";

let Health,
  Killable,
  Destroyed,
  healthQuery = null;

const mortalitySystem = (world) => {
  if (healthQuery === null) {
    Health = world._components["health"];
    Killable = world._components["killable"];
    Destroyed = world._components["destroyed"];
    healthQuery = defineQuery([Health]);
  }

  const ents = healthQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    if (hasComponent(world, Killable, eid) && Killable.enabled[eid] === globalConstants.TRUE) {
      if (Health.val[eid] <= 0) {
        console.log(`Killing ${eid} from ${lookupDamageIndex(Health.damageIndex[eid])}`);
        addComponent(world, Destroyed, eid);
      }
    }
  }
  return world;
};

export default function initMortalitySystem() {
  return mortalitySystem;
}
