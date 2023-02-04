export const damageIndexes = {
  NONE: 1,
  BURNED: 2,
  SMASHED: 3,
  CUT: 4,
};

const damageIndexKeys = Object.keys(damageIndexes);
const damageIndexValues = Object.values(damageIndexes);

export function lookupDamageIndex(index) {
  return damageIndexKeys[damageIndexValues.indexOf(index)];
}
