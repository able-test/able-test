const fs = require("fs");

const configSkel = `{
  "variants": [
    {
      "name": "",    
      "url": "",      
      "script": ""     
    }, 
    {
      "name": "",      
      "url": "",       
      "script": ""     
    }
  ],
  "rule": {
    "filter": {
      "device": "", 
      "browser": [],  
      "header": {},
      "cookie": ""
    },
    "destinations": [
      {
        "variantName": "",
        "weight": ""
      },
      {
        "variantName": "",
        "weight": ""
      }
    ],
    "note": ""
  }
}`

// NOTE: THIS FUNCTION WILL OVERWRITE AN EXISTING ABLECONFIG.JSON FILE WITH A BLANK SKELETON. 
// NEED TO WARN USERS WHO ALREADY HAVE A CONFIG FILE SO THEY CAN CANCEL OR ELSE MODIFY TO CHECK FIRST 

const createConfigFile = () => {
  fs.writeFile(`${process.cwd()}/ableConfig.json`, configSkel, (err, data) => {
    if (!err) {
      console.log("")
      console.log("Your ableConfig.json file is now ready! You'll find it in your current working directory.")
      console.log("---> Please edit it to configure your A/B test before running \'able deploy\'. <--")
      console.log("For more information about setting up your ableConfig.json file, run \'able config --help\'.")
      console.log("")
    } else {
      console.log("Something went wrong. ableConfig file not created, please try again.")
    }
  })
}

module.exports = createConfigFile();