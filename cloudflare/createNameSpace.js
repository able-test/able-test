const axios = require("axios");
const writeToEnv = require("../utils/writeToEnv");
const log = require("../utils/log");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

async function createNameSpace() {
  log("\nCreating namespace");
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
  const TITLE = process.env.TITLE;

  try {
    let res = await axios.post(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces`,
      JSON.stringify({ title: TITLE }),
      {
        headers: {
          "X-Auth-Email": EMAIL,
          "X-Auth-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    let namespaceId = { NAMESPACE_ID: res.data.result.id };
    writeToEnv(namespaceId);
  } catch {
    throw new Error(
      "\nFailed to create namespace on Cloudflare. Please try again."
    );
  }
}

module.exports = createNameSpace;
