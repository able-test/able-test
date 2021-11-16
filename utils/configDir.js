const os = require("os");
const homedir = os.homedir();
const configDir = ".Able";

// Sets the folder that will hold the .env
module.exports = `${homedir}/${configDir}`;
