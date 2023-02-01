export default function parseWorld(roomList) {
  let rooms = [];
  for (let roomIndex = 0; roomIndex < roomList.length; roomIndex++) {
    const lines = roomList[roomIndex].split("\n");

    // Remove the blank line and the S elements at the end of the data
    lines.splice(-2, 2);

    // console.log(lines);
    let newRoom = { exits: [], extra: { keywords: [], description: "" } };
    newRoom["virtualNum"] = parseInt(lines[0].slice(1));
    newRoom["name"] = lines[1];
    newRoom["description"] = lines[2];

    let parsingDescription = true;
    let parsingExit = false;
    let setExitDescription = false;
    let parsingExtraDescriptions = false;

    let exitIndexes = [];
    let extraIndexes = [];

    // Capture all description lines
    for (let lineIndex = 3; lineIndex < lines.length; lineIndex++) {
      if (parsingDescription) {
        if (lines[lineIndex] !== "~") {
          newRoom["description"] += " " + lines[lineIndex];
        } else {
          newRoom["description"] = newRoom["description"].trim();
          parsingDescription = false;

          // Zone, room and sector data comes immediately after description
          const zoneRoomSector = lines[lineIndex + 1].split(" ");
          newRoom["zoneNum"] = parseInt(zoneRoomSector[0]);
          newRoom["roomBitVector"] = zoneRoomSector[1] === "0" ? "" : zoneRoomSector[1];
          newRoom["sectorType"] = parseInt(zoneRoomSector[2]);

          // console.log("Description:", newRoom["description"], "\n");
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
        description: "",
        keywords: [],
        flag: 0,
        keyNum: -1,
        linkedRoom: -1,
      };

      const flagKeyLinked = lines[nextExitIndex - 1].split(" ");
      if (flagKeyLinked.length === 3) {
        newExit["flag"] = parseInt(flagKeyLinked[0]);
        newExit["keyNum"] = parseInt(flagKeyLinked[1]);
        newExit["linkedRoom"] = parseInt(flagKeyLinked[2]);
        // console.log(newExit["flag"], newExit["keyNum"], newExit["linkedRoom"]);
      }

      if (lines[nextExitIndex - 2].length !== 1 && lines[nextExitIndex - 2].endsWith("~")) {
        newExit["keywords"] = lines[nextExitIndex - 2].slice(0, -1).split(" ");
        // console.log(newExit["keywords"]);
      }

      if (lines[currentExitIndex + 1] !== "~") {
        for (let j = currentExitIndex + 1; j < nextExitIndex - 2; j++) {
          if (lines[j] !== "~") {
            newExit["description"] += lines[j] + " ";
          } else j = nextExitIndex;
        }
        newExit["description"] = newExit["description"].trim();
        // console.log(newExit.description);
      }

      newRoom["exits"].push(newExit);
      // console.log(newRoom["virtualNum"], newExit);
    }

    for (let i = 0; i < extraIndexes.length; i++) {
      const extraIndex = extraIndexes[i];
      newRoom["extra"]["keywords"] = lines[extraIndex + 1].slice(0, -1).split(" ");
      // console.log(newRoom["extra"]["keywords"]);

      for (let j = extraIndex + 2; j < lines.length - 1; j++) {
        newRoom["extra"]["description"] += lines[j] + " ";
      }
      // console.log(newRoom["extra"]["description"]);
    }

    rooms.push(newRoom);
    // console.log(newRoom);
  }

  return rooms;
}
