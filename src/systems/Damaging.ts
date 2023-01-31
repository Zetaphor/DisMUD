import { defineQuery, removeComponent } from "bitecs";

const damagingSystem = (world) => {
  const Damage = world._components["damage"];
  const Health = world._components["health"];
  const Durability = world._components["durability"];

  const healthQuery = defineQuery([Health]);
  const durabilityQuery = defineQuery([Durability]);

  const healthEnts = healthQuery(world);
  for (let i = 0; i < healthEnts.length; i++) {
    const eid = healthEnts[i];
    Health.val[eid] -= Damage.val[eid];
    if (Health.val[eid] < Health.min[eid]) {
      Health.val[eid] = Health.min[eid];
    }
    removeComponent(world, Damage, eid);
  }

  const durabilityEnts = durabilityQuery(world);
  for (let i = 0; i < durabilityEnts.length; i++) {
    const eid = durabilityEnts[i];
    Durability.val[eid] -= Damage.val[eid];
    if (Durability.val[eid] < Durability.min[eid]) {
      Durability.val[eid] = Durability.min[eid];
    }
    console.log(`Damaged ${eid} with ${Damage.val[eid]} damage`);
    removeComponent(world, Damage, eid);
  }

  return world;
};

export default function initDamagingSystem() {
  return damagingSystem;
}
