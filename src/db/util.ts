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
        console.log(`${table} row(s) updated: ${this.changes}`);
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
        console.log(`${table} row(s) updated: ${this.changes}`);
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
      console.log("Timed out waiting for file:", file);
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
