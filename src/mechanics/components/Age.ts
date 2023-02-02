import { defineComponent, Types } from "bitecs";

// Used with the Mortal component in the Mortality system.
// When Mortal enabled and below min, destroy entity
export const Age = defineComponent({
  val: Types.ui16,
  max: Types.ui16,
  adultAge: Types.ui16,
  tickRate: Types.ui16, // How many ticks before increasing age
  lastTick: Types.ui32,
});

export default Age;
