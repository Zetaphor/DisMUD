import { defineComponent, Types } from "bitecs";

// Used to indicate Player characters
export const Stats = defineComponent({
  str: Types.i32,
  dex: Types.i32,
  con: Types.i32,
  int: Types.i32,
  wis: Types.i32,
  cha: Types.i32,
  ac: Types.i32,
  mana: Types.i32,
});

export default Stats;
