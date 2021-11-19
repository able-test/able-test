##### For development, clone then `npm i -g ./` then use `able deploy` to deploy and `able destroy` to teardown

### NOTES

Add a .env to the project root folder with your cloudflare credentials listed as:

- EMAIL
- API_KEY (This is the global key, not the CA key)
- ACCOUNT_ID (Associated with the project)

For the KV store which will hold the config data for the AB test, you will need a:

- TITLE
- WORKER_SCRIPT_NAME
- DOMAIN_PATTERN - which subdomains you want the split to run on (put \*.mydomain.com/\_ for all)
- ZONE_ID

##### For current testing purposes run `node deploy.js`. Currently working on part 2 of the deploy process.

##### For current testing purposes run `node destroy.js` to teardown the KV store and worker.

1. `able setup`
2. Create Certificate
2. `cdk bootstrap aws://acctId/region && cdk synth && cdk deploy`
3. Attach LB
4. Insert Tables
6. `able config` (after getting script tags from Umami dash)
7. `able deploy`
