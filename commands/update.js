const log = require("../utils/log");
const prompt = require("prompts");
const loadingBar = require("../utils/loadingBar");
const fs = require("fs");
let createRemoteConfig;

const ableConfigExists = () => {
  return fs.existsSync(`${process.cwd()}/ableConfig.json`);
};

const loadAbleConfig = () => {
  createRemoteConfig = require("../cloudflare/createRemoteConfig");
};

const missingAbleConfigMessage = () => {
  log(
    "\n`ableConfig.json` not found. Please run `able config` to create file."
  );
  log(
    "\nBefore deploying your Able test, edit your `ableConfig` to configure your tests."
  );
  log(
    "\nFor more information about test configuration, run `able config --help`.\n"
  );
};

const update = async () => {
  const update = loadingBar("\n*Updating remote test configuration*\n");
  await createRemoteConfig();
  clearInterval(update);
  log("\nRemote configuration update complete.\n");
};

(async () => {
  (async () => {
    if (!ableConfigExists()) {
      missingAbleConfigMessage();
      return;
    } else {
      loadAbleConfig();
      log("\nBeginning remote updating process!");
      const response = await prompt({
        type: "text",
        name: "value",
        message: `Running 'able update' will update your test configuration based on your 'ableConfig' file.
    Don't forget to make changes to your your 'ableConfig' before proceeding!
    Are you ready to update at this time?.`,
        validate: (value) =>
          value.toLowerCase() === "yes" ||
          value.toLowerCase() === "no" ||
          value.toLowerCase() === "y" ||
          value.toLowerCase() === "n"
            ? true
            : "Please enter yes or no",
      });

      if (response.value === "yes" || response.value === "y") {
        await update();
        return;
      } else {
        log("\nRemote configuration update canceled.\n");
      }
    }
  })();
})();
