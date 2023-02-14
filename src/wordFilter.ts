const fs = require("fs");

const worldList = [];
const worldListFile = "src/bannedWords.txt";

try {
  const data = fs.readFileSync(worldListFile, "utf8");
  worldList.push(...data.trim().split("\n"));
  console.log(`Loaded banned words list...`);
} catch (err) {
  console.error(`Error loading banned words list ${worldListFile}`, err);
}

export function containsBannedWord(message) {
  for (const word of worldList) {
    if (message.includes(word)) {
      return true;
    }
  }
  return false;
}

export function stripString(string) {
  return string.trim().replace(/[^\w\s]/gi, "");
}
