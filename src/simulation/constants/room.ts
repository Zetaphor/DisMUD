export const roomConstants = {
  DOOR_FLAGS: {
    OPEN: 0, // An unrestricted exit that has no door, or a special door cannot be opened or closed with the ``open'' and ``close'' commands. The latter is useful for secret doors, trap doors, or other doors that are opened and closed by something other than the normal commands, like a special procedure assigned to the room or an object in the room.
    NORMAL: 1, // Normal doors that can be opened, closed, locked, unlocked, and picked.
    PICKPROOF: 2, // Pickproof doors: if locked, can be opened only with the key.
  },

  DOOR_STATES: {
    0: "open",
    1: "closed",
    2: "locked",
  },

  DOOR_DIRS: {
    0: "north",
    1: "east",
    2: "south",
    3: "west",
    4: "up",
    5: "down",
  },

  ROOM_BITVECTORS: {
    DARK: "a", // Room is dark.
    DEATH: "b", // Room is a death trap; char dies (no xp lost).
    NOMOB: "c", // MOBs (monsters) cannot enter room.
    INDOORS: "d", // Room is indoors.
    PEACEFUL: "e", // Room is peaceful (violence not allowed).
    SOUNDPROOF: "f", // Shouts, gossips, etc. won't be heard in room.
    NOTRACK: "g", // track can't find a path through this room.
    NOMAGIC: "h", // All magic attempted in this room will fail.
    TUNNEL: "i", // Only one person allowed in room at a time.
    PRIVATE: "j", // Cannot teleport in or GOTO if two people here.
    GODROOM: "k", // Only LVL_GOD and above allowed to enter.
    HOUSE: "l", // Reserved for internal use.  Do not set.
    HOUSE_CRASH: "m", // Reserved for internal use.  Do not set.
    ATRIUM: "n", // Reserved for internal use.  Do not set.
    OLC: "o", // Reserved for internal use.  Do not set.
    BFS_MARK: "p", // Reserved for internal use.  Do not set.
  },

  SECTOR_TYPES: {
    INSIDE: 0, // Indoors (small number of move points needed).
    CITY: 1, // The streets of a city.
    FIELD: 2, // An open field.
    FOREST: 3, // A dense forest.
    HILLS: 4, // Low foothills.
    MOUNTAIN: 5, // Steep mountain regions.
    WATER_SWIM: 6, // Water (swimmable).
    WATER_NOSWIM: 7, // Unswimmable water - boat required for passage.
    UNDERWATER: 8, // Underwater.
    FLYING: 9, // Wheee!
  },
};

export default roomConstants;
