export const damageIndexes = {
  NONE: 0,
  BURNED: 1,
  SMASHED: 2,
  CUT: 3,
};

const damageIndexKeys = Object.keys(damageIndexes);
const damageIndexValues = Object.values(damageIndexes);

export default function lookupDamageIndex(index) {
  return damageIndexKeys[damageIndexValues.indexOf(index)];
}
