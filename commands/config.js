const fs = require("fs");

// console.log(fs.existsSync('./config.json'))

// TODO: CHECK FILE PATH
// For testing purposes, right now the file just goes in Able's root directory,
// in production it'll need to go to the same place the .Able file does

// Users also need to know where to find the file or else it should automatically open
// for them to edit (or both).

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

// NOTE: AS OF NOW, THIS COMMAND WILL OVERWRITE AN EXISTING CONFIG.JSON FILE WITH A BLANK SKELETON. 
// NEED TO WARN USERS WHO ALREADY HAVE A CONFIG FILE SO THEY CAN CANCEL OR ELSE MODIFY TO CHECK FIRST 

const createConfigFile = () => {
  fs.writeFile('./config.json', configSkel, (err, data) => {
    if (!err) {
      console.log("Your config.json file is now ready! Please edit it to configure your A/B test before running \'able deploy\'.")
      console.log("For more information about setting up your config.json file, run \'able config --help\'.")
    } else {
      console.log("Something went wrong. Config file not created, please try again.")
    }
  })
}

module.exports = createConfigFile();