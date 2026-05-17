# DisMUD

A Discord-based MUD (Multi-User Dungeon) built with TypeScript, bitECS, and SQLite.

DisMUD brings a classic text-based RPG experience to Discord. Players interact with the game world through commands sent to a Discord bot, exploring zones, fighting monsters, managing inventory, and socializing — all powered by a high-performance ECS simulation loop running at 60fps.

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Discord Bot Layer                     │
│         (discord.js-light, message parsing)              │
├─────────────────────────────────────────────────────────┤
│                    Command Layer                         │
│    40+ commands (movement, combat, inventory, socials)   │
│    Admin commands (debug, load, force, goto)             │
├─────────────────────────────────────────────────────────┤
│              State Management & Persistence              │
│    SQLite databases (players, mobs, items, rooms, zones) │
├─────────────────────────────────────────────────────────┤
│              bitECS Simulation World                     │
│    ECS: Components → Systems → Entities                  │
│    60fps tick loop (16ms interval)                       │
└─────────────────────────────────────────────────────────┘
```

### Core Technologies

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (ES2020) |
| ECS | [bitECS](https://github.com/NateTheGreatt/bitECS) |
| Bot Framework | discord.js-light |
| Database | SQLite3 |
| Formatting | Prettier (120 char width) |
| Runtime | Node.js + ts-node |

## 📂 Project Structure

```
DisMUD/
├── src/
│   ├── main.ts                      # Application entry point
│   ├── bot/
│   │   └── interface.ts             # Discord bot wrapper & event system
│   ├── commands/                    # All game commands
│   │   ├── admin/                   # Admin-only commands
│   │   │   ├── debug.ts, debugExits.ts, debugUser.ts
│   │   │   ├── force.ts, giveGold.ts, goto.ts
│   │   │   ├── loadItem.ts, loadMob.ts
│   │   │   └── mobFollow.ts, mobUnfollow.ts
│   │   ├── balance.ts, drop.ts, emote.ts, examine.ts
│   │   ├── inventory.ts, look.ts, move.ts, score.ts
│   │   └── ... (40+ command files)
│   ├── commands.ts                  # Command registry & aliases
│   ├── parseCommand.ts              # Command parser with filler-word stripping
│   ├── databases/                   # SQLite database files (gitignored)
│   ├── db/                          # Database initialization & queries
│   │   ├── init.ts, players.ts, mobs.ts, items.ts
│   │   ├── rooms.ts, zones.ts, inventories.ts
│   ├── messages/                    # Message formatting & output
│   │   ├── coloredText.ts, emoji.ts, sendMessage.ts
│   │   ├── global.ts, system.ts, room.ts, help.ts
│   │   └── globalConstants.ts       # Liquid types, mob states
│   ├── simulation/                  # ECS game simulation
│   │   ├── world.ts                 # World factory, entity creation
│   │   ├── components/              # ECS components (15+)
│   │   │   ├── Player.ts, Mob.ts, Item.ts
│   │   │   ├── Health.ts, Damage.ts, Durability.ts
│   │   │   ├── Hunger.ts, Thirst.ts, Age.ts
│   │   │   └── Position.ts, Scale.ts, Killable.ts
│   │   ├── systems/                 # ECS systems (10)
│   │   │   ├── Time.ts, Wandering.ts
│   │   │   ├── Damaging.ts, Breaking.ts, Burning.ts
│   │   │   ├── Aging.ts, Mortality.ts
│   │   │   ├── Hungering.ts, Thirsting.ts
│   │   │   └── Destroying.ts
│   │   ├── entities/                # Entity templates
│   │   │   ├── Player.ts, Mob.ts, Item.ts, Corpse.ts, Tree.ts, Wood.ts
│   │   ├── constants/               # Game constants
│   │   │   ├── playerStats.ts       # Class starting stats
│   │   │   ├── mobs.ts, items.ts, room.ts
│   │   ├── indexes/                 # Enum-like lookup tables
│   │   │   ├── damageIndexes.ts, dropIndexes.ts, scaleIndexes.ts
│   │   ├── utils/                   # Helpers
│   │   │   ├── diceRoll.ts, bitvectors.ts, createEntity.ts
│   │   └── world-data/              # CircleMUD data parsing
│   │       ├── data/circlemud/      # Original CircleMUD files
│   │       ├── data/json/           # Parsed JSON equivalents
│   │       └── libs/                # Parsers & importers
│   ├── state/                       # Runtime state managers
│   │   ├── players.ts, mobs.ts, items.ts, rooms.ts, zones.ts
│   │   ├── inventories.ts, broadcasts.ts
│   │   └── timedStateFunctions.ts
│   └── util/
│       ├── wordFilter.ts, bannedWords.txt
│       └── capitalizeFirst.ts
├── docs/                            # Design docs & reference material
│   ├── components.md, entities.md, systems.md
│   ├── CircleMUD Builders Guide.txt
│   └── commands.hlp
├── extra-areas/                     # Additional world areas
│   ├── bhandbook/                   # Builder handbook area
│   ├── cawareas/                    # CircleMUD areas (tarballs)
│   └── furryareas/                  # Furry-themed areas
├── .env.example                     # Environment variable template
├── package.json
├── tsconfig.json
└── .prettierrc
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ (with npm)
- **SQLite3** (installed via npm dependency)

