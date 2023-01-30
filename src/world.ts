import { createWorld, hasComponent } from "bitecs";
import components from "./components";
import { entities } from "./entities";
import { constants } from "./constants";
import { createEntity } from "./utils/createEntity";

import { initSystems, startPipeline } from "./systems";

const world = createWorld();

world["_components"] = components;
world["_entities"] = entities;

const systems = initSystems(world);

const pipeline = startPipeline(systems);

setInterval(function () {
  pipeline(world);
}, 16);

const newEntity = createEntity(world, "wood", {
  position: { x: 0, y: 0 },
  durability: { val: 0, min: 0, max: 100 },
  flammable: { enabled: constants.TRUE },
  breakable: { enabled: constants.TRUE },
});

console.log(newEntity);
console.log(hasComponent(world, world["_components"]["position"], newEntity));
console.log(hasComponent(world, world["_components"]["durability"], newEntity));
console.log(hasComponent(world, world["_components"]["breakable"], newEntity));
console.log(hasComponent(world, world["_components"]["flammable"], newEntity));
