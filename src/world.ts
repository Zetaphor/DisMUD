import { addComponent, addEntity, createWorld, pipe } from "bitecs";
import components from "./components";

import { initSystems } from "./systems";

const world = createWorld();

world["_components"] = components;

const systems = initSystems(world);

const pipeline = pipe(systems.time, systems.movement);

const eid = addEntity(world);
addComponent(world, components.position, eid);
addComponent(world, components.velocity, eid);
components.velocity.x[eid] = 1.23;
components.velocity.y[eid] = 1.23;

setInterval(function () {
  pipeline(world);
}, 16);
