import { createWorld } from "bitecs";
import components from "./components";
import entities from "./entities";
import { initSystems, startPipeline } from "./systems";

export default function setupWorld() {
  const world = createWorld();

  world["_components"] = components;
  world["_entities"] = entities;

  const systems = initSystems(world);

  const pipeline = startPipeline(systems);

  setInterval(function () {
    pipeline(world);
  }, 16);

  return world;
}
