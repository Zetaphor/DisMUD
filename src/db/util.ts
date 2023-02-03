const fs = require("fs");

export function recordExists(db: any, table: String, key: String, val: any) {
  db.get(`SELECT * FROM ${table} WHERE ${key} = "${val}" LIMIT 1`, (err, row) => {
    if (err) {
      console.error("Failed to check for existing record:", err);
    }
    if (row) return true;
    return false;
  });
}

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

export function createTable(db: any, createSql: String, createIndexSql = null) {
  return new Promise<void>((resolve, reject) => {
    db.run(createSql, (err) => {
      if (err) {
        console.error("Create Table:", err);
        reject();
        return;
      }
    });

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
  });
}

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
