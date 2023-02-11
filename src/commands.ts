import goto from "./commands/admin/goto";
import loadItem from "./commands/admin/loadItem";
import loadMob from "./commands/admin/loadMob";
import balance from "./commands/balance";
import drop from "./commands/drop";
import emote from "./commands/emote";
import examine from "./commands/examine";
import exits from "./commands/exits";
import gold from "./commands/gold";
import info from "./commands/info";
import inventory from "./commands/inventory";
import listCommands from "./commands/listCommands";
import look from "./commands/look";
import motd from "./commands/motd";
import move from "./commands/move";
import news from "./commands/news";
import policy from "./commands/policy";
import say from "./commands/say";
import take from "./commands/take";
import who from "./commands/who";

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
  look,
  examine,
  gold,
  balance,
  drop,
  take,
  who,
};

export const adminCommands = {
  loaditem: loadItem,
  loadmob: loadMob,
  goto,
};

export const commandAliases = {
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

  get: take,
  online: who,
};

export const adminCommandList = Object.keys(adminCommands);
export const commandList = Object.keys(commands);
export const aliasList = Object.keys(commandAliases);

export const adminCommandWords = Object.keys(adminCommands).map((item) => item.toLowerCase());
export const commandWords = Object.keys(commands).map((item) => item.toLowerCase());
export const aliasWords = Object.keys(commandAliases).map((item) => item.toLowerCase());
