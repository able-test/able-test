// Import required AWS SDK clients and commands for Node.js
const { CreateKeyPairCommand } = require("@aws-sdk/client-ec2");
const { ec2Client } = require("./ec2Client");

// Set the parameters
const params = { KeyName: "horse" }; //MY_KEY_PAIR

const run = async () => {
  try {
    const data = await ec2Client.send(new CreateKeyPairCommand(params));
    console.log(JSON.stringify(data));
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};
run();
