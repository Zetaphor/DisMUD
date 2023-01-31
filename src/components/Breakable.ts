import { defineComponent, Types } from "bitecs";

// Used with the durability component when durability reaches zero
// After being processed when enabled, adds the Destroyed component
export const Breakable = defineComponent({
  enabled: Types.ui8,
  damageIndex: Types.ui16, // Found in damageIndexes
});

export default Breakable;
