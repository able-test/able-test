const axios = require("axios");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const log = require("../utils/log");

// This function assigns the worker to run on hits from the custom domain associated with the cloudflare page
// as well as the cloudflare page itself, by using route matching.  If there are multiple patterns this function
// can be run more than once to assign multiple subdomains or paths to the edge worker.
async function addWorkerToDomain() {
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ZONE_ID = process.env.ZONE_ID;
  const DOMAIN_PATTERN = process.env.DOMAIN_PATTERN;
  const WORKER_SCRIPT_NAME = process.env.WORKER_SCRIPT_NAME;

  log(`\nAssigning worker to ${DOMAIN_PATTERN}`);

  let body = {
    pattern: DOMAIN_PATTERN, // *.<usersDomainFromEnv/* will cover both www. and regular with additional paths at the end (all matches)
    script: WORKER_SCRIPT_NAME,
  };

  try {
    const result = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/workers/routes `,
      JSON.stringify(body),
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
      "\nFailed to assign worker to domain on Cloudflare. Please try again."
    );
  }
}

module.exports = addWorkerToDomain;
