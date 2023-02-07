import loadItem from "./commands/admin/loadItem";
import emote from "./commands/emote";
import exits from "./commands/exits";
import info from "./commands/info";
import inventory from "./commands/inventory";
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
  inventory,
};

export const adminCommands = {
  loaditem: loadItem,
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

export const adminCommandList = Object.keys(adminCommands);
export const commandList = Object.keys(commands);
export const aliasList = Object.keys(commandAliases);

export const adminCommandWords = Object.keys(adminCommands).map((item) => item.toLowerCase());
export const commandWords = Object.keys(commands).map((item) => item.toLowerCase());
export const aliasWords = Object.keys(commandAliases).map((item) => item.toLowerCase());
