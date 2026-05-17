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

const createItemsIndexes = `CREATE INDEX IF NOT EXISTS idx_vNum ON Items (vNum);`;

const itemMethods = {
  getItemData: (vnum) => getRecord(itemsDBConn, "Items", "vnum", vnum),
};

export default function initItemsDb() {
  const itemsDBObject = initDb(dbPath, "Items", createItemsTable, createItemsIndexes);
  itemsDBObject["methods"] = itemMethods;
  itemsDBConn = itemsDBObject["conn"];
  return itemsDBObject;
}
