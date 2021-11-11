const result = require("dotenv").config();
const createNameSpace = require("./actions/createNameSpace.js");
const createRemoteConfig = require("./actions/createRemoteConfig.js");
const createWorker = require("./actions/createWorker");
const enableWorker = require("./actions/enableWorker.js");

(async () => {
  await createNameSpace();
  await createRemoteConfig();
  await createWorker();
  await enableWorker();
})();
