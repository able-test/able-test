### ABLE A/B TESTING FOR CLOUDFLARE APPLICATIONS WITH UMAMI ANALYTICS DASHBOARD

Who is this for?

Someone who is hosting a JAMStack application on Cloudflare and wants to run a split test. We offer the option to use your own analytics service like Google Analytics, or we
can deploy an Umami Webserver to AWS infrastructure for you which will use ECS and RDS under your custom domain name with the url `ableumami.yoursite.whatever`, and
in about 30-40 minutes you will have a fully operational split test with a beautiful and informative dashboard for your own custom events!

#### PREREQUISITES

- IF USING UMAMI DASHBOARD:
  - AWS account and credentials configured on local machine
  - aws-cdk installed globally
- `npm` installed
- Have handy your
  - Cloudflare EMAIL
  - Cloudflare GLOBAL API_KEY
  - Cloudflare ACCOUNT_ID
  - Cloudflare ZONE_ID for the site you will be testing against

#### TO USE

1. `git clone https://github.com/JWhist/ABle`

2. `npm install`

3. IF USING UMAMI DASHBOARD:

   - From main folder, run `cdk bootsrap aws://${AWS_ACCOUNT_NUMBER}/'us-east-1'` (this must use us-east-1 region)

4. `able setup` - Setup of Umami server infrastructure takes approximately 20-25 minutes.

5. `able config` - This will generate a file called ableConfig.json that you will fill in with your split test configurations.
   If you are using the Umami Dashboard, log in using `admin` and `umami` and set up your destinations there under settings, add website and copy the script tags into the
   appropriate variants in the ableConfig.json file. Be careful to nest your single quotes inside your double quotes and not vice-versa ;)

6. Create and push your test branches to github and Cloudflare where they will be deployed to preview branches. Enter these URLS, which are going to match the branch name
   along with the Cloudflare pages site name; ie, test.mysite.pages.dev, into the ableConfig.json file.

7. `able deploy` to deploy the split test to Cloudflare. This will take approximately 5-10 seconds.

#### TO UPDATE

1. Make changes to the `ableConfig.json` file

2. `able update` to push those changes to Cloudflare. They will be live in a few seconds.

#### TO TEARDOWN

1. `able destroy` to remove split test from Cloudflare.

2. `cdk destroy` to teardown Umami server. This process takes approximately 20-25 minutes.
