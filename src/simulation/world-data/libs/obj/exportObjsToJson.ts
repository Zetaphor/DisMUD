// Loads a obj text file, converts the objects to JSON, and exports a JSON file.
import parseObjsFromObj from "./objsToObjsArray";
import parseObj from "./objToJson";

const fs = require("fs");

const objNum = 9;

fs.readFile(`src/world/data/circlemud/obj/${objNum}.obj`, "utf-8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const objList = parseObjsFromObj(data);
  let parsedMobs = [];

  for (let i = 0; i < objList.length; i++) {
    parsedMobs.push(parseObj(objList[i]));
  }

  fs.writeFile(`src/world/data/json/obj/${objNum}.json`, JSON.stringify(parsedMobs), { flag: "w" }, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Wrote obj file " + objNum + " to json");
  });
});
