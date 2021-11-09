const configDir = require("./configDir");
const fs = require("fs");
require("dotenv").config({ path: `${configDir}/.env` });

const writeToEnv = (name, val) => {
  process.env[name] = val;
  fs.appendFileSync(`${configDir}/.env`, `\n${name}=${val}`);
};

module.exports = writeToEnv;
