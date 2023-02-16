// Loads a wld text file, converts the rooms to JSON, and exports a JSON file.
import parseRoomsFromWld from "./parseRoomsFromWld";
import parseWorld from "./parseWorld";

const fs = require("fs");

// const worldNum = 0;
// const worldNum = 9;
// const worldNum = 12;
// const worldNum = 15;
// const worldNum = 25;
// const worldNum = 30;
// const worldNum = 31;
// const worldNum = 33;
// const worldNum = 35;
// const worldNum = 36;
// const worldNum = 40;
// const worldNum = 50;
// const worldNum = 51;
// const worldNum = 52;
// const worldNum = 53;
// const worldNum = 54;
// const worldNum = 60;
// const worldNum = 61;
// const worldNum = 62;
// const worldNum = 63;
// const worldNum = 64;
// const worldNum = 65;
// const worldNum = 70;
// const worldNum = 71;
// const worldNum = 72;
// const worldNum = 79;
// const worldNum = 120;
// const worldNum = 150;
// const worldNum = 186;

fs.readFile(`src/simulation/world-data/data/circlemud/wld/${worldNum}.wld`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const roomList = parseRoomsFromWld(data);

  const parsedRooms = parseWorld(roomList);

  fs.writeFile(
    `src/simulation/world-data/data/json/wld/${worldNum}.json`,
    JSON.stringify(parsedRooms),
    { flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Wrote world " + worldNum + " to json");
    }
  );
});
