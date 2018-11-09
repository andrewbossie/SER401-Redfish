"use strict";

var util = require('util');
var fs = require('fs');

var config = require('./config');
var PFuncs = require('./PatternFuncs');

var patternTimers = [];

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
