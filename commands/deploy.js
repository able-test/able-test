const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const addWorkerToDomain = require("../cloudflare/addWorkerToDomain");
const createNameSpace = require("../cloudflare/createNameSpace");
const createWorker = require("../cloudflare/createWorker");
const enableWorker = require("../cloudflare/enableWorker");
const log = require("../utils/log");
const prompt = require("prompts");
const loadingBar = require("../utils/loadingBar");
const writeToEnv = require("../utils/writeToEnv");
const fs = require("fs");
const validConfig = require("../utils/validateConfig");
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

const questions = [
  {
    type: "text",
    name: "DOMAIN_PATTERN",
    message: "Enter your domain matching pattern Eg. *example.com/*",
    initial: "",
  },
];

const deployComplete = () => {
  log("\nDeploy complete.\n");
};

const deploy = async () => {
  const deploy = loadingBar("\nDeploying"); // Makes the little dots that continue on each line after the words
  await createNameSpace();
  await createRemoteConfig();
  await createWorker();
  await enableWorker();
  await addWorkerToDomain();
  clearInterval(deploy);
  deployComplete();
};

(async () => {
  let userInput;

  if (!ableConfigExists()) {
    missingAbleConfigMessage();
    return;
  } else if (!validConfig()) {
    log("\nPlease run able setup before deployment.\n");
    log("\nIf you've already done this step, your credentials may be wrong.\n");
    log(
      "\nVerify your email, API key, account ID and zone ID are correct before proceeding.\n"
    );
    return;
  } else {
    loadAbleConfig();
    log("\nBeginning deploy process!");
    userInput = await prompt(questions);
  }

  (async () => {
    const verify = await prompt({
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

    if (
      verify.value.toLowerCase() === "yes" ||
      verify.value.toLowerCase() === "y"
    ) {
      if (
        userInput.DOMAIN_PATTERN
      ) {
        userInput.DOMAIN_PATTERN = userInput.DOMAIN_PATTERN.trim();
        userInput.WORKER_SCRIPT_NAME = 'able-test-worker'
        userInput.TITLE = 'able-test-kv'
        writeToEnv(userInput);
        await deploy();
        return;
      }
      log("\nA/B deploy canceled.\n");
    }
  })();
})();
