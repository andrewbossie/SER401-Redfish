"use strict";

var util = require("util");
var fs = require("fs");

var config;
var PFuncs = require("./PatternFuncs");

// JSON cache for files that need to be written
var dirty = [];

// Flag to not start a new file write promise if one is already pending
var fileWritePromiseFlag = false;

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

if (process.argv.indexOf("-s") != -1) {
  startServer(config.RedFishData.path);
}

function startServer(redfishPath) {
  var express = require("express");
  var app = express();

  app.use("/redfish", express.static(redfishPath, { index: "index.json" }));

  app.listen(8001);

  console.log("Server started on port 8001");
}

var patternTimers = [];

config.MockupData.MockupPatterns.forEach(function(mockup, index) {
  var p = new PFuncs();

  if (!typeof p[mockup.pattern]) {
    console.log(
      "Pattern '" +
      mockup.pattern +
      "' not implemented! Skipping " +
      mockup.name +
      "."
    );
    return;
  }

  if (!patternTimers[index]) patternTimers[index] = {};

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

  patternTimers[index].timer = setInterval(function() {
    var isoDTG = new Date().toISOString();
    isoDTG = isoDTG.replace(/\..*$/, "-0500");

    var currFile = mockup.path + "index.json";
    if (!(currFile in dirty)) {
      dirty[currFile] = JSON.parse(
        fs.readFileSync(
          config.RedFishData.path + currFile,
          "utf-8"
        )
      );
    } else {
      console.log(currFile + " found in dirty cache.");
    }

    var templateJSON = JSON.stringify(mockup.MetricValueTemplate);

    templateJSON = templateJSON.replace(
      /#value/g,
      patternTimers[index].pfuncs[mockup.pattern]()
    );
    templateJSON = templateJSON.replace(/#timestamp/g, isoDTG);

    var template = JSON.parse(templateJSON);

    var tmpMVs = dirty[currFile].MetricValues.filter(function(mval) {
      return (
        mval.MemberID !== template.MemberID ||
        mval.MetricProperty !== template.MetricProperty
      );
    });

    dirty[currFile].MetricValues = tmpMVs;

    dirty[currFile].MetricValues.push(template);

    console.log(
      isoDTG +
      ": " +
      mockup.name +
      "(" +
      patternTimers[index].pfuncs.value +
      ")"
    );
  }, mockup.timedelay * 1000);
});

var writeDirtyFilesTimer = setInterval(function() {
  var promises = [];

  console.log("Dirty files: " + Object.keys(dirty));

  if (Object.keys(dirty).length == 0) {
    return;
  }

  if (fileWritePromiseFlag == true) {
    return;
  }

  Object.keys(dirty).forEach(function(fileName) {
    promises.push(
      new Promise((resolve, reject) => {
        fs.writeFile(
          config.RedFishData.path + fileName,
          JSON.stringify(dirty[fileName], null, "\t"),
          "utf-8",
          function(err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
        console.log(fileName + " written.");
      })
    )}
  );

  fileWritePromiseFlag = true;
  Promise.all(promises)
    .then(() => {
      dirty = [];
      fileWritePromiseFlag = false;
    })
    .catch((err) => {
      console.log(">> Error: " + err);
    });
}, 1000);
