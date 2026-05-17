import fs from "fs";
import Database from "better-sqlite3";

const dbPath = "/home/zetaphor/Code/DisMUD/src/databases/mobs.db";
const mobDir = "/home/zetaphor/Code/DisMUD/src/simulation/world-data/data/json/mob/";

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS Mobs (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  )
`);
db.exec("CREATE INDEX IF NOT EXISTS idx_vNum ON Mobs (vNum)");

const files = fs.readdirSync(mobDir).filter((f) => f.endsWith(".json"));
const insert = db.prepare("INSERT OR IGNORE INTO Mobs (vNum, data) VALUES (@vNum, @data)");

let totalMobs = 0;
const txn = db.transaction((mobs) => {
  for (const mob of mobs) {
    insert.run({ vNum: mob.id, data: JSON.stringify(mob) });
  }
});

for (const file of files) {
  const content = fs.readFileSync(`${mobDir}${file}`, "utf8");
  const mobs = JSON.parse(content);
  txn(mobs);
  totalMobs += mobs.length;
}

console.log(`Imported ${totalMobs} mobs into ${dbPath}`);
db.close();
