export const scaleIndexes = {
  TINY: 0,
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
  HUGE: 4,
};

const scaleIndexKeys = Object.keys(scaleIndexes);
const scaleIndexValues = Object.values(scaleIndexes);

export function lookupScaleIndex(index) {
  return scaleIndexKeys[scaleIndexValues.indexOf(index)];
}
