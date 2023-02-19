import { addComponent, defineQuery, hasComponent } from "bitecs";
import globalConstants from "../constants/global";
import { damageIndexes } from "../indexes/damageIndexes";

let Flammable,
  Burning,
  Damage,
  Breakable,
  flammableQuery = null;

const burningSystem = (world) => {
  if (flammableQuery === null) {
    Flammable = world._components["flammable"];
    Burning = world._components["burning"];
    Damage = world._components["damage"];
    Breakable = world._components["breakable"];
    flammableQuery = defineQuery([Flammable, Burning]);
  }

  const ents = flammableQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    if (
      Burning.enabled[eid] === globalConstants.TRUE &&
      Flammable.enabled[eid] === globalConstants.TRUE &&
      Flammable.causesDamage[eid] === globalConstants.TRUE
    ) {
      if (hasComponent(world, Damage, eid)) {
        Damage.val[eid] += Flammable.damage[eid];
      } else {
        addComponent(world, Damage, eid);
        Damage.val[eid] = Flammable.damage[eid];
      }

      if (hasComponent(world, Breakable, eid)) {
        if (Breakable.enabled[eid] === globalConstants.TRUE) {
          Breakable.damageIndex[eid] = damageIndexes.BURNED;
        }
      }
    }
  }
  return world;
};

export default function initBurningSystem() {
  return burningSystem;
}
