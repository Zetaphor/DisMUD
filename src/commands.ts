import emote from "./commands/emote";
import exits from "./commands/exits";
import info from "./commands/info";
import listCommands from "./commands/listCommands";
import motd from "./commands/motd";
import move from "./commands/move";
import news from "./commands/news";
import policy from "./commands/policy";
import say from "./commands/say";

export const commands = {
  say,
  move,
  exits,
  commands: listCommands,
  emote,
  info,
  policy,
  news,
  motd,
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
  ex: exits,
  em: emote,
};

export const commandList = Object.keys(commands);
export const aliasList = Object.keys(commandAliases);
