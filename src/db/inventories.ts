import { createRecord, getRecord, initDb, removeRecord } from "./util";

const dbPath = "src/databases/playerInventories.db";

let playerInventoriesDBConn = null;

const createPlayerInventoriesTable = `
CREATE TABLE IF NOT EXISTS PlayerInventories (
  id INTEGER PRIMARY KEY,
  playerId INTEGER UNIQUE,
  inventoryString TEXT,
  lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createPlayerInventoryIndexes = `CREATE INDEX idx_playerId ON PlayerInventories (playerId);`;

const playerInventoryMethods = {
  getPlayerInventory: (id: BigInt) => getRecord(playerInventoriesDBConn, "PlayerInventories", "playerId", id),
  initPlayerInventory: (id: BigInt) => {
    return new Promise(async (resolve, reject) => {
      try {
        const newInventoryId = await createRecord(playerInventoriesDBConn, "PlayerInventories", {
          playerId: id,
          inventoryString: "",
        });
        const newInventory = await getRecord(playerInventoriesDBConn, "PlayerInventories", "id", newInventoryId);
        resolve(newInventory);
      } catch (err) {
        console.error(`Error initializing player inventory for ${id}:`, err);
        reject(err);
      }
    });
  },
  removePlayerInventory: (id: BigInt) => removeRecord(playerInventoriesDBConn, "PlayerInventories", id),
};

/**
 * Initializes the players database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initPlayerInventoriesDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const playerInventoriesDBObject = await initDb(
        dbPath,
        "PlayerInventories",
        createPlayerInventoriesTable,
        createPlayerInventoryIndexes
      );
      playerInventoriesDBObject["methods"] = playerInventoryMethods;
      playerInventoriesDBConn = playerInventoriesDBObject["conn"];
      resolve(playerInventoriesDBObject);
    } catch (err) {
      console.error(`Error initializing player inventories database: ${err}`);
      reject(err);
    }
  });
}
