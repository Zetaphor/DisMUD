import constants from "../utils/constants";
import { lookupDamageIndex, damageIndexes } from "./damageIndexes";
import { scaleIndexes } from "./scaleIndexes";

export const dropIndexes = {
  NONE: 1, // I can remove this once I rework createEntity
  WOOD: 2,
};

const dropIndexData = {
  WOOD: {
    description: "A regular piece of wood",
    entityName: "wood",
    data: {
      position: { x: 0, y: 0 },
      durability: { val: 100, min: 0, max: 100 },
      breakable: {
        enabled: constants.TRUE,
        damageIndex: lookupDamageIndex(damageIndexes.NONE),
      },
      flammable: {
        enabled: constants.TRUE,
        causesDamage: constants.TRUE,
        damage: 10,
      },
      scale: { scaleIndex: scaleIndexes.SMALL },
      deathDrops: { dropIndex: 1, qty: 0 }, // I can remove this after I rework createEntity
    },
  },
};

const dropIndexKeys = Object.keys(dropIndexes);
const dropIndexValues = Object.values(dropIndexes);

export function lookupDropIndex(index) {
  return dropIndexKeys[dropIndexValues.indexOf(index)];
}

export function getDropByIndex(index) {
  return dropIndexData[dropIndexKeys[dropIndexValues.indexOf(index)]];
}

export function getDropByIndexName(index) {
  return dropIndexData[index];
}
