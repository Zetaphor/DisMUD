const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");

/**
 * Check if a record exists in the database
 * @param {any} db - database connection object
 * @param {String} table - table name
 * @param {String} key - key column name
 * @param {any} val - key value to check for
 * @returns {Promise<Boolean>} - returns a promise that resolves to true if record exists, false otherwise
 */
export function recordExists(db: any, table: String, key: String, val: any) {
  return new Promise<Boolean>((resolve, reject) => {
    db.get(`SELECT * FROM ${table} WHERE ${key} = "${val}" LIMIT 1`, (err, row) => {
      if (err) {
        console.error("Failed to check for existing record:", err);
        reject();
      }
      if (row) resolve(true);
      resolve(false);
    });
  });
}

/**
 * Get a record from the database
 * @param db - database connection object
 * @param table - table name
 * @param key - key column name
 * @param val - key value to check for
 * @returns {Promise<any>}- returns a promise that resolves to the record if it exists, null otherwise
 */
export function getRecord(db: any, table: String, key: String, val: any) {
  return new Promise<any>((resolve, reject) => {
    db.get(`SELECT * FROM ${table} WHERE ${key} = "${val}" LIMIT 1`, (err, row) => {
      if (err) {
        console.error("Failed to get record:", err);
        reject();
      }
      resolve(row);
    });
  });
}

/**
 * Get all recoes from the database
 * @param db - database connection object
 * @param table - table name
 * @returns {Array<any>} - returns an array of records
 */
export function getAllRecords(db: any, table: String, orderBy = "id") {
  return new Promise<any[]>((resolve, reject) => {
    db.all(`SELECT * FROM ${table} ORDER BY ${orderBy}`, (err, rows) => {
      if (err) {
        console.error("Failed to get records:", err);
        reject();
      }
      resolve(rows);
    });
  });
}

/**
 * Create a new record in the database
 * @param {any} db - database connection object
 * @param {String} table - table name
 * @param {Object} data - data to be inserted into the table
 * @returns {Promise<void>} - returns a promise that resolves when the record is created
 */
export function createRecord(db: any, table: String, data: Object) {
  return new Promise<void>((resolve, reject) => {
    const fields = Object.keys(data);

    let values = "";
    Object.values(data).forEach((value) => {
      if (value === "DEFAULT") values += "DEFAULT,";
      else if (typeof value === "string") values += `"${value}",`;
      else values += `${value},`;
    });
    values = values.slice(0, -1);

    const query = `
      INSERT INTO ${table} (${fields.join(", ")})
      VALUES (${values})
    `;

    db.run(query, function (err) {
      if (err) {
        console.error(`${table} create error:`, err, "\n", query, "\n", values);
        reject();
      } else {
        // console.info(`${table} row(s) created: ${this.changes}`);
        resolve(this.lastID);
      }
    });
  });
}

/**
 * Remove a record from the database
 * @param {any} db - database connection object
 * @param {String} table - table name
 * @param {Number} id - id to remove
 * @returns {Promise<void>} - returns a promise that resolves when the record is deleted
 */
export function removeRecord(db: any, table: String, id: BigInt) {
  return new Promise<void>((resolve, reject) => {
    db.run(`DELETE FROM ${table} WHERE id = "${id}"`, function (err) {
      if (err) {
        console.error(`${table} delete error:`, err);
        reject();
      } else {
        console.info(`${table} row(s) deleted: ${this.changes}`);
        resolve();
      }
    });
  });
}

/**
 * Update an existing record in the database
 * @param {any} db - database connection object
 * @param {String} table - table name
 * @param {Object} data - data to be updated in the table
 * @param {String} whereName - column name to filter the records by
 * @param {any} whereVal - value to filter the records by
 * @param {Number} limit - number of records to update (default 0)
 * @returns {Promise<void>} - returns a promise that resolves when the record is updated
 */
