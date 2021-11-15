#!/usr/bin/env node

const { program } = require("commander");

program.version("0.0.1");

program
  .command("s")
  .alias("setup")
  .description("Configures Able using your Cloudflare email, API key, account ID, and zone ID ")
  .action(() => require("../commands/setup.js"))
  .addHelpText('after', `
  
  This is the first step to set up your A/B test using Able. 
  You'll need the following credentials in order to successfully link your Cloudflare account:

  Cloudflare email:
    -> This is the email address associated with your Cloudflare account.
  Global API Key:
    -> You'll find this in your Cloudflare dashboard. 
    -> Cick on your profile, then on the lefthand sidebar, choose API tokens.
    -> View and copy the Global API Key. 
  Account ID:
    -> This ID can be found in the account overview for your domain.
    -> From the Cloudflare dashboard, select \'websites\', then \'overview\'.
    -> You may need to scroll down to find the Account ID located on the righthand side.
  Zone ID:
    -> This ID should be right above your Account ID, in the account overview.
  
  `);

program
  .command("d")
  .alias("deploy")
  .description("Deploys your AB Test on Cloudflare")
  .action(() => require("../commands/deploy.js"))
  .addHelpText('after', `
  To deploy your A/B test, first make sure you have your config.json file set up correctly.
  When you run \`able deploy\`, you'll be given a series of prompts.

  \'Enter a title for your remote config\'
      -> This will be the title for your Cloudflare KV namespace. 
      -> Titles must be lowercase, not empty and unique to your Cloudflare account.
  \'Enter a name for your worker\`
      -> This is the name of your Cloudflare worker script.
      -> Names must be lowercase, not empty and unique to your Cloudflare account.
  \'Enter your domain matching pattern\`
      -> This is the route matching pattern that will allow your worker to run on your custom domain.
  `)

program
  .command("e")
  .alias("destroy")
  .description("Teardown AB Test on Cloudflare")
  .action(() => require("../commands/destroy.js"))
  .addHelpText("after", `
    
  This will remove your KV namespace and worker script from Cloudflare.
  This action cannot be undone!

  `);

program
  .command("u")
  .alias("update")
  .description("Update Remote Config on KV Namespace")
  .action(() => require("../commands/update.js"))
  .addHelpText("after", `
  
  This will use your config.json file to update your running A/B tests.
  Before running \`update\`, please ensure you've updated your config.json file with the desired changes.


  `)

program.parse(process.argv);
