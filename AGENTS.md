# AGENTS.md — DisMUD Project Guide

## Project Overview

DisMUD is a Discord-based MUD (Multi-User Dungeon) built with TypeScript, bitECS, and SQLite. It runs as a Discord bot where players interact via text commands. The game simulation uses an Entity Component System (ECS) architecture with a 60fps tick loop.

## Tech Stack

- **TypeScript** (ES2020 target, commonjs modules, `noImplicitAny: false`)
- **bitECS** — High-performance ECS library (`bitecs`)
- **discord.js-light** — Lightweight Discord bot client
- **SQLite3** — Persistent storage via `sqlite3` npm package
- **ts-node** — Runtime TypeScript execution
- **Prettier** — Code formatting (120 char width, 2-space indent, semicolons)

## Architecture

### Layered Design

```
Discord Bot → Command Parser → Command Handlers → ECS World + SQLite DB
```

1. **Bot Layer** (`src/bot/interface.ts`): Wraps discord.js-light, emits `playerMsg` events
2. **Auth Layer** (`src/msgAuthenticated.ts`, `src/msgUnauthenticated.ts`): Routes messages based on player registration
3. **Command Layer** (`src/commands/`): Individual command handlers, registered in `src/commands.ts`
4. **State Layer** (`src/state/`): Runtime state managers for players, mobs, items, rooms, zones
5. **Persistence Layer** (`src/db/`): SQLite database queries
6. **Simulation Layer** (`src/simulation/`): bitECS world with components, systems, entities

### Entry Point

`src/main.ts` orchestrates startup:
1. `simulation.start()` — Creates bitECS world, starts 60fps pipeline
2. `db.init()` — Loads all SQLite databases
3. `zones.loadZones()` — Loads zone data
4. `setupBotInterface()` — Connects Discord bot
5. `timedStateFunctions.setupTimedStateFunctions()` — Sets up periodic tasks
6. Listens for `playerMsg` events → routes to authenticated or unauthenticated handlers

### ECS World (`src/simulation/`)

The game world is a bitECS world running at 60fps (16ms interval).

**Components** live in `src/simulation/components/`. Each component is a set of typed arrays indexed by entity ID. Key components:
- `Player`, `Mob`, `Item` — Entity type markers
- `Health`, `Damage`, `Durability` — Combat/survival
- `Position` — Room number (not x/y coordinates)
- `Scale` — Size category (SMALL, MEDIUM, LARGE)
- `Age`, `Hunger`, `Thirst` — Survival timers
- `Killable`, `Mortal`, `Flammable`, `Burning`, `Breakable` — Behavior flags
- `DeathDrops` — What drops on entity death
- `PlayerStats`, `MobStats` — Character attributes

**Systems** live in `src/simulation/systems/`. Each system is a bitECS query that runs every tick:
- `Time` — Tracks total ticks
- `Wandering` — Mob AI movement
- `Destroying` — Handles death drops, removes entities
- `Aging` — Entity aging, death by old age
- `Mortality` — Death when health reaches 0
- `Damaging` — Applies damage to health/durability
- `Breaking` — Destroys items at 0 durability
- `Burning` — Fire damage to flammable entities
- `Hungering` / `Thirsting` — Survival decay

**Entities** are templates in `src/simulation/entities/`. Use `createEntity(world, "player", {...})` to instantiate.

**Constants** in `src/simulation/constants/` define starting stats, mob properties, item types, etc.

**Indexes** in `src/simulation/indexes/` are lookup tables (damage types, drop types, scales).

### Commands (`src/commands/`)

Commands are organized by category:
- `src/commands/` — Player commands (40+)
- `src/commands/admin/` — Admin-only commands

Registration happens in `src/commands.ts` which exports:
- `commands` — Object mapping command names to handler functions
- `adminCommands` — Object mapping admin command names to handlers
- `commandAliases` — Maps aliases (n, north, e, east, etc.) to commands

Command parsing in `src/parseCommand.ts`:
1. Splits input on spaces
2. Strips filler words (a, an, and, at, go, in, or, the, to, with, etc.)
3. First word is the keyword
4. Routes to admin → player → alias → unknown command

### Database (`src/db/`)

SQLite databases for each entity type:
- `players.ts` — Player accounts and preferences
- `mobs.ts` — Mob definitions
- `items.ts` — Item definitions
- `rooms.ts` — Room/zone definitions
- `zones.ts` — Zone metadata
- `inventories.ts` — Player inventory associations

