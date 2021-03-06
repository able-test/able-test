const axios = require("axios");
let config = require(`${process.cwd()}/ableConfig.json`); // Values supplied from dashboard
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const log = require("../utils/log");

// This function takes the split ratio, script tags, and main/test branch urls and strores them in an edge KV store to be accessed by the edge worker at runtime.
async function createRemoteConfig() {
  log("\nCreating remote config");
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const NAMESPACE_ID = process.env.NAMESPACE_ID;

  try {
    const result = await axios.put(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces/${NAMESPACE_ID}/values/ab-config`,
      JSON.stringify(config),
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
      "\nFailed to create remote configuration on Cloudflare. Please try again."
    );
  }
}

module.exports = createRemoteConfig;
