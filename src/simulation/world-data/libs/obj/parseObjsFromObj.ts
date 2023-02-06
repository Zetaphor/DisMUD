// Returns an array of mobs from a mob text file.
export default function parseObjsFromObj(text) {
  const startDelimiter = "#[0-9]+\n";
  let startDelimiterRegex = new RegExp(startDelimiter, "g");
  let startIndices = [];
  let match;
  while ((match = startDelimiterRegex.exec(text)) !== null) {
    startIndices.push(match.index);
  }

  let contents = [];
  for (let i = 0; i < startIndices.length; i++) {
    let startIndex = startIndices[i];
    if (startIndex === -1) {
      continue;
    }
    let endIndex = startIndices[i + 1];
    if (typeof endIndex === "undefined") {
      endIndex = text.length;
    }
    contents.push(text.substring(startIndex, endIndex));
  }

  // console.log(contents);

  return contents;
}
