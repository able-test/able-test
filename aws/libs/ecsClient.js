const { ECSClient } = require("@aws-sdk/client-ecs");
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create anAmazon EC2 service client object.
const ecsClient = new ECSClient({ region: REGION });
module.exports = { ecsClient };
