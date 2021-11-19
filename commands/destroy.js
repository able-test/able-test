const removeKVNamespace = require("../actions/removeKVNamespace");
const removeWorker = require("../actions/removeWorker");
const log = require("../utils/log");
const prompt = require("prompts");
const loadingBar = require("../utils/loadingBar");
const fs = require("fs");
const path = require("path");
const configDir = require("../utils/configDir");
const writeToEnv = require("../utils/writeToEnv");
require("dotenv").config({ path: `${configDir}/.env` });

const destroy = async () => {
  const destroy = loadingBar("\n*Dismantling A/B Test*\n");
  // Record original setup values
  const setup = {
    EMAIL: process.env.EMAIL,
    API_KEY: process.env.API_KEY,
    ACCOUNT_ID: process.env.ACCOUNT_ID,
    ZONE_ID: process.env.ZONE_ID,
  };

  await removeKVNamespace();
  await removeWorker();

  // Rewrite original setup values but erase worker and namespace related values
  fs.writeFileSync(path.resolve(__dirname, `${configDir}/.env`), "");
  writeToEnv(setup);
  clearInterval(destroy);
  log("\nA/B test teardown complete.\n");
};

(async () => {
  log("\nBeginning destroy process!");
  (async () => {
    const response = await prompt({
      type: "text",
      name: "value",
      message: "Are you sure?",
      validate: (value) =>
        value.toLowerCase() === "yes" ||
        value.toLowerCase() === "no" ||
        value.toLowerCase() === "y" ||
        value.toLowerCase() === "n"
          ? true
          : "Please enter yes or no",
    });

    if (response.value === "yes" || response.value === "y") {
      await destroy();
      return;
    } else {
      log("\nA/B teardown canceled.\n");
    }
  })();
})();
