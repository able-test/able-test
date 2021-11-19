const { execSync } = require("child_process");

const createCertificate = require("../aws/sdk/createCertificate");
const attachLoadBalancer = require("../aws/sdk/attachLoadbalancerToDomain");
const insertTables = require("../aws/sdk/insertTablesInDB");
const log = require("../utils/log");

(async () => {
  try {
    await createCertificate();

    execSync(
      "cdk synth",
      { stdio: "inherit" },
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
          console.log("exec error: " + error);
        }
      }
    );

    execSync(
      "cdk deploy ",
      { stdio: "inherit" },
      function (error, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        if (error !== null) {
          console.log("exec error: " + error);
        }
      }
    );

    attachLoadBalancer();
    insertTables();
  } catch (err) {
    log(err);
  }
})();
