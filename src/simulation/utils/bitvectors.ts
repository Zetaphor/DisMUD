export function hasBitvector(bitVector, bitVectorData) {
  for (let i = 0; i < bitVectorData.length; i++) {
    if (bitVector[i] === bitVectorData[i]) return true;
  }
  return false;
}
