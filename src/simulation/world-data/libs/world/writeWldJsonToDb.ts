const fs = require("fs");
const path = require("path");

const directoryPath = path.join(__dirname, "directory");

fs.readdir("src/simulation/world-data/data/json/wld/", function (err, files) {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  files.forEach(function (file) {
    console.log(file);
  });
});
