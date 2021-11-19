const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const addWorkerToDomain = require("../actions/addWorkerToDomain.js");
const createNameSpace = require("../actions/createNameSpace.js");
const createWorker = require("../actions/createWorker");
const enableWorker = require("../actions/enableWorker.js");
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
  createRemoteConfig = require("../actions/createRemoteConfig.js");
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
    name: "TITLE",
    message: "Enter a title for your remote config",
    initial: "",
    validate: (value) =>
      value !== value.toLowerCase() ? "Title must be lowercase only" : true,
  },
  {
    type: "text",
    name: "WORKER_SCRIPT_NAME",
    message: "Enter a name for your worker",
    initial: "",
    validate: (value) =>
      value !== value.toLowerCase() ? "Name must be lowercase only" : true,
  },
  {
    type: "text",
    name: "DOMAIN",
    message: "Enter your domain name",
    initial: "",
  },
];

const deployComplete = () => {
  log("\nDeploy complete.\n");
};

const deploy = async () => {
  const deploy = loadingBar("\nDeploying"); // Makes the little dots that continue on each line after the words
  try {
    await createNameSpace();
    await createRemoteConfig();
    await createWorker();
    await enableWorker();
    await addWorkerToDomain();
    deployComplete();
  } catch {
    console.log("\nSomething went wrong.")
  }
  clearInterval(deploy);
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
        userInput.TITLE &&
        userInput.WORKER_SCRIPT_NAME &&
        userInput.DOMAIN
      ) {
        userInput = Object.fromEntries(
          Object.entries(userInput).map((entry) => [entry[0], entry[1].trim()])
        );
        writeToEnv(userInput);
        await deploy();
        return;
      }
      log("\nA/B deploy canceled.\n");
    }
  })();
})();
