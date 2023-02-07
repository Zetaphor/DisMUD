// Loads a obj text file, converts the objects to JSON, and exports a JSON file.
import parseObjsFromObj from "./parseObjsFromObj";
import parseObj from "./parseObj";

const fs = require("fs");

// const objNum = 0;
// const objNum = 9;
// const objNum = 12; // Issue
// const objNum = 120;
// const objNum = 15;
// const objNum = 150;
// const objNum = 186;
// const objNum = 25;
// const objNum = 30;
// const objNum = 31;
// const objNum = 33;
// const objNum = 35;
// const objNum = 36;
// const objNum = 40;
// const objNum = 50;
// const objNum = 51;
// const objNum = 52;
// const objNum = 53;
// const objNum = 54;
// const objNum = 60;
// const objNum = 61;
// const objNum = 62;
// const objNum = 63;
// const objNum = 64;
// const objNum = 65;
// const objNum = 70;
// const objNum = 71;
// const objNum = 72;
const objNum = 79;

fs.readFile(`src/simulation/world-data/data/circlemud/obj/${objNum}.obj`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const objList = parseObjsFromObj(data);
  let parsedObjs = [];

  for (let i = 0; i < objList.length; i++) {
    parsedObjs.push(parseObj(objList[i]));
  }

  // console.log(parsedObjs);

  fs.writeFile(
    `src/simulation/world-data/data/json/obj/${objNum}.json`,
    JSON.stringify(parsedObjs),
    { flag: "w" },
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Wrote obj file " + objNum + " to json");
    }
  );
});
