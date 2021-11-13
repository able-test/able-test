#!/usr/bin/env node

const { program } = require("commander");

program.version("0.0.1");

program
  .command("d")
  .alias("deploy")
  .description("Deploy AB Test on Cloudflare")
  .action(() => require("../commands/deploy.js"));

program
  .command("e")
  .alias("destroy")
  .description("Teardown AB Test on Cloudflare")
  .action(() => require("../commands/destroy.js"));

program
  .command("u")
  .alias("update")
  .description("Update Remote Config on KV Namespace")
  .action(() => require("../commands/update.js"));

program.parse(process.argv);
