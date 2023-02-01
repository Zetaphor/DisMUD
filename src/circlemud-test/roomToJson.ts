export const parseWorldFile = (fileStr) => {
  let currentRoom;
  let rooms = [];
  let lines = fileStr.split("\n");
  let lineIndex = 0;

  while (lineIndex < lines.length) {
    let line = lines[lineIndex];

    // parse the virtual room number
    if (line.startsWith("#")) {
      currentRoom = {};
      currentRoom.virtualNumber = line.substring(1);
      lineIndex++;
    }
    // parse the room name
    else if (line.endsWith("~")) {
      currentRoom.roomName = line.substring(0, line.length - 1);
      lineIndex++;
    }
    // parse the room description
    else if (line.endsWith("~")) {
      currentRoom.roomDescription = line.substring(0, line.length - 1);
      lineIndex++;
    }
    // parse the zone number, room bitvector, and sector type
    else if (line.split(" ").length === 3) {
      let lineParts = line.split(" ");
      currentRoom.zoneNumber = lineParts[0];
      currentRoom.roomBitvector = lineParts[1];
      currentRoom.sectorType = lineParts[2];
      lineIndex++;
    }
    // parse the direction fields
    else if (line.startsWith("D")) {
      let lineParts = line.split(" ");
      let directionNumber = lineParts[0].substring(1);
      currentRoom.directions = currentRoom.directions || {};
      currentRoom.directions[directionNumber] = {
        generalDescription: lines[lineIndex + 1].substring(0, lines[lineIndex + 1].length - 1),
        keywordList: lines[lineIndex + 2].substring(0, lines[lineIndex + 2].length - 1),
        doorFlag: lineParts[1],
        keyNumber: lineParts[2],
        roomLinked: lineParts[3],
      };
      lineIndex += 3;
    }
    // parse extra descriptions
    else if (line.startsWith("E")) {
      currentRoom.extraDescriptions = currentRoom.extraDescriptions || [];
      currentRoom.extraDescriptions.push({
        keywordList: lines[lineIndex + 1].substring(0, lines[lineIndex + 1].length - 1),
        descriptionText: lines[lineIndex + 2].substring(0, lines[lineIndex + 2].length - 1),
      });
      lineIndex += 3;
    }
    // end of room
    else if (line === "S") {
      rooms.push(currentRoom);
      lineIndex++;
    } else {
      lineIndex++;
    }
  }

  return rooms;
};
