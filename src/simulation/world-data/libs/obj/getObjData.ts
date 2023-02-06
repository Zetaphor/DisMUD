// Loads a obj text file, converts a single obj to JSON
import parseObj from "./parseObj";

const fs = require("fs");

export default function getObjData(worldNum, objNum) {
  console.log(`Loading obj ${worldNum}/${objNum}`);
  return new Promise((resolve, reject) => {
    fs.readFile(`src/simulation/world-data/data/circlemud/obj/${worldNum}.obj`, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const objStart = data.indexOf(`#${worldNum}${objNum}`);
      const objEnd = data.indexOf("#", objStart) - 1;
      const objData = [data.substring(objStart, objEnd)];
      resolve(parseObj(objData)[0]);
    });
  });
}
