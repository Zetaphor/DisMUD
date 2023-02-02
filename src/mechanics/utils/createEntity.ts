import { addEntity, removeEntity } from "bitecs";
import { addComponentWithValue } from "./setComponent";

export function createEntity(world, type, componentsData) {
  if (typeof world["_entities"][type] === "undefined") {
    throw new Error(`Entity type "${type}" does not exist\n`);
  }

  const entityDefinition = world["_entities"][type];

  const eid = addEntity(world);

  const componentsDataKeys = Object.keys(componentsData);
  let addedComponents = [];

  for (let i = 0; i < entityDefinition.components.length; i++) {
    const component = entityDefinition.components[i];

    // Validate the component from the definition exists in the received data
    if (componentsDataKeys.indexOf(component) === -1) {
      removeEntity(world, eid);
      throw new Error(
        `${type}: required ${component} component was not found in the createEntity data, received ${componentsDataKeys}\n`
      );
    }

    addComponentWithValue(
      world,
      type,
      eid,
      component,
      componentsData[component]
    );
    addedComponents.push(component);
  }

  let remainingComponents = componentsDataKeys.filter(
    (item) => !addedComponents.includes(item)
  );

  for (let i = 0; i < remainingComponents.length; i++) {
    console.log(`${type} adding optional component ${remainingComponents[i]}`);
    addComponentWithValue(
      world,
      type,
      eid,
      remainingComponents[i],
      componentsData[remainingComponents[i]]
    );
  }

  return eid;
}

export default createEntity;
