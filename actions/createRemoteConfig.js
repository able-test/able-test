const axios = require("axios");
const fs = require("fs");
let config = require("../config.json");

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;

async function createRemoteConfig() {
  console.log("Creating remote config");
  let NAMESPACE_ID = process.env.NAMESPACE_ID;
  await axios.put(
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
}

module.exports = createRemoteConfig;
