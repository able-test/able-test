const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
const rds = require("@aws-cdk/aws-rds");
const secretsManager = require("@aws-cdk/aws-secretsmanager");
const cm = require("@aws-cdk/aws-certificatemanager");
const configDir = require("../../../utils/configDir.js");
const { PostgresEngineVersion } = require("@aws-cdk/aws-rds");
require("dotenv").config({ path: `${configDir}/.env` });

class MyEcsConstructStack extends cdk.Stack {
  /**
   *
   * @param {cdk.Construct} scope
   * @param {string} id
   * @param {cdk.StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);
    const cert = cm.Certificate.fromCertificateArn(
      this,
      "UmamiAbleCert",
      process.env.CERTIFICATE_ARN
    );

    const vpc = new ec2.Vpc(this, "AbleUmamiVpc", {
      maxAzs: 3, // Default is all AZs in region
    });

    const cluster = new ecs.Cluster(this, "AbleUmamiCluster", {
      vpc: vpc,
    });

    const databaseCredentialsSecret = new secretsManager.Secret(
      this,
      "umami-DBCredentialsSecret",
      {
        secretName: "umamiDB-credentials",
        generateSecretString: {
          secretStringTemplate: JSON.stringify({
            username: "umamiUser",
          }),
          excludePunctuation: true,
          includeSpace: false,
          generateStringKey: "password",
        },
      }
    );

    const postgres = new rds.DatabaseInstance(this, "UmamiPostgres", {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: PostgresEngineVersion.VER_13,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      allocatedStorage: 20,
      maxAllocatedStorage: 64,
      storageType: rds.StorageType.GP2,
      databaseName: "umamidb",
      credentials: rds.Credentials.fromSecret(databaseCredentialsSecret),
      port: 5432,
      vpc,
      vpcPlacement: { subnetType: ec2.SubnetType.PUBLIC },
    });

    postgres.connections.allowFromAnyIpv4(ec2.Port.tcp(5432));
    const postgresEndpoint = postgres.instanceEndpoint.hostname.toString();
    const databaseUrl = `postgres://${databaseCredentialsSecret.secretValueFromJson(
      "username"
    )}:${databaseCredentialsSecret.secretValueFromJson(
      "password"
    )}@${postgresEndpoint}:5432/umamidb`;

    // Create a load-balanced Fargate service and make it public
    const ALBFargate = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      "AbleUmami",
      {
        cluster: cluster, // Required
        cpu: 256, // Default is 256
        desiredCount: 1, // Default is 1
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry(
            "ghcr.io/mikecao/umami:postgresql-latest"
          ),
          containerPort: 3000,
          environment: {
            DATABASE_URL: databaseUrl,
            DATABASE_TYPE: "postgresql",
            HASH_SALT: "asfdasdf123",
          },
        },
        loadBalancerName: "AbleUmamiLB",
        certificate: cert,
        memoryLimitMiB: 512, // Default is 512
        publicLoadBalancer: true, // Default is false
      }
    );
  }
}

module.exports = { MyEcsConstructStack };
