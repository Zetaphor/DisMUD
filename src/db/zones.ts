import { getAllRecords, getRecord, initDb } from "./util";

const dbPath = "src/databases/zones.db";

let zonesDBConn = null;

const createZonesTable = `
CREATE TABLE IF NOT EXISTS Zones (
  id INTEGER PRIMARY KEY,
  vNum INTEGER,
  data TEXT,
  created TEXT DEFAULT (datetime('now', 'utc')),
  lastUpdated TEXT DEFAULT (datetime('now', 'utc'))
)
`;

const createZonesIndexes = `CREATE INDEX idx_vNum ON Zones (vNum);`;

const zonesMethods = {
  getAllZones: () => getAllRecords(zonesDBConn, "Zones", "vnum"),
  getZoneData: (vnum: BigInt) => getRecord(zonesDBConn, "Zones", "vnum", vnum),
};

/**
 * Initializes the zones database.
 * @returns {Promise} A promise that resolves to an object containing the database connection and methods.
 */
export default function initZonesDb() {
  return new Promise(async (resolve, reject) => {
    try {
      const zonesDBObject = await initDb(dbPath, "Zones", createZonesTable, createZonesIndexes);
      zonesDBObject["methods"] = zonesMethods;
      zonesDBConn = zonesDBObject["conn"];
      resolve(zonesDBObject);
    } catch (err) {
      console.error(`Error initializing zones database: ${err}`);
      reject(err);
    }
  });
}
