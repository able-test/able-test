const axios = require("axios");
const log = require("../utils/log");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

// Remove KV store and worker
async function teardown() {
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const WORKER_SCRIPT_NAME = process.env.WORKER_SCRIPT_NAME;
  const NAMESPACE_ID = process.env.NAMESPACE_ID;

  if (!NAMESPACE_ID) {
    log("\nNo namespace found.");
    return;
  }

  log("Removing KV Namespace");
  let result = await axios.delete(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}`,
    {
      headers: {
        "X-Auth-Email": EMAIL,
        "X-Auth-Key": API_KEY,
      },
    }
  );

  if (!result.data.success) {
    throw new Error(
      "Error removing KV namespace from Cloudflare. Please try again or do so manually."
    );
  }
  log("\nRemoving edge worker\n");
  result = await axios.delete(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_SCRIPT_NAME}`,
    {
      headers: {
        "X-Auth-Email": EMAIL,
        "X-Auth-Key": API_KEY,
      },
    }
  );

  if (!result.data.success) {
    throw new Error(
      "Error removing worker from Cloudflare. Please try again or do so manually."
    );
  }
}

module.exports = teardown;
