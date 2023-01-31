export const scaleIndexes = {
  TINY: 1,
  SMALL: 2,
  MEDIUM: 3,
  LARGE: 4,
  HUGE: 5,
};

const scaleIndexKeys = Object.keys(scaleIndexes);
const scaleIndexValues = Object.values(scaleIndexes);

export function lookupScaleIndex(index) {
  return scaleIndexKeys[scaleIndexValues.indexOf(index)];
}