Database files are stored in `src/databases/` and gitignored (except `.gitkeep`).

### Message Formatting (`src/messages/`)

All game output goes through the message system:
- `sendMessage.ts` — Core send function
- `coloredText.ts` — ANSI color codes
- `emoji.ts` — Emoji mappings for room types
- `system.ts` — System messages (errors, notifications)
- `room.ts` — Room description formatting
- `help.ts` — Help text
- `global.ts` — Global messages (broadcasts, chat)
- `globalConstants.ts` — Liquid types, mob position states

### State Management (`src/state/`)

Runtime state managers that bridge the ECS world and the database:
- `players.ts` — Active players, Discord ID mapping
- `mobs.ts` — Active mob entities
- `items.ts` — Active item entities
- `rooms.ts` — Room data with prepared SQL queries
- `zones.ts` — Zone loading and player counting
- `inventories.ts` — Inventory lookups
- `broadcasts.ts` — Chat channel state
- `timedStateFunctions.ts` — Periodic tasks (saves, etc.)

## CircleMUD Data

DisMUD imports world data from CircleMUD format files:
- `.wld` — World/zone files (rooms, exits, descriptions)
- `.obj` — Object files (items)
- `.mob` — Mob files (monsters, NPCs)
- `.zon` — Zone files (spawning, timing)

Source data lives in `src/simulation/world-data/data/circlemud/`.
Parsed JSON lives in `src/simulation/world-data/data/json/`.
Parsers live in `src/simulation/world-data/libs/`.

Import pipeline: CircleMUD files → JSON → SQLite

## Coding Conventions

- **File naming**: `camelCase.ts` for source files
- **Indentation**: 2 spaces (Prettier config in `.prettierrc`)
- **Line width**: 120 characters
- **Quotes**: Double quotes (Prettier default)
- **Semicolons**: Required
- **Trailing commas**: ES5 style
- **Module system**: CommonJS (`require`/`module.exports`)
- **No strict typing**: `noImplicitAny: false` in tsconfig

## Key Patterns

### Creating an Entity

```typescript
const newEntity = createEntity(world, "player", {
  player: { id: playerId },
  position: { roomNum: roomNum },
  health: { val: 100, max: 100, damageIndex: damageIndexes.NONE },
  // ... other components
});
```

### Querying the ECS World

```typescript
const Player = world._components["player"];
const playerQuery = defineQuery([Player]);
const ents = playerQuery(world);
```

### Adding a New Command

1. Create `src/commands/myCommand.ts` with signature `(worldState, userData, words) => void`
2. Import and register in `src/commands.ts`
3. Add to `commands` object export

### Adding a New Component

1. Create `src/simulation/components/MyComponent.ts` — define the typed array
2. Register in `src/simulation/loaders/components.ts`
3. Add to entity templates in `src/simulation/entities/` as needed
4. Create a system in `src/simulation/systems/` if the component needs processing
5. Register the system in `src/simulation/loaders/systems.ts`

### Database Queries

Use the prepared query pattern in `src/db/*.ts`. Each DB module exports an object with a `conn` property (better-sqlite3 or sqlite3 connection) and query functions.

## Running & Development

```bash
npm install          # Install dependencies
npm start            # Run the bot
npm run parse-all    # Parse CircleMUD data to JSON
npm run import-all   # Import JSON to SQLite
```

## Testing

No test framework is currently configured. Manual testing via Discord is the primary method.

## File Locations Cheat Sheet

| What | Where |
|------|-------|
| Bot entry point | `src/main.ts` |
| Discord interface | `src/bot/interface.ts` |
| All commands | `src/commands/` + `src/commands.ts` |
| ECS components | `src/simulation/components/` |
| ECS systems | `src/simulation/systems/` |
| ECS entities | `src/simulation/entities/` |
| ECS constants | `src/simulation/constants/` |
| ECS world setup | `src/simulation/world.ts` |
| Database schemas | `src/db/` |
| Runtime state | `src/state/` |
| Message formatting | `src/messages/` |
| Help text | `docs/commands.hlp` |
| Design docs | `docs/` |
| TODO / backlog | `TODO.md` |
| World data (source) | `src/simulation/world-data/data/circlemud/` |
| World data (JSON) | `src/simulation/world-data/data/json/` |
| Parsers | `src/simulation/world-data/libs/` |
