// Converts an array of wld rooms to JSON.
const ROOM_DIRS = {
  0: "north",
  1: "east",
  2: "south",
  3: "west",
  4: "up",
  5: "down",
};

export default function parseWorld(roomList) {
  let rooms = [];
  for (let roomIndex = 0; roomIndex < roomList.length; roomIndex++) {
    if (!roomList[roomIndex].length) continue;
    const lines = roomList[roomIndex].split("\n");

    // Remove the blank line and the S elements at the end of the data
    lines.splice(-1, 1);

    // console.log(lines);
    let newRoom = { exits: {}, extra: { tags: [], desc: "" } };
    // console.log(lines[0]);
    newRoom["id"] = parseInt(lines[0].slice(1));
    newRoom["name"] = lines[1].slice(0, -1);
    newRoom["desc"] = lines[2];

    let parsingDescription = true;

    let exitIndexes = [];
    let extraIndexes = [];

    // Capture all desc lines
    for (let lineIndex = 3; lineIndex < lines.length; lineIndex++) {
      if (parsingDescription) {
        if (lines[lineIndex] !== "~") {
          newRoom["desc"] += " " + lines[lineIndex];
        } else {
          newRoom["desc"] = newRoom["desc"].trim();
          parsingDescription = false;

          // Zone, room and sector data comes immediately after desc
          if (typeof lines[lineIndex + 1] !== "undefined") {
            const zoneRoomSector = lines[lineIndex + 1].split(" ");
            newRoom["zoneNum"] = parseInt(zoneRoomSector[0]);
            newRoom["roomBitVector"] = zoneRoomSector[1] === "0" ? "" : zoneRoomSector[1];
            newRoom["sectorType"] = parseInt(zoneRoomSector[2]);
          }

          // console.log("Description:", newRoom["desc"], "\n");
          // console.log(newRoom["zoneNum"], newRoom["roomBitVector"], newRoom["sectorType"]);
        }
      } else {
        if (/^D[0-5]$/.test(lines[lineIndex])) {
          // console.log(`Found ${newRoom["id"]} doorIndex at line ${lineIndex + 1}: `, lines[lineIndex]);
          exitIndexes.push(lineIndex);
        } else if (lines[lineIndex] === "E") {
          // console.log(`Found ${newRoom["id"]} extraIndex at line ${lineIndex + 1}`, lines[lineIndex]);
          extraIndexes.push(lineIndex);
        }
      }
    }

    // Capture all exits
    for (let i = 0; i < exitIndexes.length; i++) {
      const currentExitIndex = exitIndexes[i];
      let nextExitIndex = exitIndexes[i + 1];
      if (typeof nextExitIndex === "undefined") nextExitIndex = lines.length;

      let newExit = {
        direction: parseInt(lines[currentExitIndex].slice(1)),
        desc: "",
        tags: [],
        flag: 0,
        keyNum: -1,
        roomId: -1,
      };

      if (lines[currentExitIndex + 1] !== "~") {
        newExit["desc"] = lines[currentExitIndex + 1];
      }

      let flagKeyLinked = null;

      if (
        typeof lines[currentExitIndex + 3] !== "undefined" &&
        lines[currentExitIndex + 3] !== "~" &&
        lines[currentExitIndex + 3].endsWith("~")
      ) {
        newExit["tags"] = lines[currentExitIndex + 3].slice(0, -1).split(" ");
        flagKeyLinked = lines[currentExitIndex + 4];
      } else if (typeof lines[currentExitIndex + 3] !== "undefined" && lines[currentExitIndex + 3] !== "~") {
        flagKeyLinked = lines[currentExitIndex + 3];
      } else if (lines[currentExitIndex + 3] === "~") {
        flagKeyLinked = lines[currentExitIndex + 4];
      }

      flagKeyLinked = flagKeyLinked.split(" ");
      newExit["flag"] = parseInt(flagKeyLinked[0]);
      newExit["keyNum"] = parseInt(flagKeyLinked[1]);
      newExit["roomId"] = parseInt(flagKeyLinked[2]);

      newRoom["exits"][ROOM_DIRS[newExit.direction]] = newExit;
      // console.log(newRoom["id"], newExit);
    }

    for (let i = 0; i < extraIndexes.length; i++) {
      const extraIndex = extraIndexes[i];
      newRoom["extra"]["tags"] = lines[extraIndex + 1].slice(0, -1).split(" ");
      // console.log(newRoom["extra"]["tags"]);

      for (let j = extraIndex + 2; j < lines.length - 1; j++) {
        if (lines[j] !== "~" && lines[j] !== "S") newRoom["extra"]["desc"] += lines[j] + " ";
      }
      // console.log(newRoom["extra"]["desc"]);
    }

    rooms.push(newRoom);
    // console.log(newRoom);
  }

  return rooms;
}
