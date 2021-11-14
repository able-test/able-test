const configDir = require("../utils/configDir");
require("dotenv").config({ path: `${configDir}/.env` });
const log = require("../utils/log");
const fs = require("fs");
const prompt = require("prompts");
const writeToEnv = require("../utils/writeToEnv");
// const setupMessage = require('../../utils/setupMessage');  // TODO create file

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

const questions = (apiKey, email, accountId, zoneId) => {
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
  ];
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
    apikey && email && accountId && zoneId
      ? await promptUser(apikey, email, accountId, zoneId)
      : await promptUser();
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
        userInput.API_KEY &&
        userInput.EMAIL &&
        userInput.ACCOUNT_ID &&
        userInput.ZONE_ID
      ) {
        writeToEnv(userInput);
        configComplete();
        return;
      }
    } else {
      log("\nCanceled Able setup.\n");
    }
  })();
})();
