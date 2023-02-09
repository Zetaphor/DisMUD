import { defineComponent, Types } from "bitecs";

// Used to define an entities stats
export const Stats = defineComponent({
  alignment: Types.i32,
  ac: Types.i32,
  level: Types.i32,
  exp: Types.i32,
  gold: Types.i32,
  state: Types.i8,
  loadState: Types.i8,
  defaultState: Types.i8,
  gender: Types.i8,
  attackDamange: Types.i32,
});

export default Stats;
