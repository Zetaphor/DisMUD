const DIRECTIONS: Record<string, string> = {
  n: "north",
  north: "north",
  s: "south",
  south: "south",
  e: "east",
  east: "east",
  w: "west",
  west: "west",
  u: "up",
  up: "up",
  d: "down",
  down: "down",
};

export function resolveDirection(input: string): string | null {
  return DIRECTIONS[input.toLowerCase()] || null;
}

export default DIRECTIONS;
