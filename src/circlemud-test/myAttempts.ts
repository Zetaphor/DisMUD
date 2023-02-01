import { parseWorldFile } from "./roomToJson";

export default function parseRooms(data) {
  const parsedRooms = parseWorldFile(data);
}

function roomsToJson(rooms) {
  // Initialize an array to store parsed rooms
  let parsedRooms = [];

  const dataStructure = {
    0: "virtualNumber",
    1: "roomName",
    2: "roomDescription",
    3: "zoneSectorData",
    4: "extraData",
  };

  let dataStructureIndex = 0;

  const dirDataStructure = {
    0: "dirNum",
    1: "dirDescription",
    2: "dirKeywords",
    3: "dirFlagKeyLinked",
  };

  let dirStructureIndex = 0;

  // Loop through each room in the array
  for (let room of rooms) {
    // Split the room string into lines
    let lines = room.split("\n");

    // Remove the last two element which is an empty string and the S
    lines.splice(-2, 2);

    let parsedRoom = { exits: [] };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      switch (dataStructureIndex) {
        case 0: // Virtual Number
          parsedRoom[dataStructure[dataStructureIndex]] = line;
          dataStructureIndex++;
          break;

        case 1: // Room Name
          parsedRoom[dataStructure[dataStructureIndex]] = line;
          dataStructureIndex++;
          break;

        case 2: // Room Description
          if (line != "~") {
            parsedRoom[dataStructure[dataStructureIndex]] += ` ${line}`;
          } else {
            dataStructureIndex++;
          }
          break;

        case 3: // Zone Sector Data
          const zoneSectorData = line.split(" ");
          parsedRoom["zoneNumber"] = zoneSectorData[0];
          parsedRoom["roomBitvector"] = zoneSectorData[1];
          parsedRoom["sectorType"] = zoneSectorData[2];
          dataStructureIndex++;
          break;

        case 4: // Extra Data
          if (/^D[0-5]/.test(line)) {
            const doorLines = lines.slice(i);
            console.log("Saw Doorline", doorLines);
            let keepReadingDoorlines = true;
            for (let j = 0; j < doorLines.length; j++) {
              const doorLine = doorLines[j];
              const newDir = {};

              if (doorLine === "E") {
                keepReadingDoorlines = false;
              }

              switch (dirStructureIndex) {
                case 0: // Dir Number
                  if (doorLine === "~") continue;
                  newDir[dirDataStructure[dirStructureIndex]] = doorLine;
                  dirStructureIndex++;
                  break;

                case 1: // Dir Description
                  if (doorLine !== "~") newDir[dirDataStructure[dirStructureIndex]] += ` ${doorLine}`;
                  else dirStructureIndex++;
                  break;

                case 2: // Dir Keywords
                  if (doorLine !== "~") newDir[dirDataStructure[dirStructureIndex]] = doorLine;
                  else newDir[dirDataStructure[dirStructureIndex]] = "";
                  dirStructureIndex++;

                case 3: // Dir Flag, Key, Linked Room
                  const flagKeyLinked = doorLine.split(" ");
                  newDir["dirFlag"] = flagKeyLinked[0];
                  newDir["dirKey"] = flagKeyLinked[1];
                  newDir["dirLinkedRoom"] = flagKeyLinked[2];
                  dirStructureIndex = 0;
                  break;
              }

              if (Object.keys(newDir).length) {
                console.log("newDir", newDir, "\n");
                parsedRoom.exits.push(newDir);
              }
            }
          }
          dataStructureIndex = 0;
          break;
      }
    }

    // console.log(parsedRoom);

    // Add the parsed room to the parsedRooms array
    parsedRooms.push(parsedRoom);
  }

  // Return the parsed rooms as a JSON object
  return parsedRooms;
}
