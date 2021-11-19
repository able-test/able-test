### ABLE A/B TESTING FOR CLOUDFLARE APPLICATIONS WITH UMAMI ANALYTICS DASHBOARD

Who is this for?

Someone who is hosting a JAMStack application on Cloudflare and wants to run a split test

#### PREREQUISITES

AWS account and credentials configured on local machine, aws-cdk installed globally (if using Umami)
npm installed

#### TO USE

clone the repo

`npm install`
from main folder, run `cdk bootsrap aws://${AWS_ACCOUNT_NUMBER}/'us-east-1` (this must use us-east-1 region)

`able setup` - this function should get cloudflare credentials and domain name and set up the Umami server if desired.

When setup is complete, go to your Umami site, log in using username `admin` and password `umami` and set
your control and variant names. Take note of the script tags, as these will be copied in to the ableConfig.json
file.

run `able config` to generate a split test configuration file. Fill in the fields with the appropriate values.

run `able deploy` to deploy the split test to Cloudflare.

#### TO TEARDOWN

`able destroy` to remove split test from Cloudflare

`cdk destroy` to remove Umami server
