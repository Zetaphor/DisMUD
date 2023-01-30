import { defineComponent, Types } from "bitecs";

// Used with the flammable and damage component in the Burning system
export const Burning = defineComponent({
  enabled: Types.ui8,
});

export default Burning;
