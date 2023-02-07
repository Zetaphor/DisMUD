// Converts an array of obj objects to JSON.
export default function parseObj(objText) {
  const lines = objText.split("\n");
  lines.splice(-1, 1);

  let newObj = { extra: {}, affects: [] };
  newObj["id"] = parseInt(lines[0].slice(1));
  newObj["aliases"] = lines[1].slice(0, -1).toLowerCase().split(" ");
  newObj["shortDesc"] = lines[2].slice(0, -1);
  newObj["longDesc"] = lines[3].endsWith("~") ? lines[3].slice(0, -1) : lines[3];
  newObj["actionDesc"] = lines[4] === "~" ? "" : lines[4];

  const typeExtraWear = lines[5].split(" ");
  newObj["type"] = typeExtraWear[0];
  newObj["extra"] = typeExtraWear[1];
  newObj["wear"] = typeExtraWear[2];

  newObj["values"] = lines[6].split(" ");

  const weightCostRent = lines[7].split(" ");
  newObj["weight"] = weightCostRent[0];
  newObj["cost"] = weightCostRent[1];
  newObj["rent"] = weightCostRent[2];

  let inExtra = false;
  for (let i = 9; i < lines.length; i++) {
    if (inExtra) {
      if (lines[i] !== "~") newObj["extra"]["desc"] += ` ${lines[i]}`;
      else {
        inExtra = false;
      }
    } else if (lines[i] === "A") {
      const affect = lines[i + 1].split(" ");
      newObj.affects.push({
        location: affect[0],
        value: affect[1],
      });

      i++;
    }

    if (lines[i] === "E") {
      inExtra = true;
      newObj["extra"] = {
        keywords: lines[i + 1].slice(0, -1).toLowerCase().split(" "),
        desc: lines[11],
      };

      for (let i = 12; i < lines.length; i++) {
        if (lines !== "~") newObj["extra"]["desc"] += ` ${lines[i]}`;
      }
    }
  }

  // console.log(newObj);
  return newObj;
}
