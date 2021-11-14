const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data"); // Axios has errors with the Cloudflare API on this route
const fetch = require("node-fetch"); // Must use older version, newer versions are incompatible, check package.json for version number
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const WORKER_SCRIPT_NAME = process.env.WORKER_SCRIPT_NAME;

// This function creates sends the edge worker script in file abworker.js and attaches it to the namespace given.
async function createWorker() {
  let namespace = fs.readFileSync("namespace.json", { encoding: "utf8" });
  const NAMESPACE_ID = JSON.parse(namespace).namespace_id;
  console.log("Creating worker");
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
