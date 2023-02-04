import { defineComponent, Types } from "bitecs";

// Uses the burning and durability components in the Burning system
export const Flammable = defineComponent({
  enabled: Types.ui8,
  causesDamage: Types.ui8,
  damage: Types.ui16,
});

export default Flammable;
