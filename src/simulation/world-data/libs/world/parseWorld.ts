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
    const lines = roomList[roomIndex].split("\n");

    // Remove the blank line and the S elements at the end of the data
    lines.splice(-2, 2);

    // console.log(lines);
    let newRoom = { exits: {}, extra: { tags: [], desc: "" } };
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
          const zoneRoomSector = lines[lineIndex + 1].split(" ");
          newRoom["zoneNum"] = parseInt(zoneRoomSector[0]);
          newRoom["roomBitVector"] = zoneRoomSector[1] === "0" ? "" : zoneRoomSector[1];
          newRoom["sectorType"] = parseInt(zoneRoomSector[2]);

          // console.log("Description:", newRoom["desc"], "\n");
          // console.log(newRoom["zoneNum"], newRoom["roomBitVector"], newRoom["sectorType"]);
        }
      } else {
        if (/^D[0-5]/.test(lines[lineIndex])) {
          // console.log(`Found doorIndex at line ${lineIndex}`, lines[lineIndex]);
          exitIndexes.push(lineIndex);
        } else if (lines[lineIndex] === "E") {
          // console.log(`Found extraIndex at line ${lineIndex}`, lines[lineIndex]);
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

      const flagKeyLinked = lines[nextExitIndex - 1].split(" ");
      if (flagKeyLinked.length === 3) {
        newExit["flag"] = parseInt(flagKeyLinked[0]);
        newExit["keyNum"] = parseInt(flagKeyLinked[1]);
        newExit["roomId"] = parseInt(flagKeyLinked[2]);
        // console.log(newExit["flag"], newExit["keyNum"], newExit["roomId"]);
      }

      if (lines[nextExitIndex - 2].length !== 1 && lines[nextExitIndex - 2].endsWith("~")) {
        newExit["tags"] = lines[nextExitIndex - 2].slice(0, -1).split(" ");
        // console.log(newExit["tags"]);
      }

      if (lines[currentExitIndex + 1] !== "~") {
        for (let j = currentExitIndex + 1; j < nextExitIndex - 2; j++) {
          if (lines[j] !== "~") {
            newExit["desc"] += lines[j] + " ";
          } else j = nextExitIndex;
        }
        newExit["desc"] = newExit["desc"].trim();
        // console.log(newExit.desc);
      }

      newRoom["exits"][ROOM_DIRS[newExit.direction]] = newExit;
      // console.log(newRoom["id"], newExit);
    }

    for (let i = 0; i < extraIndexes.length; i++) {
      const extraIndex = extraIndexes[i];
      newRoom["extra"]["tags"] = lines[extraIndex + 1].slice(0, -1).split(" ");
      // console.log(newRoom["extra"]["tags"]);

      for (let j = extraIndex + 2; j < lines.length - 1; j++) {
        newRoom["extra"]["desc"] += lines[j] + " ";
      }
      // console.log(newRoom["extra"]["desc"]);
    }

    rooms.push(newRoom);
    // console.log(newRoom);
  }

  return rooms;
}
