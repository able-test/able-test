const result = require("dotenv").config();
const addWorkerToDomain = require("./actions/addWorkerToDomain.js");
const createNameSpace = require("./actions/createNameSpace.js");
const createRemoteConfig = require("./actions/createRemoteConfig.js");
const createWorker = require("./actions/createWorker");
const enableWorker = require("./actions/enableWorker.js");
const validateConfig = require("./utils/validateConfig.js");

(async () => {
  if (!validateConfig()) {
    throw new Error(
      "Invalid configuration.  Please check your .env for valid entries."
    );
  }

  await createNameSpace();
  await createRemoteConfig();
  await createWorker();
  await enableWorker();
  await addWorkerToDomain();
})();
