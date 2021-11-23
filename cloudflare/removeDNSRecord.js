const axios = require("axios");
const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });

async function removeDNSRecord() {
  try {
    const EMAIL = process.env.EMAIL;
    const API_KEY = process.env.API_KEY;
    const ZONE_ID = process.env.ZONE_ID;
    const DNS_ID = process.env.DNS_ID;
    const UMAMI_DNS_ID = process.env.UMAMI_DNS_ID;

    if (DNS_ID) {
      const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_ID}`;
      const headers = {
        "X-Auth-Email": EMAIL,
        "X-Auth-Key": API_KEY,
        "Content-Type": "application/json",
      };

      await axios.delete(url, { headers });
      console.log("Certificate validation record deleted")
    } else {
      console.log('There are no DNS records to remove')
    }

    if (UMAMI_DNS_ID) {
      const url2 = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${UMAMI_DNS_ID}`;
      await axios.delete(url2, { headers });
      console.log("Cloudflare record for Umami dashboard deleted")
    }

  } catch (err) {
    console.log(err);
  }
}

module.exports = removeDNSRecord;
