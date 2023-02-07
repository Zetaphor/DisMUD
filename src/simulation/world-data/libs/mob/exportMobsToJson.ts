// Loads a mob text file, converts the mobs to JSON, and exports a JSON file.
import parseMobsFromMob from "./parseMobsFromMob";
import parseMob from "./parseMob";
const fs = require("fs");

const mobNum = 0;

fs.readFile(`src/simulation/world-data/data/circlemud/mob/${mobNum}.mob`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const mobList = parseMobsFromMob(data);
  let parsedMobs = [];

  for (let i = 0; i < mobList.length; i++) {
    parsedMobs.push(parseMob(mobList[i]));
  }

  // console.log(parsedMobs);

  fs.writeFile(
    `src/simulation/world-data/data/json/mob/${mobNum}.json`,
    JSON.stringify(parsedMobs),
    { flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Wrote mob file " + mobNum + " to json");
    }
  );
});
