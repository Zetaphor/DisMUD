import { pipe } from "bitecs";
import initMovementSystem from "./systems/Movement";
import initTimeSystem from "./systems/Time";

export function initSystems(world) {
  return [initTimeSystem(world), initMovementSystem()];
}

export function startPipeline(systems) {
  return pipe(...systems);
}
