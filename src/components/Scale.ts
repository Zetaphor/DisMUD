import { defineComponent, Types } from "bitecs";

// Maps a scale to the scaleIndexes
export const Scale = defineComponent({
  scaleIndex: Types.ui8,
});

export default Scale;
