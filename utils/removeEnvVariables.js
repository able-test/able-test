const configDir = require("./configDir");
const fs = require("fs");
const writeToEnv = require("./writeToEnv");
require("dotenv").config({ path: `${configDir}/.env` });

const envString = fs.readFileSync(
  `${configDir}/.env`,
  { encoding: "utf8" }
);

function removeEnvVariables(keys) { // keys is an array of strings
  let result = "";
  const pairStrings = envString.split('\n')
  .filter(pair => pair !== "");
  pairStrings.forEach(pairString => {
    const [ key, value ] = pairString.split("=");
    if (!keys.includes(key)) {
      result = result + `${key}=${value}\n`;
    }
  })
  fs.writeFileSync(`${configDir}/.env`, result);
}

module.exports = removeEnvVariables;