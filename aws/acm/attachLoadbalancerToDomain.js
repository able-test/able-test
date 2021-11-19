const {
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommand,
} = require("@aws-sdk/client-elastic-load-balancing-v2");
const axios = require("axios");
const configDir = require("../../utils/configDir.js");
require("dotenv").config({ path: `${configDir}/.env` });

async function getLoadBalancerDNSName() {
  try {
    const client = new ElasticLoadBalancingV2Client({ region: "us-east-1" });
    const command = new DescribeLoadBalancersCommand("");
    const response = await client.send(command);
    const loadBalancer = response.LoadBalancers.find((lb) => {
      return lb.LoadBalancerName.includes("AbleUmami");
    });
    const loadBalancerDNSName = loadBalancer.DNSName;
    return loadBalancerDNSName;
  } catch (e) {
    console.log("error", e);
  }
}

async function createLoadBalancerDNSRecord(dnsName) {
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ZONE_ID = process.env.ZONE_ID;

  const body = {
    type: "CNAME",
    name: "ableumami",
    content: dnsName,
    ttl: 1,
  };
  console.log("Create record in Cloudflare");
  try {
    await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`, // TODO: MAKE DYNAMIC
      JSON.stringify(body),
      {
        headers: {
          "X-Auth-Email": EMAIL, // TODO: MAKE DYNAMIC
          "X-Auth-Key": API_KEY, // TODO: MAKE DYNAMIC
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Success");
  } catch (e) {
    console.log(e);
  }
}

(async function () {
  const dnsName = await getLoadBalancerDNSName();
  await createLoadBalancerDNSRecord(dnsName);
})();
