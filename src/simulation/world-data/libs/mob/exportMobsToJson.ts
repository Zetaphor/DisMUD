// Loads a mob text file, converts the mobs to JSON, and exports a JSON file.
import parseMobsFromMob from "./parseMobsFromMob";
import parseMob from "./parseMob";
const fs = require("fs");

// const mobNum = 0;
// const mobNum = 9;
// const mobNum = 12;
// const mobNum = 15;
// const mobNum = 30;
// const mobNum = 31;
// const mobNum = 33;
// const mobNum = 35;
// const mobNum = 36;
// const mobNum = 40;
// const mobNum = 50;
// const mobNum = 51;
// const mobNum = 52;
// const mobNum = 53;
// const mobNum = 54;
// const mobNum = 60;
// const mobNum = 61;
// const mobNum = 62;
// const mobNum = 63;
// const mobNum = 64;
// const mobNum = 65;
// const mobNum = 70;
// const mobNum = 72;
// const mobNum = 79;
// const mobNum = 120;
// const mobNum = 150;
// const mobNum = 186;

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
7;
