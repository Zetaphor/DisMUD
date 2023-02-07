import { createRecord, getRecord, initDb, removeRecord } from "./util";

const dbPath = "src/databases/objects.db";

let objectsDBConn = null;

const createObjectsTable = `
CREATE TABLE IF NOT EXISTS Objects (
  id INTEGER PRIMARY KEY,
  vNum INTEGER,
  name TEXT,
  data TEXT,
  created TEXT DEFAULT (datetime('now', 'utc')),
  lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createObjectIndexes = `CREATE INDEX idx_vNum ON Objects (vNum); CREATE INDEX idx_name ON Objects (name);`;

const objectMethods = {};

/**
 * Initializes the objects database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initObjectsDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const objectsDBObject = await initDb(dbPath, "Objects", createObjectsTable, createObjectIndexes);
      objectsDBObject["methods"] = objectMethods;
      objectsDBConn = objectsDBObject["conn"];
      resolve(objectsDBObject);
    } catch (err) {
      console.error(`Error initializing objects database: ${err.message}`);
      reject(err);
    }
  });
}
