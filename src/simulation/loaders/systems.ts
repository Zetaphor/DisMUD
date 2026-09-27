import { pipe } from "bitecs";
import initAgingSystem from "../systems/Aging";
import initBreakingSystem from "../systems/Breaking";
import initBurningSystem from "../systems/Burning";
import initDamagingSystem from "../systems/Damaging";
import initDestroyingSystem from "../systems/Destroying";
import initHungeringSystem from "../systems/Hungering";
import initMortalitySystem from "../systems/Mortality";
import initThirstingSystem from "../systems/Thirsting";
import initTimeSystem from "../systems/Time";
import initWanderingSystem from "../systems/Wandering";
import initInteractionProcessingSystem from "../systems/InteractionProcessing";
import initAgentPlanningSystem from "../systems/AgentPlanning";
import initAgentTaskExecutionSystem from "../systems/AgentTaskExecution";

export function initSystems(world) {
  return [
    initTimeSystem(world),
    initWanderingSystem(),
    initInteractionProcessingSystem(),
    initAgentPlanningSystem(),
    initAgentTaskExecutionSystem(),
    initDestroyingSystem(),
    initAgingSystem(),
    initMortalitySystem(),
    initDamagingSystem(),
    initBreakingSystem(),
    initBurningSystem(),
    initHungeringSystem(),
    initThirstingSystem(),
  ];
}

export function startPipeline(systems) {
  return pipe(...systems);
}
