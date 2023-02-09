// Loads a wld text file, converts a single room to JSON
import parseWorld from "./parseWorld";

const fs = require("fs");

export default function getRoomData(worldNum, roomNum) {
  return new Promise((resolve, reject) => {
    fs.readFile(`src/simulation/world-data/data/circlemud/wld/${worldNum}.wld`, "utf-8", (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }

      const roomStart = data.indexOf(`#${worldNum}${roomNum}`);
      const roomEnd = data.indexOf("S\n", roomStart) + 1;
      const roomData = [data.substring(roomStart, roomEnd)];
      resolve(parseWorld(roomData)[0]);
    });
  });
}
