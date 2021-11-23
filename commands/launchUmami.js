const { spawnSync } = require("child_process");

const createCertificate = require("../aws/sdk/createCertificate");
const attachLoadBalancer = require("../aws/sdk/attachLoadbalancerToDomain");
const insertTables = require("../aws/sdk/insertTablesInDB");

async function getPrefix() {
  return spawnSync("npm", ["config", "get", "prefix"]);
}

async function launchUmami() {
  try {
    await createCertificate();

    const basePath = (await getPrefix()).stdout
      .toString()
      .replace(/[\r\n\t\v]/g, "");

    spawnSync(
      "cdk",
      ["synth"],
      {
        stdio: "inherit",
        cwd: basePath + "/lib/node_modules/able",
      },
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
          console.log(error);
        }
      }
    );

    spawnSync(
      "cdk",
      ["deploy"],
      { stdio: "inherit", cwd: basePath + "/lib/node_modules/able" },
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
          console.log(error);
        }
      }
    );

    await attachLoadBalancer();
    await insertTables();
  } catch (err) {
    console.error(err);
  }
}

module.exports = launchUmami;
