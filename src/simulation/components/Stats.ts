import { defineComponent, Types } from "bitecs";

// Used to define an entities stats
export const Stats = defineComponent({
  str: Types.i32,
  strMod: Types.i32,
  dex: Types.i32,
  dexMod: Types.i32,
  con: Types.i32,
  conMod: Types.i32,
  int: Types.i32,
  intMod: Types.i32,
  wis: Types.i32,
  wisMod: Types.i32,
  cha: Types.i32,
  chaMod: Types.i32,
  ac: Types.i32,
  acMod: Types.i32,
  mana: Types.i32,
  manaMax: Types.i32,
  manaMod: Types.i32,
  move: Types.i32,
  moveMax: Types.i32,
  moveMod: Types.i32,
  hitRoll: Types.i32,
  damRoll: Types.i32,
  savingHit: Types.i32,
  savingSpell: Types.i32,
  hp: Types.i32,
  hpMax: Types.i32,
  hpMod: Types.i32,
});

export default Stats;
