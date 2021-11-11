const result = require("dotenv").config();
const createNameSpace = require("./actions/createNameSpace.js");
const createRemoteConfig = require("./actions/createRemoteConfig.js");
const createWorker = require("./actions/createWorker");

(async () => {
  await createNameSpace();
  await createRemoteConfig();
  await createWorker();
})();
