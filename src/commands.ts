import giveGold from "./commands/admin/giveGold";
import goto from "./commands/admin/goto";
import loadItem from "./commands/admin/loadItem";
import loadMob from "./commands/admin/loadMob";
import balance from "./commands/balance";
import drop from "./commands/drop";
import emote from "./commands/emote";
import examine from "./commands/examine";
import exits from "./commands/exits";
import give from "./commands/give";
import gold from "./commands/gold";
import info from "./commands/info";
import inventory from "./commands/inventory";
import listCommands from "./commands/listCommands";
import look from "./commands/look";
import motd from "./commands/motd";
import move from "./commands/move";
import news from "./commands/news";
import policy from "./commands/policy";
import save from "./commands/save";
import say from "./commands/say";
import take from "./commands/take";
import time from "./commands/time";
import who from "./commands/who";
import wear from "./commands/wear";
import remove from "./commands/remove";
import equipment from "./commands/equipment";
import score from "./commands/score";
import follow from "./commands/follow";
import unfollow from "./commands/unfollow";
import mobFollow from "./commands/admin/mobFollow";
import debug from "./commands/admin/debug";
import mobUnfollow from "./commands/admin/mobUnfollow";
import force from "./commands/admin/force";
import help from "./commands/help";
import drink from "./commands/drink";
import fill from "./commands/fill";
import pour from "./commands/pour";
import junk from "./commands/junk";
import donate from "./commands/donate";
import debugExits from "./commands/admin/debugExits";
import open from "./commands/open";
import close from "./commands/close";
import toggle from "./commands/toggle";
import debugUser from "./commands/admin/debugUser";
import auctionChat from "./commands/auctionChat";
import globalChat from "./commands/globalChat";
import shout from "./commands/shout";
import tell from "./commands/tell";

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
  time,
  give,
  save,
  wear,
  remove,
  equipment,
  score,
  follow,
  unfollow,
  help,
  drink,
  fill,
  pour,
  junk,
  donate,
  open,
  close,
  toggle,
  auction: auctionChat,
  global: globalChat,
  shout,
  tell,
};

export const adminCommands = {
  loaditem: loadItem,
  loadmob: loadMob,
  goto,
  givegold: giveGold,
  mobfollow: mobFollow,
  mobunfollow: mobUnfollow,
  debug,
  force,
  debugexits: debugExits,
  debuguser: debugUser,
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
  sip: drink,
  rules: policy,
  whisper: tell,
};

export const adminCommandList = Object.keys(adminCommands);
export const commandList = Object.keys(commands);
export const aliasList = Object.keys(commandAliases);

export const adminCommandWords = Object.keys(adminCommands).map((item) => item.toLowerCase());
export const commandWords = Object.keys(commands).map((item) => item.toLowerCase());
export const aliasWords = Object.keys(commandAliases).map((item) => item.toLowerCase());
