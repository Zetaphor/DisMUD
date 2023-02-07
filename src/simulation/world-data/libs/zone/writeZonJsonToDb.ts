const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

try {
  fs.unlinkSync(`src/databases/imported/zones.db`, (err) => {});
} catch (error) {}

const db = new sqlite3.Database("src/databases/imported/zones.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS Zones (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  );

  CREATE INDEX idx_vNum ON Zones (vNum)
  `);

  fs.readdir("src/simulation/world-data/data/json/zon/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        fs.readFile(`src/simulation/world-data/data/json/zon/${file}`, "utf8", (err, content) => {
          if (err) throw err;

          const zone = JSON.parse(content);
          db.run("INSERT INTO Zones (vNum, data) VALUES (?, ?)", [zone.id, content], (err) => {
            if (err) throw err;
          });
        });
      }
    });
    // db.close();
  });
});
