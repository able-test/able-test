const configDir = require("./configDir");
require("dotenv").config({ path: `${configDir}/.env` });

const validateConfig = () => {
  return (
    !!process.env.API_KEY &&
    !!process.env.EMAIL &&
    !!process.env.ACCOUNT_ID &&
    !!process.env.TITLE &&
    !!process.env.WORKER_SCRIPT_NAME &&
    !!process.env.DOMAIN_PATTERN &&
    !!process.env.ZONE_ID
  );
};

module.exports = validateConfig;
