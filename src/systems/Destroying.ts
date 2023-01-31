import { defineQuery, hasComponent, removeEntity } from "bitecs";
import { getDropByIndex } from "../indexes/dropIndexes";
import createEntity from "../utils/createEntity";

const destroyingSystem = (world) => {
  const Destroyed = world._components["destroyed"];
  const DeathDrops = world._components["deathDrops"];

  const destroyedQuery = defineQuery([Destroyed, DeathDrops]);

  const ents = destroyedQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];

    if (hasComponent(world, DeathDrops, eid)) {
      for (let i = 0; i < DeathDrops.qty[eid]; i++) {
        const dropDefinition = getDropByIndex(DeathDrops.dropIndex[eid]);
        createEntity(world, dropDefinition.entityName, dropDefinition.data);
        console.log("Dropped " + dropDefinition.description);
      }
    }
    console.log(`Destroyed ${eid}`);
    removeEntity(world, eid);
  }
  return world;
};

export default function initDestroyingSystem() {
  return destroyingSystem;
}
