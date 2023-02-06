import { createRecord, initDb, recordExists, updateRecord } from "./util";

const dbPath = "src/databases/playerInventories.db";

let playersDB = null;

const createPlayerInventoriesTable = `
CREATE TABLE IF NOT EXISTS PlayerInventories (
  id INTEGER PRIMARY KEY,
  discordId INTEGER,
  inventoryString TEXT,
  lastUpdated TEXT DEFAULT (datetime('now', 'utc')),
  FOREIGN KEY (discordId) REFERENCES Players(discordId)
)
`;

const createPlayerInventoryIndexes = ``;

const playerInventoryMethods = {
  // createPlayer: (data: Object) => createRecord(playersDB, "Players", data),
};

/**
 * Initializes the players database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initPlayerInventoriesDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const playerInventoriesDBObject = await initDb(dbPath, "PlayerInventories", createPlayerInventoriesTable, null);
      playerInventoriesDBObject["methods"] = playerInventoryMethods;
      playerInventoriesDBConn = playerInventoriesDBObject["conn"];
      resolve(playerInventoriesDBObject);
    } catch (err) {
      console.error(`Error initializing player inventories database: ${err.message}`);
      reject(err);
    }
  });
}
