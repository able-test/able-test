const { ACMClient,
  DeleteCertificateCommand,
  ListCertificatesCommand } = require("@aws-sdk/client-acm");
const axios = require("axios");
const configDir = require("../../utils/configDir.js");
require("dotenv").config({ path: `${configDir}/.env` });

async function  getCertificate(domainName) {
  try {
    const client = new ACMClient({ region: "us-east-1" })
    const command = new ListCertificatesCommand('');
    const response = await client.send(command)
    const certificate = response.CertificateSummaryList.find(cert => {
      const regex = new RegExp(domainName, 'i');
      return regex.test(cert.DomainName);
    });

    return certificate;
  } catch(err) {
    console.log(err)
  }
}

async function removeCertificate() {
  try {
    const client = new ACMClient({ region: "us-east-1" })
    const certificate = await getCertificate(`ableUmami.${process.env.DOMAIN}`)
    const input = {
      CertificateArn: certificate.CertificateArn,
    }
    const command = new DeleteCertificateCommand(input)
    const response = await client.send(command);

    if (response['$metadata'].httpStatusCode === 200) {
      console.log('Certificate successfully removed');
    }
  } catch(err) {
    console.log(err);
  }
}

module.exports = removeCertificate;