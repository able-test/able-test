const axios = require("axios");
const fs = require("fs");
let config = fs.readFileSync("config.json");
const writeToEnv = require("../utils/writeToEnv");

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const TITLE = process.env.TITLE;

async function createNameSpace() {
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

  let NAMESPACE_ID = res.data.result.id;
  writeToEnv("NAMESPACE_ID", NAMESPACE_ID);
}

module.exports = createNameSpace;
