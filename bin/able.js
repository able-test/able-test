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

program.parse(process.argv);
