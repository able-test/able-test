const axios = require("axios");
const fs = require("fs");
let config = fs.readFileSync("config.json");

const EMAIL = process.env.EMAIL;
const API_KEY = process.env.API_KEY;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const TITLE = process.env.TITLE;
let NAMESPACE_ID;

async function createNameSpace() {
  axios
    .post(
      `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/storage/kv/namespaces`,
      JSON.stringify({ title: TITLE }),
      {
        headers: {
          "X-Auth-Email": EMAIL,
          "X-Auth-Key": API_KEY,
          "Content-Type": "application/json",
        },
      }
    )
    .then((res) => {
      NAMESPACE_ID = res.data.result.id;
      let newConfig = { ...JSON.parse(config), NAMESPACE_ID: NAMESPACE_ID };
      fs.writeFileSync("config.json", JSON.stringify(newConfig));
    })
    .catch((err) => {
      console.log(err); // TODO: HANDLE ERROR
    });
}

module.exports = createNameSpace;
