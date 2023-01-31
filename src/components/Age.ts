import { defineComponent, Types } from "bitecs";

// Used with the durability component when durability reaches zero
// After being processed when enabled, adds the Destroyed component
export const Age = defineComponent({
  val: Types.ui16,
  max: Types.ui16,
  adultAge: Types.ui16,
  destroyAtMax: Types.ui8,
  tickRate: Types.ui16, // How many ticks before increasing age
  lastTick: Types.ui32,
});

export default Age;