### Installation

```bash
# Clone the repository
git clone git@github.com:Zetaphor/DisMUD.git
cd DisMUD

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env and add your Discord bot token
```

### Discord Bot Setup

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application and add a Bot
3. Copy the bot token into `.env`:
   ```
   DISCORD_TOKEN="your-bot-token-here"
   ```
4. Invite the bot to your server using the OAuth2 URL generator (scope: `bot`, intents: `Send Messages`)

### Running the Game

```bash
# Start the MUD bot
npm start
```

On startup the bot will:
1. Initialize the bitECS world and start the 60fps simulation loop
2. Load all SQLite databases (players, mobs, items, rooms, zones)
3. Connect to Discord and become ready to receive commands
4. Notify online players of system messages

### World Data Import

DisMUD parses world data from CircleMUD format files (`.wld`, `.obj`, `.mob`, `.zon`) through a two-step process:

```bash
# Step 1: Parse CircleMUD files → JSON
npm run parse-all

# Step 2: Import JSON → SQLite databases
npm run import-all

# Or do both at once
npm run parse-all && npm run import-all
```

Individual parsers are also available:
| Script | Description |
|--------|-------------|
| `npm run parse-world` | Parse `.wld` zone/room files |
| `npm run parse-obj` | Parse `.obj` object files |
| `npm run parse-mob` | Parse `.mob` mob files |
| `npm run parse-zon` | Parse `.zon` zone files |

## 🎮 Game Features

### Player Classes
- **Warrior** — High HP/AC, strong melee
- **Cleric** — Balanced, high wisdom
- **Thief** — High dexterity, mobile
- **Sorcerer** — High intelligence, mana-focused

### Core Systems
- **Movement** — Cardinal directions with auto-exits
- **Combat** — Attack, flee, assist, backstab, bash
- **Inventory** — Take, wear, remove, drop, give, equipment
- **Social** — Say, emote, tell, whisper, shout
- **Survival** — Hunger, thirst, health, mana, movement points
- **Chat** — Global, auction, local channels
- **Exploration** — Look, examine, exits, score, who

### Admin Commands
- `loaditem` / `loadmob` — Spawn entities into the world
- `goto` — Teleport to a player
- `givegold` — Transfer gold
- `force` — Force a command on another player
- `debug` / `debuguser` — Inspect entities and state

## 📖 Documentation

- [Components](docs/components.md) — ECS component definitions
- [Entities](docs/entities.md) — Entity templates and their required components
- [Systems](docs/systems.md) — ECS system descriptions
- [CircleMUD Builders Guide](docs/CircleMUD%20Builders%20Guide.txt) — Original CircleMUD area-building reference
- [TODO](TODO.md) — Current feature backlog

## 🔮 Planned Features

See [TODO.md](TODO.md) for the full feature backlog. Highlights include:

- In-memory room caching for performance
- Player aliases system
- Combat mechanics (kick, murder, wimpy, consider, diagnose)
- Object bitvectors (cursed items, drop prevention)
- Movement point drain/recovery by zone
- Drinking liquids (drunk/thirst mechanics)
- Admin stat inspection commands
- Mob action bitvectors (sentinel flag)
- Logging infrastructure
- Experience & leveling system
- Spellcasting system

## 📄 License

ISC
