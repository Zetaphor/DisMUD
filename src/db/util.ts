import Database from "better-sqlite3";
import logger from "../util/logger";
const fs = require("fs");

export function recordExists(db: Database.Database, table: string, key: string, val: any): boolean {
  const row = db.prepare(`SELECT 1 FROM ${table} WHERE ${key} = ? LIMIT 1`).get(val);
  return !!row;
}

export function getRecord(db: Database.Database, table: string, key: string, val: any): any {
  return db.prepare(`SELECT * FROM ${table} WHERE ${key} = ? LIMIT 1`).get(val);
}

export function getAllRecords(db: Database.Database, table: string, orderBy = "id"): any[] {
  return db.prepare(`SELECT * FROM ${table} ORDER BY ${orderBy}`).all();
}

export function createRecord(db: Database.Database, table: string, data: object): number {
  const fields = Object.keys(data);
  const placeholders = fields.map(() => "?").join(", ");
  const values = Object.values(data).map((v) => (v === "DEFAULT" ? null : v));

  const query = `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`;
  const result = db.prepare(query).run(...values);
  return Number(result.lastInsertRowid);
}

export function removeRecord(db: Database.Database, table: string, id: number | bigint): void {
  const result = db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  logger.info(`${table} row(s) deleted: ${result.changes}`);
}

export function updateRecord(
  db: Database.Database,
  table: string,
  data: object,
  whereName: string,
  whereVal: any,
  limit = 0
): void {
  const fields = Object.keys(data).filter((f) => f !== "discordId");
  const setClause = fields.map((f) => `${f} = ?`).join(", ");
  const values = fields.map((f) => data[f]);

  let query = `UPDATE ${table} SET ${setClause} WHERE ${whereName} = ?`;
  if (limit) query += ` LIMIT ${limit}`;

  db.prepare(query).run(...values, whereVal);
}

export function tableExists(db: Database.Database, name: string): boolean {
  const row = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(name);
  return !!row;
}

export function createTable(db: Database.Database, createSql: string, createIndexSql: string | null = null): void {
  db.exec(createSql);
  if (createIndexSql !== null) {
    db.exec(createIndexSql);
  }
}

export function initDb(
  filePath: string,
  tableName: string,
  createSql: string,
  createIndexSql: string | null = null
): { conn: Database.Database } {
  const dir = require("path").dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(filePath);
  db.pragma("journal_mode = WAL");

  const newDBObject = { conn: db };

  if (!tableExists(db, tableName)) {
    createTable(db, createSql, createIndexSql);
  }

  logger.info(`Connected to the ${tableName} database.`);
  return newDBObject;
}
