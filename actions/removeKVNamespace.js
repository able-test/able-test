const axios = require("axios");
const log = require("../utils/log");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

async function removeKVNamespace() {
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ACCOUNT_ID = process.env.ACCOUNT_ID;
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
}
module.exports = removeKVNamespace;
