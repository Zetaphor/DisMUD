import { pipe } from "bitecs";
import initAgingSystem from "../systems/Aging";
import initBreakingSystem from "../systems/Breaking";
import initBurningSystem from "../systems/Burning";
import initDamagingSystem from "../systems/Damaging";
import initDestroyingSystem from "../systems/Destroying";
import initMortalitySystem from "../systems/Mortality";
import initMovementSystem from "../systems/Movement";
import initTimeSystem from "../systems/Time";

export function initSystems(world) {
  return [
    initTimeSystem(world),
    initDestroyingSystem(),
    initAgingSystem(),
    initMortalitySystem(),
    initDamagingSystem(),
    initBreakingSystem(),
    initBurningSystem(),
    initMovementSystem(),
  ];
}

export function startPipeline(systems) {
  return pipe(...systems);
}