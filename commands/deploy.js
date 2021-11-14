const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const addWorkerToDomain = require("../actions/addWorkerToDomain.js");
const createNameSpace = require("../actions/createNameSpace.js");
const createRemoteConfig = require("../actions/createRemoteConfig.js");
const createWorker = require("../actions/createWorker");
const enableWorker = require("../actions/enableWorker.js");
const validateConfig = require("../utils/validateConfig.js");
const fs = require("fs");
const prompt = require("prompts");
const absolutePath = require("../utils/configDir");
const loadingBar = require("../utils/loadingBar");
const writeToEnv = require("../utils/writeToEnv");
// const setupMessage = require('../../utils/setupMessage');  // TODO create file

// Deploy the AB Test and worker in full

const createHiddenAbleDir = () => {
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath);
  }
};

const configStart = () => {
  console.log(`Configuring Able!\n`);
};

const configComplete = () => {
  console.log("Setup complete.");
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
  const deploy = loadingBar("Deploying");
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

  configStart();

  const userInput = await promptUser();
  console.log(userInput);
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

  console.log("Canceled Able deploy.");
})();
