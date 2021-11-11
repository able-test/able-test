const axios = require("axios");
const fs = require("fs");
let config = require("../config.json");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;

async function createRemoteConfig() {
  console.log("Creating remote config");
  let NAMESPACE_ID = process.env.NAMESPACE_ID;

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
