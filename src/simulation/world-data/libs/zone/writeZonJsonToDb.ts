import fs from "fs";
import Database from "better-sqlite3";

const dbPath = "/home/zetaphor/Code/DisMUD/src/databases/zones.db";
const zonDir = "/home/zetaphor/Code/DisMUD/src/simulation/world-data/data/json/zon/";

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS Zones (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  )
`);
db.exec("CREATE INDEX IF NOT EXISTS idx_vNum ON Zones (vNum)");

const files = fs.readdirSync(zonDir).filter((f) => f.endsWith(".json"));
const insert = db.prepare("INSERT OR IGNORE INTO Zones (vNum, data) VALUES (@vNum, @data)");

let totalZones = 0;
for (const file of files) {
  const content = fs.readFileSync(`${zonDir}${file}`, "utf8");
  const zone = JSON.parse(content);
  insert.run({ vNum: zone.id, data: content });
  totalZones++;
}

console.log(`Imported ${totalZones} zones into ${dbPath}`);
db.close();
