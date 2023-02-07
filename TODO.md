- SQLite can read from JSON data, store all of the world files into SQLite databases and use the functions to query them
  https://www.sqlite.org/json1.html
- Add lastLogin date to players table
- Separate out circlemud parser into its own project for release
- Move mob, world, zone, and object data into their own databases and refactor getData libs
- Figure out emoji to use for the location types
- Maybe later start caching rooms in memory so I'm not pulling it again for direction movements and look/examine commands
- Add a player aliases database, allow player to specify alias like "emote ${1}" or "example ${1} ${2}"
