// Import required AWS SDK clients and commands for Node.js
const { DescribeKeyPairsCommand } = require("@aws-sdk/client-ec2");
const { ec2Client } = require("./ec2Client");
const run = async () => {
  try {
    const data = await ec2Client.send(new DescribeKeyPairsCommand({}));
    console.log("Success", JSON.stringify(data.KeyPairs));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
run();
