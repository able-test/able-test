const prompt = require("prompts");
const fs = require("fs");

console.log(fs.existsSync('../config.json'))

/*

Data will be stored like this:

const config = {
  "variants": [
    {
      "name",      // string
      "url",       // string
      "script"     // string
    } 
  ],
  "rule": {
    "filter": {
      "device"   // string (browser, mobile or "")
      "browser:  // {}"
    }

  }



}



// Check to see if config.json exists
// If it doesn't, create it and add any fields the user designates
// If it does, allow users to use the same values, clear value
// or update value

// 1. Add Variant
//    a. Enter variant name
//    b. Enter variant url
//    c. Enter analytics script
//    
// addVariant(name, url, analytics)

// By default, run twice and then ask if they want to add another


*/


const config = () => {

}

const openConfigFile = () => {
  fs.writeFile('../config.json', config, (err, data) => {
    if (!err) {
      console.log("file successfully created")
    }
    console.log(fs.existsSync('../config.json'))
  })
}


openConfigFile();

console.log(fs.existsSync('../config.json'))