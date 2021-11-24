#!/usr/bin/env node

const cdk = require("@aws-cdk/core");
const { UmamiDeploy } = require("../lib/umami-deploy-stack");

const app = new cdk.App();
new UmamiDeploy(app, "UmamiDeployStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1",
  },
});
