import type { User } from "discord.js";

export interface WorldState {
  db: DatabaseCollection;
  players: typeof import("../state/players").players;
  simulation: typeof import("../simulation/world").simulation;
  timedStateFunctions: typeof import("../state/timedStateFunctions").timedStateFunctions;
  inventories: typeof import("../state/inventories").inventories;
  items: typeof import("../state/items").items;
  rooms: typeof import("../state/rooms").rooms;
  mobs: typeof import("../state/mobs").mobs;
  zones: typeof import("../state/zones").zones;
  broadcasts: typeof import("../state/broadcasts").broadcasts;
  utils: {
    containsBannedWord: (word: string) => boolean;
    stripString: (str: string) => string;
    capitalizeFirst: (str: string) => string;
  };
}

export interface DatabaseModule {
  conn: any;
  methods: Record<string, (...args: any[]) => any>;
}

export interface DatabaseCollection {
  init: () => boolean;
  close: () => void;
  players?: DatabaseModule;
  playerInventories?: DatabaseModule;
  mobs?: DatabaseModule;
  items?: DatabaseModule;
  rooms?: DatabaseModule;
  zones?: DatabaseModule;
  [key: string]: any;
}

export interface UserPrefs {
  localRepeat: boolean;
  hearTell: boolean;
  hearShout: boolean;
  chanGlobal: boolean;
  chanAuction: boolean;
  roomBrief: boolean;
  autoExits: boolean;
  follow: boolean;
  discordId: boolean;
}

export interface UserData {
  id: number;
  discordId: string;
  discordUsername: string;
  displayName: string;
  roomNum: number;
  gold: number;
  bank: number;
  equipment: Record<string, EquipmentSlot>;
  simulationData: string;
  userPrefs: UserPrefs;
  className: string;
  admin: boolean;
  enabled: boolean;
  eid: number;
  user: User;
  newPlayer: boolean;
  followers: Record<number, FollowerEntry>;
  following: number | null;
  followingPlayer: boolean;
  followingName: string;
  sendMessage: (user: User, message: string) => void;
}

export interface EquipmentSlot {
  position: number;
  data: ItemData;
}

export interface FollowerEntry {
  eid: number;
  player: boolean;
}

export interface RoomData {
  id: number;
  name: string;
  desc: string;
  exits: Record<string, RoomExit>;
  sectorType?: number;
}

export interface RoomExit {
  roomId: number;
  desc: string;
  tags: string[];
  doorFlag?: number;
  keyNum?: number;
}

export interface MobData {
  id: number;
  shortDesc: string;
  longDesc: string;
  detailedDesc: string;
  aliases: string[];
  maxHP: string;
  bareHandDamage: string;
  alignment: number;
  level: number;
  armorClass: number;
  xp: number;
  gold: number;
  gender: number;
  loadPosition: number;
  defaultPosition: number;
  actionBitVector: number;
  items: Record<number, { qty: number; data: ItemData }>;
  equipment: Record<number, EquipmentSlot>;
  followers: Record<number, FollowerEntry>;
  following: number | null;
  followingPlayer: boolean;
  followingName: string;
}

export interface ItemData {
  id: number;
  shortDesc: string;
  longDesc: string;
  aliases: string[];
  type: number;
  values: number[];
  stateData: Record<string, any>;
}

export type CommandHandler = (worldState: WorldState, userData: UserData, words: string[]) => void | Promise<void>;
