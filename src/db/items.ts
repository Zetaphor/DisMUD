import { getRecord, initDb } from "./util";

const dbPath = "src/databases/items.db";

let itemsDBConn = null;

const createItemsTable = `
CREATE TABLE IF NOT EXISTS Items (
  id INTEGER PRIMARY KEY,
  vNum INTEGER UNIQUE,
  data TEXT,
  created TEXT DEFAULT (datetime('now', 'utc')),
  lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createItemsIndexes = `CREATE INDEX idx_vNum ON Items (vNum);`;

const itemMethods = {
  getItemData: (vnum: BigInt) => getRecord(itemsDBConn, "Items", "vnum", vnum),
};

/**
 * Initializes the items database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initItemsDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const itemsDBObject = await initDb(dbPath, "Items", createItemsTable, createItemsIndexes);
      itemsDBObject["methods"] = itemMethods;
      itemsDBConn = itemsDBObject["conn"];
      resolve(itemsDBObject);
    } catch (err) {
      console.error(`Error initializing items database: ${err}`);
      reject(err);
    }
  });
}
