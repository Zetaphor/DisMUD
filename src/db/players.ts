import { createRecord, getRecord, initDb, updateRecord } from "./util";

const dbPath = "src/databases/players.db";

let playersDBConn = null;

const createPlayersTable = `
CREATE TABLE IF NOT EXISTS Players (
  id INTEGER PRIMARY KEY,
  discordId INTEGER UNIQUE,
  discordUsername TEXT,
  displayName TEXT,
  roomNum INTEGER,
  creationDate TEXT DEFAULT (datetime('now', 'utc')),
  lastLogin TEXT DEFAULT (datetime('now', 'utc')),
  enabled BOOLEAN DEFAULT true,
  admin BOOLEAN DEFAULT false
)
`;

const createPlayerIndexes = `CREATE INDEX idx_roomNum ON Players (roomNum)`;

const playerMethods = {
  createPlayer: (data: Object) => createRecord(playersDBConn, "Players", data),
  playerExists: (id: BigInt) => getRecord(playersDBConn, "Players", "discordId", id),
  setPlayerName: (id: BigInt, name: String) =>
    updateRecord(playersDBConn, "Players", { id: id, displayName: name }, "id", id),
  setPlayerEnabled: (id: BigInt, enabled: Boolean) =>
    updateRecord(playersDBConn, "Players", { id: id, enabled: enabled }, "id", id),
};

/**
 * Initializes the players database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initPlayersDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const playersDBObject = await initDb(dbPath, "Players", createPlayersTable, createPlayerIndexes);
      playersDBConn = playersDBObject["conn"];
      playersDBObject["methods"] = playerMethods;
      resolve(playersDBObject);
    } catch (err) {
      console.error(`Error initializing players database: ${err.message}`);
      reject(err);
    }
  });
}
