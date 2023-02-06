// Loads a mob text file, converts the mobs to JSON, and exports a JSON file.
import parseMobsFromMob from "./mobToMobsArray";
import parseMob from "./mobToJson";

const fs = require("fs");

const mobNum = 9;

fs.readFile(`src/world/data/circlemud/mob/${mobNum}.mob`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const mobList = parseMobsFromMob(data);
  let parsedMobs = [];

  for (let i = 0; i < mobList.length; i++) {
    parsedMobs.push(parseMob(mobList[i]));
  }

  fs.writeFile(`src/world/data/json/mob/${mobNum}.json`, JSON.stringify(parsedMobs), { flag: "w" }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Wrote mob file " + mobNum + " to json");
  });
});
