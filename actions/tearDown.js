// Remove KV namespace
// Remove Worker
const fs = require("fs");
const axios = require("axios");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const WORKER_SCRIPT_NAME = process.env.WORKER_SCRIPT_NAME;

// Remove KV store and worker
async function teardown() {
  let namespace = fs.readFileSync("namespace.json", { encoding: "utf8" });

  if (!namespace) {
    console.log("No namespace found.");
    return;
  }
  const NAMESPACE_ID = JSON.parse(namespace).namespace_id;

  console.log("Removing KV Namespace");
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
  console.log("Removing edge worker");
  result = await axios.delete(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_SCRIPT_NAME}`,
    {
      headers: {
        "X-Auth-Email": EMAIL,
        "X-Auth-Key": API_KEY,
      },
    }
  );

  fs.writeFileSync("namespace.json", "");

  if (!result.data.success) {
    throw new Error(
      "Error removing worker from Cloudflare. Please try again or do so manually."
    );
  }
}

module.exports = teardown;
