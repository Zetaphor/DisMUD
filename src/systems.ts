import initMovementSystem from "./systems/Movement";
import initTimeSystem from "./systems/Time";

export function initSystems(world) {
  return {
    movement: initMovementSystem(world),
    time: initTimeSystem(world),
  };
}
