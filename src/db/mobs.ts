import { initDb } from "./util";

const dbPath = "src/databases/mobs.db";

let mobsDBConn = null;

const createMobsTable = `
CREATE TABLE IF NOT EXISTS Mobs (
  id INTEGER PRIMARY KEY,
  vNum INTEGER UNIQUE,
  data TEXT,
  created TEXT DEFAULT (datetime('now', 'utc')),
  lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createMobIndexes = `CREATE INDEX idx_vNum ON Mobs (vNum);`;

const mobMethods = {};

/**
 * Initializes the mobs database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initMobsDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const mobsDBObject = await initDb(dbPath, "Mobs", createMobsTable, createMobIndexes);
      mobsDBObject["methods"] = mobMethods;
      mobsDBConn = mobsDBObject["conn"];
      resolve(mobsDBObject);
    } catch (err) {
      console.error(`Error initializing mobs database: ${err.message}`);
      reject(err);
    }
  });
}
