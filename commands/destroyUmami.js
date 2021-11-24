const { execSync, spawnSync } = require("child_process");

const removeCertificate = require("../aws/sdk/removeCertificate");
const removeDNSRecord = require("../cloudflare/removeDNSRecord");
const removeEnvVariables = require('../utils/removeEnvVariables');

async function getPrefix() {
  return spawnSync("npm", ["config", "get", "prefix"]);
}

async function destroyUmami() {
  try {
    const basePath = (await getPrefix()).stdout
      .toString()
      .replace(/[\r\n\t\v]/g, "");

    execSync(
      "cdk destroy -f",
      {
        stdio: "inherit",
        cwd: basePath + "/lib/node_modules/able",
      },
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
          console.log("exec error: " + error);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

(async () => {
  await destroyUmami();
  await removeCertificate();
  await removeDNSRecord();
  removeEnvVariables(['CERTIFICATE_ARN', 'UMAMI_DNS_ID', 'DNS_ID'])
})();
