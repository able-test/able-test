const {
  ElasticLoadBalancingV2Client,
  DescribeLoadBalancersCommand,
} = require("@aws-sdk/client-elastic-load-balancing-v2");
const axios = require("axios");
const configDir = require("../../utils/configDir.js");
const writeToEnv = require("../../utils/writeToEnv.js");
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
  console.log("Creating record in Cloudflare for Umami dashboard");
  try {
    const response = await axios.post(
      `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records`,
      JSON.stringify(body),
      {
        headers: {
          "X-Auth-Email": EMAIL,
          "X-Auth-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    writeToEnv({ UMAMI_DNS_ID: response.data.result.id });
    console.log("Cloudflare record created for Umami dashboard");
  } catch (e) {
    console.log(e);
  }
}

async function attachLoadBalancer() {
  const dnsName = await getLoadBalancerDNSName();
  await createLoadBalancerDNSRecord(dnsName);
}

module.exports = attachLoadBalancer;
