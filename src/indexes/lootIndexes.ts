const lootIndexes = {
  0: "charcoal",
};

const lootIndexKeys = Object.keys(lootIndexes);
const lootIndexValues = Object.values(lootIndexes);

export default function lookupLootIndex(index) {
  return lootIndexKeys[lootIndexValues.indexOf(index)];
}
