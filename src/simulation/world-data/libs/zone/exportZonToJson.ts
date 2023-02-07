// Loads a zon text file, converts the zone to JSON, and exports a JSON file.
import parseZon from "./parseZon";

const fs = require("fs");

// const zonNum = 0;
// const zonNum = 9;
// const zonNum = 12;
// const zonNum = 15;
// const zonNum = 25; // Issue
// const zonNum = 30;
// const zonNum = 31;
// const zonNum = 33;
// const zonNum = 35;
// const zonNum = 36;
// const zonNum = 40; // Issue
// const zonNum = 50;
// const zonNum = 51;
// const zonNum = 52;
// const zonNum = 53;
// const zonNum = 54;
// const zonNum = 60;
// const zonNum = 61;
// const zonNum = 62;
// const zonNum = 63;
// const zonNum = 64;
// const zonNum = 65;
// const zonNum = 70;
// const zonNum = 71;
// const zonNum = 72;
// const zonNum = 73;
// const zonNum = 79;
// const zonNum = 120;
// const zonNum = 150;
// const zonNum = 186;

fs.readFile(`src/simulation/world-data/data/circlemud/zon/${zonNum}.zon`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const parsedZone = parseZon(data);

  fs.writeFile(
    `src/simulation/world-data/data/json/zon/${zonNum}.json`,
    JSON.stringify(parsedZone),
    { flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Wrote zon file " + zonNum + " to json");
    }
  );
});
