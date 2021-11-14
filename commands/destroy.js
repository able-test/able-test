const removeKVNamespace = require("../actions/removeKVNamespace");
const removeWorker = require("../actions/removeWorker");
const log = require("../utils/log");
const prompt = require("prompts");

const destroy = async () => {
  const destroy = loadingBar("\n*Dismantling A/B Test*\n");
  await removeKVNamespace();
  await removeWorker();
  clearInterval(destroy);
  log("\nA/B test teardown complete.");
};

(async () => {
  log("\nBeginning destroy process!");
  log("\nADD PROMPT HERE!"); // ADD A YES OR NO VERIFICATION HERE
  async () => {
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
  };

  if (response.value === "yes" || response.value === "y") {
    await destroy();
    return;
  }

  log("\nA/B teardown canceled.");
})();
