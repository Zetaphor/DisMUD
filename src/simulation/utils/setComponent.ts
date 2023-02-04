import { addComponent } from "bitecs";

export function setComponentProperty(world, type, eid, component, property, value) {
  const componentDefinition = Object.keys(world._components[component]);

  if (componentDefinition.indexOf(property) === -1) {
    throw new Error(`${type}: Component "${component}" does not have property "${property}"`);
  }

  world._components[component][property][eid] = value;
}

export function setComponentValue(world, type, eid, component, data) {
  const componentDefinition = Object.keys(world._components[component]);

  // Validate the total properties of the component definition against the component data
  if (componentDefinition.length !== Object.keys(data).length) {
    console.error(`Definition: ${componentDefinition}\nInput: ${Object.keys(data)}\n`);
    throw new Error(
      `${type} ${component} component mismatch, expected ${componentDefinition.length} properties, but got ${
        Object.keys(data).length
      }`
    );
  }

  // // Iterate each provided property and set it on the component
  for (const [property, value] of Object.entries(data)) {
    // Validate that the property is present in the definition
    if (componentDefinition.indexOf(property) === -1) {
      throw new Error(`${type} unknown ${component} component property: ${property}`);
    }

    // Set the property on the component
    world._components[component][property][eid] = value;
  }
}

export function addComponentWithValue(world, type, eid, component, data) {
  addComponent(world, world["_components"][component], eid);
  setComponentValue(world, type, eid, component, data);
}

export function addComponentWithProperty(world, type, eid, component, property, value) {
  addComponent(world, world["_components"][component], eid);
  setComponentProperty(world, type, eid, component, property, value);
}
