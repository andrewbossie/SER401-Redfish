"use strict";

var util = require('util');
var fs = require('fs');

var config;
var PFuncs = require('./PatternFuncs');
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

//push to file switch
if (process.argv.indexOf("-f") != -1) {
   if (process.argv[process.argv.indexOf("-f") + 1] != -1) {
      //write data to file
	  mode = "file";
   }
}

if (!config) {
   config = require('./config');
}

if (process.argv.indexOf("-s") != 1 && process.argv.indexOf("-f") == -1) {
   startServer(config.RedFishData.path);
}

function startServer(redfishPath) {
   var express = require('express');
   var app = express();

   app.use('/redfish', express.static(redfishPath, {index: "index.json"}));

   app.listen(8001);

   console.log("Server started on port 8001");
}

var patternTimers = [];

//for live data
if (mode != "file"){
	config.MockupData.MockupPatterns.forEach(function(mockup, index) {
	   var p = new PFuncs();

	   if (!typeof p[mockup.pattern]) {
		  console.log("Pattern '" + mockup.pattern + "' not implemented! Skipping " + mockup.name + ".");
		  return;
	   }

	   if (!patternTimers[index])
		  patternTimers[index] = {};

	   if (mockup.min) { p.min = mockup.min; }
	   if (mockup.max) { p.max = mockup.max; }
	   if (mockup.step) { p.step = mockup.step; }

	   patternTimers[index].pfuncs = p;

	   patternTimers[index].timer = setInterval(function() {
		  var isoDTG = new Date().toISOString();

		  var currJSON = JSON.parse(fs.readFileSync(config.RedFishData.path + mockup.path + "index.json", 'utf-8'));

		  var templateJSON = JSON.stringify(mockup.MetricValueTemplate);

		  templateJSON = templateJSON.replace(/#value/g,
			 patternTimers[index].pfuncs[mockup.pattern]()
		  );
		  templateJSON = templateJSON.replace(/#timestamp/g, isoDTG);

		  var template = JSON.parse(templateJSON);

		  var tmpMVs = currJSON.MetricValues.filter(function(mval) {
			 return (mval.MemberID !== template.MemberID) ||
				(mval.MetricProperty !== template.MetricProperty);
		  });

		  currJSON.MetricValues = tmpMVs;

		  currJSON.MetricValues.push(template);

		  console.log(isoDTG + ": " + mockup.name + "(" + patternTimers[index].pfuncs.value + ")");

		  fs.writeFileSync(config.RedFishData.path + mockup.path + "index.json", JSON.stringify(currJSON, null, "\t"), 'utf-8', function(err) {
			 if (err) {
				return console.log(err);
			 }
		  });
	   }, mockup.timedelay * 1000);
	});
}

//for saving data to files

if (mode == "file"){
	//todo: comments, optimize, add timer
	var isoDTG = Date.now() //.toISOString();
	
	var iterations = 60 * 60;	//1 hour in seconds
	var str = "#\n";
	fs.writeFileSync("data.csv",str); //empty file if it already exists
	console.log("Generating... ");
	
	//var lineNum = 1;
	
	for (var i = 1; i <= iterations; i++){
		
		var line = "";
		config.MockupData.MockupPatterns.forEach(function(mockup, index) {
				//console.log(index);
				var currJSON = JSON.parse(fs.readFileSync(config.RedFishData.path + mockup.path + "index.json", 'utf-8'));
				
				
				
				if (patternTimers[index] == undefined)
				  patternTimers[index] = {};

				if(patternTimers[index].pfuncs == undefined){
					var p = new PFuncs();
					if (mockup.min) { p.min = mockup.min; }
					if (mockup.max) { p.max = mockup.max; }
					if (mockup.step) { p.step = mockup.step; }
					patternTimers[index].pfuncs = p;
				}
			
				//console.log(i);
				var templateJSON = JSON.stringify(mockup.MetricValueTemplate);
				
				templateJSON = templateJSON.replace(/#value/g,
					patternTimers[index].pfuncs[mockup.pattern]()
				);
				//console.log(index + ": " + patternTimers[index].pfuncs[mockup.pattern]());
				templateJSON = templateJSON.replace(/#timestamp/g, new Date(isoDTG + i*1000).toISOString());

				var template = JSON.parse(templateJSON);

				var tmpMVs = currJSON.MetricValues.filter(function(mval) {
				 return (mval.MemberID !== template.MemberID) ||
					(mval.MetricProperty !== template.MetricProperty);
				});
				
				currJSON.MetricValues = tmpMVs;
				currJSON.MetricValues.push(template);
				
				
				
			if(i % (mockup.timedelay) == 0){
				line += (currJSON.Name + ",");
				line += (template.MemberID + ",");
				line += (template.MetricValue + ",");
				line += (template.TimeStamp + ",");
				line += (template.MetricProperty + ",");


			}
			
			
			
		});
		if (line != ""){
			str += (i + ",");
			str += ("Metric,");
			
			str += line;
			str += "\n";
			//lineNum++;
		}
		
	
	}
	str += "0,END";
	fs.writeFileSync("data.csv", str);
	console.log("Complete");
	
}

