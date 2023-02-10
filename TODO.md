- SQLite can read from JSON data, store all of the world files into SQLite databases and use the functions to query them
  https://www.sqlite.org/json1.html
- Separate out circlemud parser into its own project for release
- Figure out emoji to use for the location types
- Maybe later start caching rooms in memory so I'm not pulling it again for direction movements and look/examine commands
- Add a player aliases database, allow player to specify alias like "emote ${1}" or "example ${1} ${2}"
- Implement examine objects and mobs in room, room extra descriptors
- Implement extra fields in examine
- Refactor health to use Stats component instead
- Refactor health/death to not remove entity on death and instead add corpse tag. This will allow me to use the 0 "dead" state with strings and keep the mob/player data around
- Replace object descriptors in examine with docs/objectModifiers.txt
- Add admin stat command to see details stats on player/mob/object
- Implement remaining mob action bitvectors
- Implement object bitvectors, like disabling drop for cursed items

## Commands

### Read commands.hlp for more info on each

! - Repeat last command
alias, aliases
assist - Start attacking something someone else is attacking
auction, grats, gossip noauction, nogossip, nograts - Global channels
autoexit - Toggles showing exits
backstab - Attack
bash - Attack
brief - Only show room name and occupants/items
consider - Determine if you can attack
diagnose - Check wounds
donate - Donate items to donation room
eat, drink, sip, taste
equipment - Show equipment
fill - Fill container
flee - Exit battle
follow - Follow someone
get, take
give
grab, hold
kick
kill, hit - Start attacking
murder - Kill but only PVP
norepeat - Don't echo communication
noshout - Don't hear shouts
notell - Ignore tells
open, close, lock, unlock
pick - pick locks
pour
quaff - Drink potion
recite - Recite scroll
save
score - Show your stats
time
track
use - Use a wand or staff
wake, rest, sleep, sit, stand
wear
where
who, online
wield
wimpy
