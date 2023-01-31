## Systems

### Breaking

Check the durability of an entity with the Breakable component, if the durability is at min, add the Destroyed component

### Burning

If an has the Burning component, as well as the Flammable component, with causesDamage enabled, apply the Damage component. Set the damageIndex to BURNING

### Damaging

Reduce current value of either the Durability or the Health component

### Destroying

If the deathDrops component is present, create the dropped entities. Remove the component

### Movement

### Time

Handle time and track total ticks
