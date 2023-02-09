import { defineComponent, Types } from "bitecs";

// Used with the Mortality component in the Mortality system.
// When Killable enabled and below min, destroy entity
export const Health = defineComponent({
  val: Types.ui16,
  max: Types.ui16,
  damageIndex: Types.ui16,
});

export default Health;
