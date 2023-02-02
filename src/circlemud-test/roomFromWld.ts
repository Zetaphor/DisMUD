// Loads a wld text file, converts a single room to JSON
import parseWorld from "./wldToJson";

const fs = require("fs");

const worldNum = 9;
const roomNum = 914;

fs.readFile(`src/circlemud-test/world/wld/${worldNum}.wld`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const roomStart = data.indexOf(`#${roomNum}`);
  const roomEnd = data.indexOf("S\n", roomStart) + 1;
  console.log(roomStart, roomEnd);
  const roomData = [data.substring(roomStart, roomEnd)];
  console.log(parseWorld(roomData));
});
