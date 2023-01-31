import constants from "./utils/constants";
import createEntity from "./utils/createEntity";
import { addComponentWithProperty } from "./utils/setComponent";
import setupWorld from "./loaders/world";
import { damageIndexes } from "./indexes/damageIndexes";
import { scaleIndexes } from "./indexes/scaleIndexes";
import { dropIndexes } from "./indexes/dropIndexes";

const world = setupWorld();

const newEntity = createEntity(world, "tree", {
  position: { x: 0, y: 0 },
  durability: { val: 100, min: 0, max: 100 },
  breakable: { enabled: constants.TRUE, damageIndex: damageIndexes.NONE },
  deathDrops: { dropIndex: dropIndexes.WOOD, qty: 1 },
  scale: { scaleIndex: scaleIndexes.LARGE },
  flammable: {
    enabled: constants.TRUE,
    causesDamage: constants.TRUE,
    damage: 10,
  },
});

// const newEntity = createEntity(world, "wood", {
//   position: { x: 0, y: 0 },
//   durability: { val: 100, min: 0, max: 100 },
//   breakable: { enabled: constants.TRUE, damageIndex: damageIndexes.NONE },
//   flammable: {
//     enabled: constants.TRUE,
//     causesDamage: constants.TRUE,
//     damage: 10,
//   },
// });

// console.log(newEntity);
// console.log(hasComponent(world, world["_components"]["position"], newEntity));
// console.log(hasComponent(world, world["_components"]["durability"], newEntity));
// console.log(hasComponent(world, world["_components"]["breakable"], newEntity));
// console.log(hasComponent(world, world["_components"]["flammable"], newEntity));

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
