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

const createPlayerIndexes = `CREATE INDEX IF NOT EXISTS idx_roomNum ON Players (roomNum)`;

const playerMethods = {
  displayNameExists: (displayName) => recordExists(playersDBConn, "Players", "displayName", displayName),
  playerExists: (discordId) => recordExists(playersDBConn, "Players", "discordId", discordId),
  createPlayer(data: object) {
    const newPlayerId = createRecord(playersDBConn, "Players", data);
    return getRecord(playersDBConn, "Players", "id", newPlayerId);
  },
  getPlayerDataByDiscordId(discordId) {
    return getRecord(playersDBConn, "Players", "discordId", discordId);
  },
  setPlayerName: (id, name) => updateRecord(playersDBConn, "Players", { id: id, displayName: name }, "id", id),
  setPlayerEnabled: (id, enabled) =>
    updateRecord(playersDBConn, "Players", { id: id, enabled: enabled }, "id", id),
  updateLastLogin: (id) =>
    updateRecord(
      playersDBConn,
      "Players",
      { id: id, lastLogin: new Date().toISOString().slice(0, 19).replace("T", " ") },
      "id",
      id
    ),
  savePlayer: (id, userData, simulationData) =>
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

export default function initPlayersDb() {
  const playersDBObject = initDb(dbPath, "Players", createPlayersTable, createPlayerIndexes);
  playersDBConn = playersDBObject["conn"];
  playersDBObject["methods"] = playerMethods;
  return playersDBObject;
}
