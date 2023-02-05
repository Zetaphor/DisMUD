import { addComponent } from "bitecs";

/**
 * Sets a property value on a component of an entity in the world
 * @param {object} world - The world object
 * @param {string} type - The type of the entity
 * @param {string} eid - The entity ID
 * @param {string} component - The name of the component
 * @param {string} property - The name of the property
 * @param {*} value - The value of the property
 *
 * @throws {Error} If the component does not have the specified property
 */
export function setComponentProperty(world, type, eid, component, property, value) {
  const componentDefinition = Object.keys(world._components[component]);

  if (componentDefinition.indexOf(property) === -1) {
    throw new Error(`${type}: Component "${component}" does not have property "${property}"`);
  }

  world._components[component][property][eid] = value;
}

/**
 * Sets the values of multiple properties on a component of an entity in the world
 * @param {object} world - The world object
 * @param {string} type - The type of the entity
 * @param {string} eid - The entity ID
 * @param {string} component - The name of the component
 * @param {object} data - An object representing the data to set on the component
 *
 * @throws {Error} If the total properties of the component definition do not match the properties in the data
 * @throws {Error} If the data contains properties not present in the component definition
 */
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

/**
 * Adds a component to an entity with a specified value
 * @param {Object} world - The world object
 * @param {String} type - The type of entity
 * @param {Number} eid - The entity ID
 * @param {String} component - The component to be added
 * @param {Any} data - The value to set for the component
 */
export function addComponentWithValue(world, type, eid, component, data) {
  addComponent(world, world["_components"][component], eid);
  setComponentValue(world, type, eid, component, data);
}

/**
 *  Adds a component to an entity with a specified property
 * @param {Object} world - The world object
 * @param {String} type - The type of entity
 * @param {Number} eid - The entity ID
 * @param {String} component - The component to be added
 * @param {String} property - The property to set for the component
 * @param {Any} value - The value to set for the specified property
 */
export function addComponentWithProperty(world, type, eid, component, property, value) {
  addComponent(world, world["_components"][component], eid);
  setComponentProperty(world, type, eid, component, property, value);
}
