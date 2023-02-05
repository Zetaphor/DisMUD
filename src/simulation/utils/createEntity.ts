import { addEntity, removeEntity } from "bitecs";
import { addComponentWithValue } from "./setComponent";

/**
 * Creates a new entity and adds components to it.
 * @param {Object} world - The world object that the entity is being created in.
 * @param {string} type - The type of entity that is being created.
 * @param {Object} componentsData - An object containing the data for the components that the entity will have.
 *
 * @throws {Error} If the entity type does not exist in the world.
 * @throws {Error} If a required component was not found in the `componentsData` object.
 *
 * @returns {number} The entity ID (eid) of the newly created entity.
 */
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

    addComponentWithValue(world, type, eid, component, componentsData[component]);
    addedComponents.push(component);
  }

  let remainingComponents = componentsDataKeys.filter((item) => !addedComponents.includes(item));

  for (let i = 0; i < remainingComponents.length; i++) {
    console.log(`${type} adding optional component ${remainingComponents[i]}`);
    addComponentWithValue(world, type, eid, remainingComponents[i], componentsData[remainingComponents[i]]);
  }

  return eid;
}

export default createEntity;
