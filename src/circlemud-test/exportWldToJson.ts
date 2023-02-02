// Loads a wld text file, converts the rooms to JSON, and exports a JSON file.
import parseRoomsFromWld from "./wldToRoomsArray";
import parseWorld from "./wldToJson";

const fs = require("fs");

const worldNum = 9;

fs.readFile(`src/circlemud-test/world/wld/${worldNum}.wld`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const roomList = parseRoomsFromWld(data);

  const parsedRooms = parseWorld(roomList);

  fs.writeFile(`src/circlemud-test/json/wld/${worldNum}.json`, JSON.stringify(parsedRooms), { flag: "w" }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Wrote world " + worldNum + " to json");
  });
});
