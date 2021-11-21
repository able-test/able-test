const { spawnSync } = require("child_process");

const removeCertificate = require("../aws/sdk/removeCertificate");
const removeDNSRecord = require("../cloudflare/removeDNSRecord");

async function getPrefix() {
  return spawnSync("npm", ["config", "get", "prefix"]);
}

async function destroyUmami() {
  try {
    const basePath = (await getPrefix()).stdout
      .toString()
      .replace(/\r\n\t\v/g, "");

    spawnSync(
      "cdk",
      ["destroy"],
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

    removeDNSRecord();
    removeCertificate();
  } catch (err) {
    console.log(err);
  }
}

module.exports = destroyUmami;
