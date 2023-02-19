import { defineQuery, removeComponent } from "bitecs";

let Damage,
  Health,
  Durability,
  healthQuery,
  durabilityQuery = null;

const damagingSystem = (world) => {
  if (durabilityQuery === null) {
    Damage = world._components["damage"];
    Health = world._components["health"];
    Durability = world._components["durability"];
    healthQuery = defineQuery([Damage, Health]);
    durabilityQuery = defineQuery([Damage, Durability]);
  }

  const healthEnts = healthQuery(world);
  for (let i = 0; i < healthEnts.length; i++) {
    const eid = healthEnts[i];
    Health.val[eid] -= Damage.val[eid];
    if (Health.val[eid] < 0) {
      Health.val[eid] = 0;
    }
    console.log(`Damaged ${eid} health with ${Damage.val[eid]} damage`);
    removeComponent(world, Damage, eid);
  }

  const durabilityEnts = durabilityQuery(world);
  for (let i = 0; i < durabilityEnts.length; i++) {
    const eid = durabilityEnts[i];
    Durability.val[eid] -= Damage.val[eid];
    if (Durability.val[eid] < Durability.min[eid]) {
      Durability.val[eid] = Durability.min[eid];
    }
    console.log(`Damaged ${eid} durability with ${Damage.val[eid]} damage`);
    removeComponent(world, Damage, eid);
  }

  return world;
};

export default function initDamagingSystem() {
  return damagingSystem;
}