export function updateRecord(db: any, table: String, data: Object, whereName: String, whereVal: any, limit = 0) {
  return new Promise<void>((resolve, reject) => {
    const fields = Object.keys(data);

    let setFields = "";
    Object.values(fields).forEach((field) => {
      if (field === "discordId") return;
      if (data[field] === "DEFAULT") setFields += `${field}=DEFAULT,`;
      else if (typeof data[field] === "string") setFields += `${field}="${data[field]}",`;
      else setFields += `${field}=${data[field]},`;
    });
    setFields = setFields.slice(0, -1);

    if (typeof whereVal === "string") whereVal = `"${whereVal}"`;
    let query = `UPDATE ${table} SET ${setFields} WHERE ${whereName}=${whereVal}`;

    if (limit) query += ` LIMIT ${limit}`;

    db.run(query, function (err) {
      if (err) {
        console.error("Update error:", err, "\n", query, "\n", setFields);
        reject();
      } else {
        // console.info(`${table} row(s) updated: ${this.changes}`);
        resolve();
      }
    });
  });
}

/**
 * Check if a table exists in a database
 * @param {any} db - The database connection
 * @param {String} name - The name of the table to check
 * @returns {Promise<boolean>} - A Promise that resolves to true if the table exists, false otherwise
 */
export function tableExists(db: any, name: String) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='${name}'`, function (err, row) {
      if (err) {
        console.error("Table Exists:", err);
        reject();
      } else if (!row) resolve(false);
      else resolve(true);
    });
  });
}

/**
 * Create a table in a database
 * @param {any} db - The database connection
 * @param {String} createSql - The SQL statement for creating the table
 * @param {String} [createIndexSql=null] - The SQL statement for creating an index for the table
 * @returns {Promise<void>} - A Promise that resolves when the table has been created
 */
export function createTable(db: any, createSql: String, createIndexSql = null) {
  return new Promise<void>((resolve, reject) => {
    db.run(createSql, (err) => {
      if (err) {
        console.error("Create Table:", err);
        reject();
        return;
      } else {
        if (createIndexSql === null) resolve();
        else {
          db.run(createIndexSql, (err) => {
            if (err) {
              console.error("Create Table Index:", err);
              reject();
              return;
            }
          });
          resolve();
        }
      }
    });
  });
}

/**
 * Wait for a file to be created
 * @param {String} file - The path of the file to wait for
 * @returns {Promise<void>} - A Promise that resolves when the file has been created
 */
export function waitForFile(file: String) {
  return new Promise<void>((resolve, reject) => {
    const waitInterval = setInterval(() => {
      fs.unwatchFile(file);
      clearInterval(waitInterval);
      console.info("Timed out waiting for file:", file);
      reject();
    }, 2000);

    fs.watchFile(file, () => {
      clearInterval(waitInterval);
      fs.unwatchFile(file);
      resolve();
      return;
    });
  });
}

/**
 * Initializes a SQLite database and returns a Promise that resolves to a newDBObject.
 * @param {string} filePath - The file path for the SQLite database.
 * @param {string} tableName - The name of the table to be created or checked for existence.
 * @param {string} createSql - The SQL statement used to create the table.
 * @param {string} [createIndexSql=null] - The SQL statement used to create an index for the table.
 * @returns {Promise} Resolves to a newDBObject containing a connection to the database and the methods object.
 */
export async function initDb(filePath, tableName, createSql, createIndexSql = null) {
  const newDBObject = {
    conn: null,
  };

  await createDBFile(filePath);

  return new Promise((resolve, reject) => {
    newDBObject["conn"] = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error(`Failed to open database ${filePath}:`, err);
        reject(err);
      }
      console.info(`Connected to the ${tableName} database.`);
      tableExists(newDBObject["conn"], tableName)
        .then((exists) => {
          if (exists) resolve(newDBObject);
          else {
            createTable(newDBObject["conn"], createSql, createIndexSql)
              .then(() => {
                resolve(newDBObject);
              })
              .catch((err) => {
                console.error("Failed to create table:", err);
                reject(err);
              });
          }
        })
        .catch((err) => {
          console.error("Failed to check for existing table:", err);
          reject(err);
        });
    });
  });
}

/**
 * Initializes a SQLite database and makes sure the file was created
 * @param {string} filePath - The file path for the SQLite database.
 * @returns {Promise} A Promise that resolves when the database has been created
 */
export function createDBFile(filePath) {
  return new Promise<void>((resolve, reject) => {
    let db = null;
    db = new sqlite3.Database(filePath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
      if (err) {
        console.error(`Failed to open database ${filePath}:`, err);
        reject(err);
      } else {
        db.serialize(function () {
          db.run("PRAGMA journal_mode = wal;", function (err) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              db.close();
              resolve();
            }
          });
        });
      }
    });
  });
}
