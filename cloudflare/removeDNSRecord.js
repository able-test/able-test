const axios = require("axios");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

async function removeDNSRecord(recordId) {
  try {
    const EMAIL = process.env.EMAIL;
    const API_KEY = process.env.API_KEY;
    const ZONE_ID = process.env.ZONE_ID;
    const DNS_ID = process.env.DNS_ID;

    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_ID}`;
    const headers = {
      "X-Auth-Email": EMAIL,
      "X-Auth-Key": API_KEY,
      "Content-Type": "application/json",
    };

    await axios.delete(url, { headers });
  } catch (err) {
    console.log(err);
  }
}

module.exports = removeDNSRecord;
