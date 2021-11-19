const configDir = require("./configDir");
require("dotenv").config({ path: `${configDir}/.env` });

// Validates presence of any values in the .env file. TODO: Perhaps beef up the quality of the checks here.
const validateConfig = () => {
  return (
    !!process.env.ACCOUNT_ID &&
    !!process.env.API_KEY &&
    !!process.env.EMAIL &&
    !!process.env.ZONE_ID
  );
};

module.exports = validateConfig;
