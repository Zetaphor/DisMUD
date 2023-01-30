export function setComponentProperty(world, eid, component, property, value) {
  const componentDefinition = Object.keys(world._components[component]);

  if (componentDefinition.indexOf(property) === -1) {
    throw new Error(
      `Component "${component}" does not have property "${property}"`
    );
  }

  world._components[component][property][eid] = value;
}

export function setComponentValue(world, eid, component, data) {
  const componentDefinition = Object.keys(world._components[component]);

  // Validate the total properties of the component definition against the component data
  if (componentDefinition.length !== Object.keys(data).length) {
    throw new Error(
      `${component} component mismatch, expected ${
        componentDefinition.length
      } properties, but got ${Object.keys(data).length}`
    );
  }

  // // Iterate each provided property and set it on the component
  for (const [property, value] of Object.entries(data)) {
    // Validate that the property is present in the definition
    if (componentDefinition.indexOf(property) === -1) {
      throw new Error(
        `${component} unknown ${component} component property: ${property}`
      );
    }

    // Set the property on the component
    world._components[component][property][eid] = value;
  }
}
