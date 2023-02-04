import { defineComponent, Types } from "bitecs";

// Used to indicate Player characters
export const Player = defineComponent({
  id: Types.ui32,
});

export default Player;
