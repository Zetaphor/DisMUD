import { addComponent, defineQuery, hasComponent } from "bitecs";
import constants from "../constants";

const burningSystem = (world) => {
  const Flammable = world._components["flammable"];
  const Burning = world._components["burning"];
  const Damage = world._components["damage"];

  const flammableQuery = defineQuery([Flammable, Burning]);

  const ents = flammableQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    if (
      Burning.enabled[eid] === constants.TRUE &&
      Flammable.enabled[eid] === constants.TRUE &&
      Flammable.causesDamage[eid] === constants.TRUE
    ) {
      if (hasComponent(world, "Damage", eid)) {
        Damage.val[eid] += Flammable.damage[eid];
      } else {
        addComponent(world, Damage, eid);
        Damage.val[eid] = Flammable.damage[eid];
      }
    }
  }
  return world;
};

export function initBurningSystem() {
  return burningSystem;
}

export default initBurningSystem;
