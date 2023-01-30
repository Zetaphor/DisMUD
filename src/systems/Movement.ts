import { defineQuery } from "bitecs";

const movementSystem = (world) => {
  const Position = world._components["position"];
  const Velocity = world._components["velocity"];

  const movementQuery = defineQuery([Position, Velocity]);

  const delta = world.time.delta;

  const ents = movementQuery(world);
  for (let i = 0; i < ents.length; i++) {
    const eid = ents[i];
    Position.x[eid] += Velocity.x[eid] * delta;
    Position.y[eid] += Velocity.y[eid] * delta;
  }
  return world;
};

export function initMovementSystem() {
  return movementSystem;
}

export default initMovementSystem;
