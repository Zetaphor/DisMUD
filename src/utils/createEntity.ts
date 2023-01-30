import { addComponent, addEntity, removeEntity } from "bitecs";

export function createEntity(world, type, components) {
  const entityDefinition = world["_entities"][type];

  // Validate the total components in the entity definition versus the component data
  if (entityDefinition.components.length !== Object.keys(components).length) {
    console.error(
      `Definition: ${entityDefinition.components}\nInput: ${Object.keys(
        components
      )}\n`
    );
    throw new Error(
      `${type} component mismatch, expected ${
        entityDefinition.components.length
      } components, but got ${Object.keys(components).length}`
    );
  }

  const eid = addEntity(world);

  // Iterate through each component provided to the createEntity function
  for (const [component, data] of Object.entries(components)) {
    // Validate that the component is present in the definition
    if (entityDefinition.components.indexOf(component) === -1) {
      removeEntity(world, eid);
      throw new Error(`${type} unknown component: ${component}`);
    }

    addComponent(world, world._components[component], eid);

    const componentDefinition = Object.keys(world._components[component]);

    // Validate the total properties of the component definition against the component data
    if (componentDefinition.length !== Object.keys(data).length) {
      removeEntity(world, eid);
      console.error(
        `Definition: ${componentDefinition}\nInput: ${Object.keys(data)}\n`
      );
      throw new Error(
        `${type} ${component} component mismatch, expected ${
          componentDefinition.length
        } properties, but got ${Object.keys(data).length}`
      );
    }

    // // Iterate each provided property and set it on the component
    for (const [property, value] of Object.entries(data)) {
      // Validate that the property is present in the definition
      if (componentDefinition.indexOf(property) === -1) {
        removeEntity(world, eid);
        throw new Error(
          `${type} unknown ${component} component property: ${property}`
        );
      }

      // Set the property on the component
      world._components[component][property][eid] = value;
    }
  }

  return eid;
}

export default createEntity;
