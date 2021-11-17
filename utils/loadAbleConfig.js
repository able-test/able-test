const fs = require("fs")
const lot = reuire("./log")

const ableConfigExists = () => {
  return fs.existsSync(`${process.cwd()}/ableConfig.json`)
}

  // check if ableConfig.json exists 
  // if (!fs.existsSync('./ableConfig.json')) {
  //   log("\n`ableConfig.json` not found. Please run `able config` to create file.")
  //   log("\nBefore deploying your Able test, edit ableConfig.json to configure your tests.")
  //   log("\nFor more information about test configuration, run `able config --help`.")
  //   return 
  // }