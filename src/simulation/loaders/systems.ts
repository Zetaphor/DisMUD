import { pipe } from "bitecs";
import initAgingSystem from "../systems/Aging";
import initBreakingSystem from "../systems/Breaking";
import initBurningSystem from "../systems/Burning";
import initDamagingSystem from "../systems/Damaging";
import initDestroyingSystem from "../systems/Destroying";
import initMortalitySystem from "../systems/Mortality";
import initTimeSystem from "../systems/Time";
import initWanderingSystem from "../systems/Wandering";

export function initSystems(world) {
  return [
    initTimeSystem(world),
    initWanderingSystem(),
    initDestroyingSystem(),
    initAgingSystem(),
    initMortalitySystem(),
    initDamagingSystem(),
    initBreakingSystem(),
    initBurningSystem(),
  ];
}

export function startPipeline(systems) {
  return pipe(...systems);
}
