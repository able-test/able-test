const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");
const { Client } = require("pg");
const fs = require("fs");
const SCHEMA_SQL = fs.readFileSync("../utils/schema.sql").toString();

async function getDatabaseCredentials() {
  try {
    const client = new SecretsManagerClient("us-east-1");
    const command = new GetSecretValueCommand({
      SecretId: "umamiDB-credentials",
    });
    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString);
    return {
      dbname: secrets.dbname,
      port: secrets.port,
      username: secrets.username,
      password: secrets.password,
      host: secrets.host,
    };
  } catch (e) {
    console.log(e);
  }
}

function createDbConnectionString({ dbname, port, username, password, host }) {
  return `postgres://${username}:${password}@${host}:${port}/${dbname}`;
}

(async () => {
  const credentials = await getDatabaseCredentials();
  const connectionString = createDbConnectionString(credentials);
  const client = new Client({ connectionString });
  client.connect();
  client.query(SCHEMA_SQL, (err, res) => {
    if (err) {
      console.log(err);
    } else {
      console.log("rds success");
    }
    client.end();
  });
})();
