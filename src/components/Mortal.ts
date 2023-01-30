import { defineComponent } from "bitecs";

// Used with the Health component when health reaches zero
export const Mortal = defineComponent({
  enabled: Boolean,
});

export default Mortal;
