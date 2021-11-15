const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const addWorkerToDomain = require("../actions/addWorkerToDomain.js");
const createNameSpace = require("../actions/createNameSpace.js");
const createRemoteConfig = require("../actions/createRemoteConfig.js");
const createWorker = require("../actions/createWorker");
const enableWorker = require("../actions/enableWorker.js");
const log = require("../utils/log");
const prompt = require("prompts");
const loadingBar = require("../utils/loadingBar");
const writeToEnv = require("../utils/writeToEnv");

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
    name: "DOMAIN_PATTERN",
    message: "Enter your domain matching pattern",
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
  log("\nBeginning deploy process!");

  // check if users credentials are already available to preload into the prompts
  const apiKey = process.env.API_KEY;
  const email = process.env.EMAIL;
  const accountId = process.env.ACCOUNT_ID;
  const zoneId = process.env.ZONE_ID;

  // If a user has not run the setup, bail out of the deploy process
  if (apiKey && email && accountId && zoneId) {
    userInput = await prompt(questions);
  } else {
    log("\nPlease run able setup before deployment.\n");
    return;
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
        userInput.DOMAIN_PATTERN
      ) {
        writeToEnv(userInput);
        await deploy();
        return;
      }
      log("\nA/B deploy canceled.\n");
    }
  })();
})();
