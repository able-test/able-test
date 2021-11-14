const axios = require("axios");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

// Activate the edge worker
async function enableWorker() {
  console.log("Enabling worker");
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const WORKER_SCRIPT_NAME = process.env.WORKER_SCRIPT_NAME;
  try {
    const result = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_SCRIPT_NAME}/subdomain`,
      JSON.stringify({ enabled: true }),
      {
        headers: {
          "X-Auth-Email": EMAIL,
          "X-Auth-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch {
    throw new Error(
      "\nFailed to enable worker on Cloudflare. Please try again."
    );
  }
}

module.exports = enableWorker;
