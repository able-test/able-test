const { CreateCapacityProviderCommand } = require("@aws-sdk/client-ecs");
const { ecsClient } = require("./libs/ecsClient.js");

const params = {
  autoScalingGroupProvider: {
    autoScalingGroupArn: "",
    managedScaling: {
      status: "ENABLED",
      targetCapacity: 1,
      minimumScalingStepSize: 1,
      maximumScalingStepSize: 1,
      instanceWarmupPeriod: 300,
    },
    managedTerminationProtection: "DISABLED",
  },
  name: "able",
  tags: [],
};

(async () => {
  const command = new CreateCapacityProviderCommand(params);
  const response = await ecsClient.send(command);
  console.log(response);
})();
