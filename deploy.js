const result = require("dotenv").config();
const createNameSpace = require("./actions/createNameSpace.js");
const createRemoteConfig = require("./actions/createRemoteConfig.js");

(async () => {
  await createNameSpace();
  await createRemoteConfig();
})();
