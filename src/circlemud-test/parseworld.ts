import { parseWorldFile } from "./roomToJson";

const fs = require("fs");

let fileString = "";

fs.readFile("src/circlemud-test/world/wld/9.wld", "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const parsedRooms = parseWorldFile(data);

  // console.log(parsedRooms.length);

  // console.log(parsedRooms);

  fs.writeFile("src/circlemud-test/json/wld/9.json", JSON.stringify(parsedRooms), { flag: "w" }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Data written to file");
  });
});
