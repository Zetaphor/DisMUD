// Returns an array of rooms from a wld text file.
export default function parseRoomsFromWld(text) {
  const contents = text.split(/\n(?=#\d+\s*\n)/);
  return contents;
}
