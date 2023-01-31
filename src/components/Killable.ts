import { defineComponent, Types } from "bitecs";

// Used with the Health component in the Mortality system.
// When health below min and enabled, destroy entity
export const Killable = defineComponent({
  enabled: Types.ui8,
});

export default Killable;
