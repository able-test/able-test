// Import required AWS SDK clients and commands for Node.js
const {
  CreateTagsCommand,
  RunInstancesCommand,
} = require("@aws-sdk/client-ec2");
const { ec2Client } = require("./libs/ec2Client.js");

// Set the parameters
const instanceParams = {
  ImageId: "ami-0279c3b3186e54acd", //AMI_ID
  InstanceType: "t2.micro",
  KeyName: "horse", //KEY_PAIR_NAME
  MinCount: 1,
  MaxCount: 1,
};

const run = async () => {
  try {
    const data = await ec2Client.send(new RunInstancesCommand(instanceParams));
    console.log(data.Instances[0].InstanceId);
    const instanceId = data.Instances[0].InstanceId;
    console.log("Created instance", instanceId);
    // Add tags to the instance
    const tagParams = {
      Resources: [instanceId],
      Tags: [
        {
          Key: "Name",
          Value: "SDK Sample",
        },
      ],
    };
    try {
      const data = await ec2Client.send(new CreateTagsCommand(tagParams));
      console.log("Instance tagged");
    } catch (err) {
      console.log("Error", err);
    }
  } catch (err) {
    console.log("Error", err);
  }
};
run();
