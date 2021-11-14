const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const addWorkerToDomain = require("../actions/addWorkerToDomain.js");
const createNameSpace = require("../actions/createNameSpace.js");
const createRemoteConfig = require("../actions/createRemoteConfig.js");
const createWorker = require("../actions/createWorker");
const enableWorker = require("../actions/enableWorker.js");
const log = require("../utils/log");
const fs = require("fs");
const prompt = require("prompts");
const loadingBar = require("../utils/loadingBar");
const writeToEnv = require("../utils/writeToEnv");
// const setupMessage = require('../../utils/setupMessage');  // TODO create file

// Deploy the AB Test and worker in full

const createHiddenAbleDir = () => {
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }
};

const configStart = () => {
  log(`\nConfiguring Able!\n`);
};

const configComplete = () => {
  log("\nSetup complete.\n");
};

const promptUser = async () => {
  return await prompt(questions());
};

const questions = (
  apiKey,
  email,
  accountId,
  title,
  worker,
  domainPattern,
  zoneId
) => {
  return [
    {
      type: "text",
      name: "EMAIL",
      message: "Please enter your Cloudflare account email:",
      initial: email || "",
    },
    {
      type: "text",
      name: "API_KEY",
      message: "Enter your Cloudflare Global API Key",
      initial: apiKey || "",
    },
    {
      type: "text",
      name: "ACCOUNT_ID",
      message: "Enter your Cloudflare Account Id",
      initial: accountId || "",
    },
    {
      type: "text",
      name: "TITLE",
      message: "Enter a title for your remote config",
      initial: title || "",
    },
    {
      type: "text",
      name: "WORKER_SCRIPT_NAME",
      message: "Enter a name for your worker",
      initial: worker || "",
    },
    {
      type: "text",
      name: "DOMAIN_PATTERN",
      message: "Enter your domain matching pattern",
      initial: domainPattern || "",
    },
    {
      type: "text",
      name: "ZONE_ID",
      message: "Enter your zone Id",
      initial: zoneId || "",
    },
  ];
};

const deploy = async () => {
  const deploy = loadingBar("\nDeploying");
  await createNameSpace();
  await createRemoteConfig();
  await createWorker();
  await enableWorker();
  await addWorkerToDomain();
  clearInterval(deploy);
  configComplete();
};

(async () => {
  createHiddenAbleDir();

  // check if users credentials are already available to preload into the prompts
  const apikey = process.env.API_KEY;
  const email = process.env.EMAIL;
  const zoneId = process.env.ZONE_ID;

  configStart();

  // If users credentials are available, prepopulate the fields, otherwise start with blank ones
  const userInput =
    apikey && email && zoneId
      ? await promptUser(apikey, email, zoneId)
      : await promptUser();

  if (
    userInput.API_KEY &&
    userInput.EMAIL &&
    userInput.ACCOUNT_ID &&
    userInput.TITLE &&
    userInput.WORKER_SCRIPT_NAME &&
    userInput.DOMAIN_PATTERN &&
    userInput.ZONE_ID
  ) {
    writeToEnv(userInput);
    await deploy();
    return;
  }

  log("Canceled Able deploy.\n");
})();
