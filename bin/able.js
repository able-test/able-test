#!/usr/bin/env node

const { program } = require("commander");

program.version("0.0.3");

program
  .command("s")
  .alias("setup")
  .description(
    "Configures Able using your Cloudflare email, API key, account ID, and zone ID "
  )
  .action(() => require("../commands/setup.js"))
  .addHelpText(
    "after",
    `

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

  `
  );

program
  .command("c")
  .alias("config")
  .description("Creates an ableConfig.json file with A/B test configuration.")
  .action(() => require("../commands/config.js"))
  .addHelpText(
    "after",
    `

This command provides you with a skeleton configuration for setting up your variants.
You'll find the file you need labled 'ableConfig.json' in your current working directory.

   \"variants\": At least two variants are required.
                 Each variant must have a name, for example, "control" and "test".
                 The URL is the URL each variant is deployed on.
                 The script should contain the Umami snippet that you would like to associate with the variant.
                    Note: Each variant should have a different Umami snippet.

  The \"rule\" gives you granular control over your A/B tests.

  \"filters\" are optional ways of controlling traffic to your A/B tests.
              "device":   By default Able tests on both mobile and desktop devices. However, you can specify "mobile" or "desktop"
                          to control which users are part of the A/B test.
              "browser":  If you want to run your test only on certain browsers, specify the browsers you'd like to target.
                          This should be an array of lowercase strings of browser names, valid names are:
                          ["chrome", "safari", "firefox", "opera", "edg", "msie", "trident"]
                          If the array is empty, the test will be performed across all browsers.
              "header":   If you would like to split your test based on a specific header value, you can specify it
                          by providing the name of the header and the requisite value, such as:
                          {"name": "force-test", "value": "true"}
              "cookie":   Tests can be performed only when a specific cookie is present. For example, this allows you to test only on
                          logged-in users. Provide the cookie key/value pair as follows:
                          "force-test=true"

  "destinations" are required for each of the variants in the test.
              "variantName": should correspond to the names of the variants in the variants field.
              "weight":      determines what percentage of users see a given variant.
              ** The total weights must add up to 100. A common split percentage is 50/50. **

  "note" is an optional field for any additional information you wish to include about your A/B test.

  After editing your ableConfig.json file, run \`able deploy\` to deploy a new test or \`able update\`
   to update your current configuration.

  For more information or to see an example ableConfig.json file, please visit the docs at able.io/docs.

  `
  );

program
  .command("d")
  .alias("deploy")
  .description("Deploys your AB Test on Cloudflare")
  .action(() => require("../commands/deploy.js"))
  .addHelpText(
    "after",
    `
  To deploy your A/B test, first make sure you have your ableConfig.json file set up correctly.
  When you run \`able deploy\`, you'll be given a series of prompts.

  \'Enter a title for your remote config\'
      -> This will be the title for your Cloudflare KV namespace.
      -> Titles must be lowercase, not empty and unique to your Cloudflare account.
  \'Enter a name for your worker\`
      -> This is the name of your Cloudflare worker script.
      -> Names must be lowercase, not empty and unique to your Cloudflare account.
  \'Enter your domain matching pattern\`
      -> This is the route matching pattern that will allow your worker to run on your custom domain.
  `
  );

program
  .command("t")
  .alias("destroy-test")
  .description("Teardown AB Test on Cloudflare")
  .action(() => require("../commands/destroy.js"))
  .addHelpText(
    "after",
    `

  This will remove your KV namespace and worker script from Cloudflare.
  This action cannot be undone!

  `
  );
program
  .command("w")
  .alias("destroy-umami")
  .description("Teardown Umami Application from AWS")
  .action(() => require("../commands/destroyUmami.js"))
  .addHelpText(
    "after",
    `

  This will remove your Umami infrastructure from AWS & remove your DNS CNAME records from Cloudflare.
  Your current split tests will still continue to run on Cloudflare edge workers!
  This action cannot be undone!

  `
  );

program
  .command("u")
  .alias("update")
  .description("Update Remote Config on KV Namespace")
  .action(() => require("../commands/update.js"))
  .addHelpText(
    "after",
    `

  This will use your ableConfig.json file to update your running A/B tests.
  Before running \`update\`, please ensure you've updated your ableConfig.json file with the desired changes.


  `
  );

program.parse(process.argv);
