// Converts a zone file to JSON
export default function parseZon(zone) {
  const lines = zone.split("\n");
  lines.splice(-3, 3);

  const newZone = {};
  newZone["id"] = parseInt(lines[0].slice(1));
  newZone["name"] = lines[1].slice(0, -1);

  const topLifespanReset = lines[2].split(" ");
  newZone["topRoom"] = topLifespanReset[0];
  newZone["lifespan"] = topLifespanReset[1];
  newZone["resetMode"] = topLifespanReset[2];
  newZone["commands"] = [];

  let lastMob = {};
  let lastObj = {};

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("*")) continue;
    const lineParts = lines[i].split(" ");
    if (lineParts[0] === "M") {
      lastMob = {
        type: "loadMob",
        ifFlag: lineParts[1],
        mobNum: lineParts[2],
        maxExisting: lineParts[3],
        roomNum: lineParts[4],
        objects: [],
        equip: [],
      };
      newZone["commands"].push(lastMob);
    } else if (lineParts[0] === "O") {
      lastObj = {
        type: "loadObj",
        ifFlag: lineParts[1],
        objNum: lineParts[2],
        maxExisting: lineParts[3],
        roomNum: lineParts[4],
        contains: [],
      };
      newZone["commands"].push(lastObj);
    } else if (lineParts[0] === "G") {
      lastMob["objects"].push(lineParts[2]);
    } else if (lineParts[0] === "E") {
      lastMob["equip"].push({
        position: lineParts[4],
        objNum: lineParts[2],
      });
    } else if (lineParts[0] === "P") {
      lastObj["contains"].push({
        sourceNum: lineParts[2],
      });
    } else if (lineParts[0] === "D") {
      newZone["commands"].push({
        type: "setDoor",
        ifFlag: lineParts[1],
        roomNum: lineParts[2],
        exitNum: lineParts[3],
        state: lineParts[4],
      });
    } else if (lineParts[0] === "R") {
      newZone["commands"].push({
        type: "removeObj",
        ifFlag: lineParts[1],
        roomNum: lineParts[2],
        objNum: lineParts[3],
      });
    }
  }

  // console.log(newZone);
  return newZone;
}
