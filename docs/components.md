## Components

### Player

Indicates if an entity is a player

### Breakable

Used in the Breaking system. Can be disabled. Contains damageIndex to indicate damage type that resulted in breaking

### Burning

Used in the Burning system. Can be disabled. Can be used with or without Flammable

### Damage

Used in the Damage system to represet damage to apply to an entity. Uses Uint3

### DeathDrops

Contains a drop index and a quantity. Handled by the Destroying system

### Destroyed

Marks an object for removal from the Destroying system

### Durability

Used in the Breaking and Damaging systems. If Breakable, destroy entity when below min

### Flammable

Can be disabled. Used in the Burning system to apply damage property

### Health

Used in the Damaging and Mortality systems. If killable, destroy entity when below min

### Mortal

Can be disabled. Used in the Aging system to determine if entity dies from old age

### Killable

Can be disabled. Used in the Mortality system to determine if entity should be destroyed when Health below min

### Position

Stores the current roomNum

### Scale

Uses the scaleIndex

### Velocity

Uses Vector2
