// Returns an array of mobs from a mob text file.
export default function parseObjsFromObj(text) {
  const contents = text.split(/\n(?=#\d+\s*\n)/);
  return contents;
}
