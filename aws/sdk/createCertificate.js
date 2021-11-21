const acm = require("@aws-sdk/client-acm");
const axios = require("axios");
const writeToEnv = require("../../utils/writeToEnv.js");
const configDir = require("../../utils/configDir.js");
require("dotenv").config({ path: `${configDir}/.env` });

async function wait(timeInSeconds) {
  await new Promise((resolve) => setTimeout(resolve, timeInSeconds * 1000));
}

async function requestCertificate() {
  const client = new acm.ACMClient({ region: "us-east-1" });
  const DOMAIN = process.env.DOMAIN;
  const input = {
    DomainName: `ableUmami.${DOMAIN}`, // TODO: MAKE DYNAMIC
    ValidationMethod: "DNS",
  };
  const command = new acm.RequestCertificateCommand(input);
  try {
    console.log("Creating certificate");
    const response = await client.send(command);
    return response.CertificateArn;
  } catch (e) {
    console.log(e);
  }
}

async function getCNAME(certificateArn) {
  const client = new acm.ACMClient({ region: "us-east-1" });
  const input = {
    CertificateArn: certificateArn,
  };

  const command = new acm.DescribeCertificateCommand(input);
  try {
    const response = await client.send(command);
    const { Name: name, Value: value } =
      response.Certificate.DomainValidationOptions[0].ResourceRecord;
    return { name, value };
  } catch (e) {
    console.log(e);
  }
}

async function createDNSRecord({ name, value }) {
  const EMAIL = process.env.EMAIL;
  const API_KEY = process.env.API_KEY;
  const ZONE_ID = process.env.ZONE_ID;

  const body = {
    type: "CNAME",
    name,
    content: value,
    ttl: 1,
  };
  console.log("Create DNS entry in Cloudflare");
  const response = await axios.post(
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

  writeToEnv({ DNS_ID: response.data.result.id });
}

async function waitUntilCertificateValidated(certificateArn) {
  try {
    const secondsPerMinute = 60;
    const maxMinutes = 20;
    const minDelay = 15;
    const maxDelay = 30;
    const maxWaitTime = maxMinutes * secondsPerMinute;
    const client = new acm.ACMClient({ region: "us-east-1" });
    const waiterConfig = { client, maxWaitTime, minDelay, maxDelay };
    const certificateDetails = { CertificateArn: certificateArn };

    console.log(
      "Waiting for certificate to be validated. Please wait a few minutes"
    );
    await acm.waitUntilCertificateValidated(waiterConfig, certificateDetails);
  } catch (err) {
    if (err.name === "TimeoutError") {
      console.log("Validating Certificate timed out please try again later");
    } else {
      console.log(e);
    }
  }
}

async function createCertificate() {
  const certificateArn = await requestCertificate();
  await wait(30);
  const certificateDetails = await getCNAME(certificateArn);
  await createDNSRecord(certificateDetails);
  writeToEnv({ CERTIFICATE_ARN: certificateArn });
  await waitUntilCertificateValidated(certificateArn);
  console.log("Success");
}

module.exports = createCertificate;
