const configDir = require("./configDir");
const fs = require("fs");
require("dotenv").config({ path: `${configDir}/.env` });

// Appends a new ENV pair to the end of the .env file.  Does not currently replace the existing value of a pre-existing entry.
function writeToEnv(config) {
  Object.entries(config).forEach((pair) => {
    process.env[pair[0]] = pair[1];
    fs.appendFileSync(`${configDir}/.env`, `\n${pair[0]}=${pair[1]}`);
  });
}

module.exports = writeToEnv;
