// Loads a obj text file, converts the objects to JSON, and exports a JSON file.
import parseObjsFromObj from "./objsToObjsArray";
import parseObj from "./objToJson";

const fs = require("fs");

const objNum = 50;

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
