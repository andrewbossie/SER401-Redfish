"use strict";

var util = require("util");
var fs = require("fs");

var config;
var PFuncs = require("./PatternFuncs");
var mode = "";

if (process.argv.indexOf("-c") != -1) {
   if (process.argv[process.argv.indexOf("-c") + 1] != -1) {
      var configFile = "./" + process.argv[process.argv.indexOf("-c") + 1];
      console.log("Using config file: " + configFile);
      try {
         config = require(configFile);
      } catch (e) {
         console.log("Error opening " + configFile + ": " + e);
      }
   }
}

if (!config) {
   config = require("./config");
}

var patternTimers = [];

var parsedPaths = [];
var parsedTemplates = [];
var isoDTG = Date.now();

var iterations = 60 * 60; //1 hour in seconds TODO: make this variable 
var str = "#\n";
fs.writeFileSync("data.csv", str); //empty file if it already exists
console.log("Generating... ");

for (var i = 1; i <= iterations; i++) {
    var line = "";
    config.MockupData.MockupPatterns.forEach(function(mockup, index) {
        //only do anything if the current iteration is on the approriate time
        if (i % mockup.timedelay == 0) {
            
            //check if template has been parsed
            let path = config.RedFishData.path + mockup.path + "index.json";
            
            //if its not loaded yet, load and parse the template
            if(parsedPaths.indexOf(path) < 0){
                let file = fs.readFileSync(path,"utf-8")
                var currJSON = JSON.parse(file);
                //push template to loaded templates
                parsedTemplates.push(file);
                parsedPaths.push(path);
            }else{
                //or use the loaded one
                var currJSON = JSON.parse(parsedTemplates[parsedPaths.indexOf(path)]);
            }
            

            if (patternTimers[index] == undefined) patternTimers[index] = {};

            if (patternTimers[index].pfuncs == undefined) {
                var p = new PFuncs();
                if (mockup.min) {
                    p.min = mockup.min;
                }
                if (mockup.max) {
                    p.max = mockup.max;
                }
                if (mockup.step) {
                    p.step = mockup.step;
                }
                patternTimers[index].pfuncs = p;
            }


            var templateJSON = JSON.stringify(mockup.MetricValueTemplate);

            templateJSON = templateJSON.replace(
            /#value/g,
            patternTimers[index].pfuncs[mockup.pattern]()
            );

            templateJSON = templateJSON.replace(
            /#timestamp/g,
            new Date(isoDTG + i * 1000).toISOString().replace(/\..*$/, "-0500")
            );

            var template = JSON.parse(templateJSON);
            
            //build csv record
            line += currJSON.Name + ",";
            line += template.MemberID + ",";
            line += template.MetricValue + ",";
            line += template.TimeStamp + ",";
            line += template.MetricProperty + ",";
        }
    });
    
    //if the line is not empty, add some boilerplate and add to master string
    if (line != "") {
        str += i + ",";
        str += "Metric,";

        str += line;
        str += "\n";
        //lineNum++;
    }
}
str += "0,END";
fs.writeFileSync("data.csv", str);
console.log("Completed in " + (Date.now() - isoDTG) + "ms");
