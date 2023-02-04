## Systems

### Breaking

Check the durability of an entity with the Breakable component, if the durability is at min, add the Destroyed component

### Burning

If an has the Burning component, as well as the Flammable component, with causesDamage enabled, apply the Damage component. Set the damageIndex to BURNING

### Damaging

Reduce current value of either the Durability or the Health component

### Aging

Ages the entity every tickRate interval. Checks to see if the entity has the Mortal component enabled, if so and above maxAge, destroy entity

### Mortality

Checks to see if the entity has the Killable component and if health is below min, if so destroys the entity

### Destroying

If the deathDrops component is present, create the dropped entities. Remove the component

### Time

Handle time and track total ticks
