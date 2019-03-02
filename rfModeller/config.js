var fs = require("fs");

var config = require("./config.json");
//var config = fs.readFileSync("./config.json");
console.log(config);

module.exports = config;
