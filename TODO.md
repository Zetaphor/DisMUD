- SQLite can read from JSON data, store all of the world files into SQLite databases and use the functions to query them
  https://www.sqlite.org/json1.html
- Separate out circlemud parser into its own project for release
- Figure out emoji to use for the location types
- Maybe later start caching rooms in memory so I'm not pulling it again for direction movements and look/examine commands
- Add a player aliases database, allow player to specify alias like "emote ${1}" or "example ${1} ${2}"
- Implement look at objects in room, examine objects and mobs in room
