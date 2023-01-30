import { defineComponent, Types } from "bitecs";

// Used with the Health component when health reaches zero
export const Mortal = defineComponent({
  enabled: Types.ui8,
});

export default Mortal;
