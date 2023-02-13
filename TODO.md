- SQLite can read from JSON data, store all of the world files into SQLite databases and use the functions to query them
  https://www.sqlite.org/json1.html
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
- Make sure everything has try/catch to stop server from dying
- Implement logging
- Lowercase all the command inputs
- Figure out what in Circlemud lets you look into another persons inventory
- Implement ability to give gold to other players (non-admin) and to drop gold as an item (Look into item values, type flag 20)
- Check for wear_take in the get command
- Use ChatGPT to fill in missing actionDescs
- Show aliases in examine command
- Apply object modifers on equip
- Add nofollow userpref

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
fill - Fill container
flee - Exit battle
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
track
use - Use a wand or staff
wake, rest, sleep, sit, stand
where
wield
wimpy
