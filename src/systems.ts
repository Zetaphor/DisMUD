import { pipe } from "bitecs";
import initBreakingSystem from "./systems/Breaking";
import initBurningSystem from "./systems/Burning";
import initDamagingSystem from "./systems/Damaging";
import initMovementSystem from "./systems/Movement";
import initTimeSystem from "./systems/Time";

export function initSystems(world) {
  return [
    initTimeSystem(world),
    initMovementSystem(),
    initDamagingSystem(),
    initBreakingSystem(),
    initBurningSystem(),
  ];
}

export function startPipeline(systems) {
  return pipe(...systems);
}
