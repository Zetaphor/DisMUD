const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

try {
  fs.unlinkSync(`src/databases/imported/items.db`, (err) => {});
} catch (error) {}

const db = new sqlite3.Database("src/databases/imported/items.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS Items (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  );

  CREATE INDEX idx_vNum ON Items (vNum)
  `);

  fs.readdir("src/simulation/world-data/data/json/obj/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        fs.readFile(`src/simulation/world-data/data/json/obj/${file}`, "utf8", (err, content) => {
          if (err) throw err;

          const json = JSON.parse(content);
          for (let i = 0; i < json.length; i++) {
            const object = json[i];
            db.run("INSERT INTO Items (vNum, data) VALUES (?, ?)", [object.id, JSON.stringify(object)], (err) => {
              if (err) throw err;
            });
          }
        });
      }
    });
    // db.close();
  });
});
