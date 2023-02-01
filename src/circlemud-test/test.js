const worldFile = `#18629
#900
On The Swift Flowing River~
   As the river exits the city of Midgaard it picks up speed and whisks
you along.
~
9 0 7
D1
~
~
0 -1 3200
D3
~
~
0 -1 901
S
The Delta~
   You are at the edge of the river delta, where the river empties
out on its way to the sea.
~
9 0 7
D0
~
~
0 -1 911
D1
~
~
0 -1 903
D2
~
~
0 -1 906
D3
~
~
0 -1 905
S
#914
The Lane~
   Bodies lie everywhere.  Commoner, peasant, duke, duchess.  The Gods
will not hear you call here.
~
9 0 1
D0
~
~
0 -1 913
D2
~
~
0 -1 915
E
sign cave~
A sign beside the dark cave opening reads:

   WARNING! Only fools and dead people pass this way.
   The tests of Minos, our glorious ruler, await.

~
S`;

function parseWorldFile(worldFile) {
  let currentRoom;
  let rooms = [];
  let lines = worldFile.split("\n");
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

  return JSON.stringify(rooms);
}

console.log(parseWorldFile(worldFile));
