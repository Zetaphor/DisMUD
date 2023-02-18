import { createRecord, getRecord, initDb, recordExists, updateRecord } from "./util";

const dbPath = "src/databases/players.db";

let playersDBConn = null;

const createPlayersTable = `
CREATE TABLE IF NOT EXISTS Players (
  id INTEGER PRIMARY KEY,
  discordId TEXT UNIQUE,
  discordUsername TEXT,
  displayName TEXT,
  roomNum INTEGER,
  gold INTEGER DEFAULT 10,
  bank INTEGER DEFAULT 0,
  equipment TEXT,
  simulationData TEXT,
  userPrefs TEXT,
  className TEXT,
  creationDate TEXT DEFAULT (datetime('now', 'utc')),
  lastLogin TEXT DEFAULT (datetime('now', 'utc')),
  lastSaved TEXT DEFAULT (datetime('now', 'utc')),
  enabled BOOLEAN DEFAULT true,
  admin BOOLEAN DEFAULT false
)
`;

const createPlayerIndexes = `CREATE INDEX idx_roomNum ON Players (roomNum)`;

const playerMethods = {
  displayNameExists: (displayName) => recordExists(playersDBConn, "Players", "displayName", displayName),
  playerExists: (discordId) => recordExists(playersDBConn, "Players", "discordId", discordId),
  createPlayer: (data: Object) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newPlayerId = await createRecord(playersDBConn, "Players", data);
        const newPlayer = await getRecord(playersDBConn, "Players", "id", newPlayerId);
        resolve(newPlayer);
      } catch (err) {
        console.error(`Error creating player:`, err);
        reject(err);
      }
    });
  },
  getPlayerDataByDiscordId: (discordId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const playerData = await getRecord(playersDBConn, "Players", "discordId", discordId);
        resolve(playerData);
      } catch (err) {
        console.error(`Error checking if player exists:`, err);
        reject(err);
      }
    });
  },
  setPlayerName: (id: BigInt, name: String) =>
    updateRecord(playersDBConn, "Players", { id: id, displayName: name }, "id", id),
  setPlayerEnabled: (id: BigInt, enabled: Boolean) =>
    updateRecord(playersDBConn, "Players", { id: id, enabled: enabled }, "id", id),
  updateLastLogin: (id: BigInt) =>
    updateRecord(
      playersDBConn,
      "Players",
      { id: id, lastLogin: new Date().toISOString().slice(0, 19).replace("T", " ") },
      "id",
      id
    ),
  savePlayer: (id: BigInt, userData: Object, simulationData: Object) =>
    updateRecord(
      playersDBConn,
      "Players",
      {
        roomNum: simulationData["position"]["roomNum"],
        gold: userData["gold"],
        bank: userData["bank"],
        lastSaved: new Date().toISOString().slice(0, 19).replace("T", " "),
        simulationData: encodeURIComponent(JSON.stringify(simulationData)),
        equipment: encodeURIComponent(JSON.stringify(userData["equipment"])),
        userPrefs: encodeURIComponent(JSON.stringify(userData["userPrefs"])),
      },
      "id",
      id
    ),
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
      console.error(`Error initializing players database: ${err}`);
      reject(err);
    }
  });
}
