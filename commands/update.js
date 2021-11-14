const createRemoteConfig = require("../actions/createRemoteConfig");
const log = require("../utils/log");
const prompt = require("prompts");
const loadingBar = require("../utils/loadingBar");

const update = async () => {
  const update = loadingBar("\n*Updating remote test configuration*\n");
  await createRemoteConfig();
  clearInterval(update);
  log("\nRemote configuration update complete.\n");
};

(async () => {
  log("\nBeginning remote updating process!");
  (async () => {
    const response = await prompt({
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

    if (response.value === "yes" || response.value === "y") {
      await update();
      return;
    } else {
      log("\nRemote configuration update canceled.\n");
    }
  })();
})();
