const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

try {
  fs.unlinkSync(`src/databases/imported/rooms.db`, (err) => {});
} catch (error) {}

const db = new sqlite3.Database("src/databases/imported/rooms.db");

db.serialize(() => {
  db.run(`
  CREATE TABLE IF NOT EXISTS Rooms (
    id INTEGER PRIMARY KEY,
    vNum INTEGER UNIQUE,
    data TEXT,
    created TEXT DEFAULT (datetime('now', 'utc')),
    lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
  );

  CREATE INDEX idx_vNum ON Rooms (vNum)
  `);

  fs.readdir("src/simulation/world-data/data/json/wld/", (err, files) => {
    if (err) throw err;

    files.forEach((file) => {
      if (file.endsWith(".json")) {
        fs.readFile(`src/simulation/world-data/data/json/wld/${file}`, "utf8", (err, content) => {
          if (err) throw err;

          const json = JSON.parse(content);
          for (let i = 0; i < json.length; i++) {
            const room = json[i];
            // console.log(room.id, room.name);
            db.run("INSERT INTO Rooms (vNum, data) VALUES (?, ?)", [room.id, JSON.stringify(room)], (err) => {
              if (err) {
                console.log(`Error on ${room.id}`);
                throw err;
              }
            });
          }
        });
      }
    });
    // db.close();
  });
});
