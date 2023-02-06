import { createRecord, createTable, initDb, recordExists, tableExists, updateRecord } from "./util";

const dbPath = "src/players.db";

let playersDB = null;

const createPlayersTable = `
CREATE TABLE IF NOT EXISTS Players (
  discordId INTEGER PRIMARY KEY,
  discordUsername TEXT,
  displayName TEXT,
  roomNum INTEGER,
  creationDate TEXT DEFAULT (datetime('now', 'utc')),
  lastLogin TEXT DEFAULT (datetime('now', 'utc')),
  enabled BOOLEAN DEFAULT true,
  admin BOOLEAN DEFAULT false
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
  return new Promise(async (resolve, reject) => {
    try {
      const playersDBObject = await initDb(dbPath, "Players", createPlayersTable, createPlayerIndexes);
      playersDBObject["methods"] = playerMethods;
      resolve(playersDBObject);
    } catch (err) {
      console.error(`Error initializing players database: ${err.message}`);
      reject(err);
    }
  });
}
