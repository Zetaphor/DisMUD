import { getRecord, initDb } from "./util";

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

const createMobIndexes = `CREATE INDEX IF NOT EXISTS idx_vNum ON Mobs (vNum);`;

const mobMethods = {
  getMobData: (vnum) => getRecord(mobsDBConn, "Mobs", "vnum", vnum),
};

export default function initMobsDb() {
  const mobsDBObject = initDb(dbPath, "Mobs", createMobsTable, createMobIndexes);
  mobsDBObject["methods"] = mobMethods;
  mobsDBConn = mobsDBObject["conn"];
  return mobsDBObject;
}
