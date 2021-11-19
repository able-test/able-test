const acm = require("@aws-sdk/client-acm");
const axios = require("axios");

async function wait(timeInSeconds) {
  await new Promise((resolve) => setTimeout(resolve, timeInSeconds * 1000));
}

async function requestCertificate() {
  const client = new acm.ACMClient({ region: "us-east-1" });
  const input = {
    DomainName: "ableUmami.yujohnnattrass.dev", // TODO: MAKE DYNAMIC
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
    console.log("response", name, value);
    return { name, value };
  } catch (e) {
    console.log(e);
  }
}

async function createDNSRecord({ name, value }) {
  const body = {
    type: "CNAME",
    name,
    content: value,
    ttl: 1,
  };
  console.log("Create DNS entry in Cloudflare");
  await axios.post(
    "https://api.cloudflare.com/client/v4/zones/ZONEID/dns_records", // TODO: MAKE DYNAMIC
    JSON.stringify(body),
    {
      headers: {
        "X-Auth-Email": "EMAIL", // TODO: MAKE DYNAMIC
        "X-Auth-Key": "API KEY", // TODO: MAKE DYNAMIC
        "Content-Type": "application/json",
      },
    }
  );
}

(async function () {
  const certificateArn = await requestCertificate();
  await wait(30);
  const certificateDetails = await getCNAME(certificateArn);
  await createDNSRecord(certificateDetails);
  console.log("Success");
})();
