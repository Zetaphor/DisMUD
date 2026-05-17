import fs from "fs";
import Database from "better-sqlite3";

const dbPath = "/home/zetaphor/Code/DisMUD/src/databases/rooms.db";
const wldDir = "/home/zetaphor/Code/DisMUD/src/simulation/world-data/data/json/wld/";

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS Rooms (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    name TEXT,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  )
`);
db.exec("CREATE INDEX IF NOT EXISTS idx_vNum ON Rooms (vNum)");

const files = fs.readdirSync(wldDir).filter((f) => f.endsWith(".json"));
const insert = db.prepare(
  "INSERT OR IGNORE INTO Rooms (vNum, name, data) VALUES (@vNum, @name, @data)"
);

let totalRooms = 0;
const txn = db.transaction((rooms) => {
  for (const room of rooms) {
    insert.run({ vNum: room.id, name: room.name, data: JSON.stringify(room) });
  }
});

for (const file of files) {
  const content = fs.readFileSync(`${wldDir}${file}`, "utf8");
  const rooms = JSON.parse(content);
  txn(rooms);
  totalRooms += rooms.length;
}

console.log(`Imported ${totalRooms} rooms into ${dbPath}`);
db.close();
