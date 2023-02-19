import { defineQuery } from "bitecs";
import globalConstants from "../constants/global";

let Wander,
  wanderQuery = null;

const wanderingSystem = (world) => {
  // Only execute on the moveTickRate
  if (wanderQuery === null) {
    Wander = world._components["wander"];
    wanderQuery = defineQuery([Wander]);
  }

  const ents = wanderQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    if (Wander.enabled[eid] === globalConstants.TRUE && Wander.pending[eid] === globalConstants.FALSE) {
      if (Number(world.time.ticks) - Wander.lastTick[eid] >= world.time.moveTickRate) {
        if (Math.random() <= 0.75) {
          // This flag is handled in the mobMovement state system
          Wander.pending[eid] = globalConstants.TRUE;
        }
      }
    }
  }
  return world;
};

export default function initWanderingSystem() {
  return wanderingSystem;
}
