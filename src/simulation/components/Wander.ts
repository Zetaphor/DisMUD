import { defineComponent, Types } from "bitecs";

// Determines if a Mob should wander around
export const Wander = defineComponent({
  enabled: Types.ui8,
  pending: Types.ui8,
  lastTick: Types.ui32,
});

export default Wander;
