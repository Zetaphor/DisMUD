import { defineComponent, Types } from "bitecs";

// Drops X amount of dropIndex from the dropIndexes
export const DeathDrops = defineComponent({
  dropIndex: Types.ui16,
  qty: Types.ui8,
});

export default DeathDrops;
