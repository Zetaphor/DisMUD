import { defineComponent, Types } from "bitecs";

// Used with the Age component in the Aging system
export const Mortal = defineComponent({
  enabled: Types.ui8,
});

export default Mortal;
