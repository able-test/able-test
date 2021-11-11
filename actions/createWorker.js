const axios = require("axios");
const fs = require("fs");
let config = require("../config.json");
const FormData = require("form-data");
const fetch = require("node-fetch");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const WORKER_SCRIPT_NAME = process.env.WORKER_SCRIPT_NAME;

async function createWorker() {
  const NAMESPACE_ID = process.env.NAMESPACE_ID;
  console.log("Creating worker");
  console.log(NAMESPACE_ID);
  const workerScript = fs.readFileSync(`${__dirname}/abworker.js`, "utf8");
  const metadata = {
    body_part: "script",
    bindings: [
      {
        type: "kv_namespace",
        name: "DATA_STORE",
        namespace_id: NAMESPACE_ID,
      },
    ],
  };

  const form = new FormData();
  form.append("metadata", JSON.stringify(metadata));
  form.append("script", workerScript);

  const uploadWorker = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/workers/scripts/${WORKER_SCRIPT_NAME}/`,
    {
      method: "PUT",
      headers: {
        "X-Auth-Email": EMAIL,
        "X-Auth-Key": API_KEY,
      },
      body: form,
    }
  );

  if (!uploadWorker.ok) {
    throw new Error(
      "\nFailed to deploy worker to Cloudflare. Please try again."
    );
  }
}

module.exports = createWorker;
