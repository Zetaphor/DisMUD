import { createRecord, getRecord, initDb, removeRecord } from "./util";

const dbPath = "src/databases/playerInventories.db";

let playerInventoriesDBConn = null;

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
  getPlayerInventory: (id: BigInt) => getRecord(playerInventoriesDBConn, "PlayerInventories", "discordId", id),
  initPlayerInventory: (id: BigInt) =>
    createRecord(playerInventoriesDBConn, "PlayerInventories", { discordId: id, inventoryString: "" }),
  removePlayerInventory: (id: BigInt) => removeRecord(playerInventoriesDBConn, "PlayerInventories", id),
  addItem: (itemData: Object) => createRecord(playerInventoriesDBConn, "PlayerInventories", itemData),
  removeItem: (id: BigInt) => removeRecord(playerInventoriesDBConn, "PlayerInventories", id),
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
