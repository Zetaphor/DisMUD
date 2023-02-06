// Loads a mob text file, converts a single mob to JSON
import parseMob from "./parseMob";

const fs = require("fs");

export default function getObjData(worldNum, mobNum) {
  console.log(`Loading mob ${worldNum}/${mobNum}`);
  return new Promise((resolve, reject) => {
    fs.readFile(`src/simulation/world-data/data/circlemud/mob/${worldNum}.mob`, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const mobStart = data.indexOf(`#${worldNum}${mobNum}`);
      const mobEnd = data.indexOf("#", mobStart) - 1;
      const mobData = [data.substring(mobStart, mobEnd)];
      resolve(parseMob(mobData)[0]);
    });
  });
}
