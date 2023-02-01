export default function parseRoomsFromWld(text) {
  const startDelimiter = "#[0-9]+\n";
  const endDelimiter = "S\n";
  let startDelimiterRegex = new RegExp(startDelimiter, "g");
  let startIndices = [];
  let match;
  while ((match = startDelimiterRegex.exec(text)) !== null) {
    startIndices.push(match.index);
  }

  let endDelimiterRegex = new RegExp(endDelimiter, "g");
  let endIndices = [];
  while ((match = endDelimiterRegex.exec(text)) !== null) {
    endIndices.push(match.index);
  }

  let contents = [];
  for (let i = 0; i < startIndices.length; i++) {
    let startIndex = startIndices[i];
    let endIndex = endIndices[i];
    if (startIndex === -1 || endIndex === -1) {
      continue;
    }
    contents.push(text.substring(startIndex, endIndex + endDelimiter.length));
  }

  return contents;
}
