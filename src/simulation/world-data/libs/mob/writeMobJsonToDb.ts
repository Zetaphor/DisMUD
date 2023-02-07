const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

try {
  fs.unlinkSync(`src/databases/imported/mobs.db`, (err) => {});
} catch (error) {}

const db = new sqlite3.Database("src/databases/imported/mobs.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS Mobs (
    id INTEGER PRIMARY KEY,
    vNum INTEGER,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  );

  CREATE INDEX idx_vNum ON Mobs (vNum)
  `);

  fs.readdir("src/simulation/world-data/data/json/mob/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        fs.readFile(`src/simulation/world-data/data/json/mob/${file}`, "utf8", (err, content) => {
          if (err) throw err;

          const json = JSON.parse(content);
          for (let i = 0; i < json.length; i++) {
            const mob = json[i];
            db.run("INSERT INTO Mobs (vNum, data) VALUES (?, ?)", [mob.id, JSON.stringify(mob)], (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
    // db.close();
  });
});
