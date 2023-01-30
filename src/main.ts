import { hasComponent } from "bitecs";
import constants from "./constants";
import createEntity from "./utils/createEntity";
import { addComponentWithProperty } from "./utils/setComponent";
import setupWorld from "./world";

const world = setupWorld();

const newEntity = createEntity(world, "wood", {
  position: { x: 0, y: 0 },
  durability: { val: 100, min: 0, max: 100 },
  breakable: { enabled: constants.TRUE },
  flammable: {
    enabled: constants.TRUE,
    causesDamage: constants.TRUE,
    damage: 10,
  },
});

console.log(newEntity);
console.log(hasComponent(world, world["_components"]["position"], newEntity));
console.log(hasComponent(world, world["_components"]["durability"], newEntity));
console.log(hasComponent(world, world["_components"]["breakable"], newEntity));
console.log(hasComponent(world, world["_components"]["flammable"], newEntity));

addComponentWithProperty(
  world,
  newEntity,
  "burning",
  "enabled",
  constants.TRUE
);

// console.log("Value:", world["_components"]["position"]["x"][newEntity]);
// setComponentProperty(world, newEntity, "position", "x", 100);
// setComponentValue(world, newEntity, "position", { x: 100, y: 100 });
// console.log("Value:", world["_components"]["position"]["x"][newEntity]);
