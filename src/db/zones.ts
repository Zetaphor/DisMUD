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

const createZonesIndexes = `CREATE INDEX IF NOT EXISTS idx_vNum ON Zones (vNum);`;

const zonesMethods = {
  getAllZones: () => getAllRecords(zonesDBConn, "Zones", "vnum"),
  getZoneData: (vnum) => getRecord(zonesDBConn, "Zones", "vnum", vnum),
};

export default function initZonesDb() {
  const zonesDBObject = initDb(dbPath, "Zones", createZonesTable, createZonesIndexes);
  zonesDBObject["methods"] = zonesMethods;
  zonesDBConn = zonesDBObject["conn"];
  return zonesDBObject;
}
