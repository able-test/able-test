const configDir = require("./configDir");
const fs = require("fs");
require("dotenv").config({ path: `${configDir}/.env` });

// Appends a new ENV pair to the end of the .env file.  Does not currently replace the existing value of a pre-existing entry.
const writeToEnv = (name, val) => {
  process.env[name] = val;
  fs.appendFileSync(`${configDir}/.env`, `\n${name}=${val}`);
};

module.exports = writeToEnv;
