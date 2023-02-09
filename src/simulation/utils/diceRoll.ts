export default function diceRoll(diceString) {
  const [rolls, sides, modifier] = diceString
    .match(/^(\d+)d(\d+)([+-]\d+)?$/)
    .slice(1)
    .map((x) => (x ? parseInt(x) : 0));
  let result = modifier || 0;
  for (let i = 0; i < rolls; i++) {
    result += Math.floor(Math.random() * sides) + 1;
  }
  return result;
}
