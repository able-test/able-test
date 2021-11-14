const os = require("os");
const homedir = os.homedir();
const configDir = ".Able";

// Sets the folder that will hold the .env if we decide to set these from the dashboard.  Currently this isn't really being used, it just sends back the root of the project.
module.exports = `${homedir}/${configDir}`;
