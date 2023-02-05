import move from "../commands/move";
import say from "../commands/say";

export const commands = {
  say,
  move,
};

export const commandAliases = {
  t: say,
  m: move,
  n: move,
  north: move,
  e: move,
  east: move,
  s: move,
  south: move,
  w: move,
  west: move,
  u: move,
  up: move,
  d: move,
  down: move,
  go: move,
};
