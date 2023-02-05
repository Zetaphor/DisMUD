const sqlite3 = require("sqlite3").verbose();
import { createRecord, createTable, recordExists, tableExists, updateRecord } from "./util";

const dbPath = "src/players.db";

let playersDB = null;

const createPlayersTable = `
CREATE TABLE IF NOT EXISTS Players (
  discordId INTEGER PRIMARY KEY,
  discordUsername TEXT,
  displayName TEXT,
  roomNum INTEGER,
  creationDate TEXT DEFAULT (datetime('now', 'utc')),
  enabled BOOLEAN DEFAULT true
)
`;

const createPlayerIndexes = `
CREATE INDEX idx_roomNum ON Players (roomNum)
`;

const playerMethods = {
  createPlayer: (data: Object) => createRecord(playersDB, "Players", data),
  playerExists: (id: BigInt) => recordExists(playersDB, "Players", "discordId", id),
  setPlayerName: (id: BigInt, name: String) =>
    updateRecord(playersDB, "Players", { discordId: id, displayName: name }, "discordId", id),
  setPlayerEnabled: (id: BigInt, enabled: Boolean) =>
    updateRecord(playersDB, "Players", { discordId: id, enabled: enabled }, "discordId", id),
};

/**
 * Initializes the players database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initPlayersDb() {
  const playersDBObject = {
    conn: playersDB,
    methods: playerMethods,
  };

  return new Promise((resolve, reject) => {
    playersDB = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error(`Failed to open database ${dbPath}:`, err);
        reject(err);
      }
      console.log("Connected to the players database.");
      tableExists(playersDB, "Players")
        .then((exists) => {
          if (exists) resolve(playersDBObject);
          else {
            createTable(playersDB, createPlayersTable, createPlayerIndexes)
              .then(() => {
                resolve(playersDBObject);
              })
              .catch((err) => {
                console.error("Failed to create table:", err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          console.error("Failed to check for existing table:", err);
          reject(err);
        });
    });
  });
}
