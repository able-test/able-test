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

const promptUser = async (apiKey, email, accountId, zoneId) => {
  return await prompt(questions(apiKey, email, accountId, zoneId));
};

const questions = (
  apiKey,
  email,
  accountId,
  zoneId,
  title,
  worker,
  domainPattern
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
      name: "ZONE_ID",
      message: "Enter your zone Id",
      initial: zoneId || "",
    },
    {
      type: "text",
      name: "TITLE",
      message: "Enter a title for your remote config",
      initial: title || "",
      validate: (value) =>
        value !== value.toLowerCase() ? "Title must be lowercase only" : true,
    },
    {
      type: "text",
      name: "WORKER_SCRIPT_NAME",
      message: "Enter a name for your worker",
      initial: worker || "",
      validate: (value) =>
        value !== value.toLowerCase() ? "Name must be lowercase only" : true,
    },
    {
      type: "text",
      name: "DOMAIN_PATTERN",
      message: "Enter your domain matching pattern",
      initial: domainPattern || "",
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
  const accountId = process.env.ACCOUNT_ID;
  const zoneId = process.env.ZONE_ID;
  configStart();

  // If users credentials are available, prepopulate the fields, otherwise start with blank ones
  const userInput =
    apikey && email && accountId
      ? await promptUser(apikey, email, accountId, zoneId)
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

  log("\nCanceled Able deploy.\n");
})();
