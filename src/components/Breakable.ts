import { defineComponent, Types } from "bitecs";

// Used with the durability component when durability reaches zero
export const Breakable = defineComponent({
  enabled: Types.ui8,
});

export default Breakable;
