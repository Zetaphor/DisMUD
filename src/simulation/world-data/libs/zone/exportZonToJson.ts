// Loads a zon text file, converts the zone to JSON, and exports a JSON file.
import parseZon from "./zonToJson";

const fs = require("fs");

const zonNum = 9;

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
