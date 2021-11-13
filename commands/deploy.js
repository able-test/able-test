const result = require("dotenv").config();
const addWorkerToDomain = require("../actions/addWorkerToDomain.js");
const createNameSpace = require("../actions/createNameSpace.js");
const createRemoteConfig = require("../actions/createRemoteConfig.js");
const createWorker = require("../actions/createWorker");
const enableWorker = require("../actions/enableWorker.js");
const validateConfig = require("../utils/validateConfig.js");
const fs = require('fs');
const prompt = require('prompts');
const absolutePath = require('../utils/configDir');
const loadingBar = require('../utils/loadingBar');  
// const setupMessage = require('../../utils/setupMessage');  // TODO create file

// Deploy the AB Test and worker in full

const createHiddenAbleDir = () => {
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath);
  }
};

const configStart = () => {
  console.log(`Configuring Able!\n`);
}

const configComplete =() => {
  console.log("\Setup complete.")
}

const promptUser = async (apiKey, email) => {
  await prompt(questions(apiKey, email));
}

const questions = (apiKey, email) => [
  {
    type: 'text',
    name: 'email',
    message: 'Please enter your Cloudflare account email:',
    initial: email || '',
  },
  {
    type: 'text',
    name: 'apiKey',
    message: 'Enter your Cloudflare Global API Key',
    initial: apiKey || '',
  }
];

const deploy = async () => {
  const deploy = loadingBar('Deploying');
  await createNameSpace();
  await createRemoteConfig();
  await createWorker();
  await enableWorker();
  await addWorkerToDomain();
  clearInterval(deploy);
  configComplete();
}

(async () => {
  if (!validateConfig()) {
    throw new Error(
      "Invalid configuration.  Please check your .env for valid entries."
    );
  }

  createHiddenAbleDir();

  const apiKey = process.env.APIKEY;
  const email = process.env.EMAIL;


  configStart();

  const userInput = 
    apiKey && email ? 
      await promptUser(apiKey, email) :
      await promptUser();

    if (userInput.apiKey && userInput.email) {
      writeToFile(userInput);
      await deploy();
      return;
    }

    console.log('\Canceled ABle deploy.')

})();
