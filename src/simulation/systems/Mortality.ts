import { addComponent, defineQuery, hasComponent } from "bitecs";
import constants from "../constants/global";
import { lookupDamageIndex } from "../indexes/damageIndexes";

const mortalitySystem = (world) => {
  const Health = world._components["health"];
  const Killable = world._components["killable"];
  const Destroyed = world._components["destroyed"];

  const healthQuery = defineQuery([Health]);

  const ents = healthQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    if (hasComponent(world, Killable, eid) && Killable.enabled[eid] === constants.TRUE) {
      if (Health.val[eid] <= Health.min[eid]) {
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
