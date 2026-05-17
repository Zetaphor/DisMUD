import fs from "fs";
import Database from "better-sqlite3";

const dbPath = "/home/zetaphor/Code/DisMUD/src/databases/items.db";
const objDir = "/home/zetaphor/Code/DisMUD/src/simulation/world-data/data/json/obj/";

if (fs.existsSync(dbPath)) {
  fs.unlinkSync(dbPath);
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS Items (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  )
`);
db.exec("CREATE INDEX IF NOT EXISTS idx_vNum ON Items (vNum)");

const files = fs.readdirSync(objDir).filter((f) => f.endsWith(".json"));
const insert = db.prepare("INSERT OR IGNORE INTO Items (vNum, data) VALUES (@vNum, @data)");

let totalItems = 0;
const txn = db.transaction((objects) => {
  for (const obj of objects) {
    insert.run({ vNum: obj.id, data: JSON.stringify(obj) });
  }
});

for (const file of files) {
  const content = fs.readFileSync(`${objDir}${file}`, "utf8");
  const objects = JSON.parse(content);
  txn(objects);
  totalItems += objects.length;
}

console.log(`Imported ${totalItems} items into ${dbPath}`);
db.close();
