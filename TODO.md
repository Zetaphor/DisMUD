- Separate out circlemud parser into its own project for release
- Figure out emoji to use for the location types
- Maybe later start caching rooms in memory so I'm not pulling it again for direction movements and look/examine commands
- Add a player aliases database, allow player to specify alias like "emote ${1}" or "example ${1} ${2}"
- Implement examine room extra descriptors
- Implement extra fields in examine
- Refactor health to use Stats component instead
- Refactor health/death to not remove entity on death and instead add corpse tag. This will allow me to use the 0 "dead" state with strings and keep the mob/player data around
- Replace object descriptors in examine with docs/objectModifiers.txt
- Add admin stat command to see details stats and inventory on player/mob/object
- Implement remaining mob action bitvectors
- Implement object bitvectors, like disabling drop for cursed items
- Implement weight for bags/inventory
- Implement logging
- Lowercase all the command inputs (What? I think I'm already doing this?)
- Figure out what in Circlemud lets you look into another persons inventory
- Implement ability to give gold to other players (non-admin) and to drop gold as an item (Look into item values, type flag 20)
- Check for wear_take in the get command
- Use ChatGPT to fill in missing actionDescs
- Show aliases in examine command
- Apply object modifers on equip
- Implement the sentinel flag in mob movement
- Split up commands list to show categories
- Implement movement point drain, needs to be based on areas
- Implement movement point recovery based on time/position
- Implement drinking liquids affecting drunk/thirst

## Commands

### Read commands.hlp for more info on each

! - Repeat last command
alias, aliases
eat, taste
grab, hold
lock, unlock
pick - pick locks
quaff - Drink potion
recite - Recite scroll
track
use - Use a wand or staff
wake, rest, sleep, sit, stand
where
wield

### Combat

kick
kill, hit - Start attacking
backstab - Attack
bash - Attack
consider - Determine if you can attack
diagnose - Check wounds
murder - Kill but only PVP
assist - Start attacking something someone else is attacking
flee - Exit battle
wimpy
