"use strict";

var util = require('util');
var fs = require('fs');

var config = require('./config');
var PFuncs = require('./PatternFuncs');

var patternTimers = [];

config.MockupData.MockupPatterns.forEach(function(value, index) {
   if (!patternTimers[index])
      patternTimers[index] = {};

   patternTimers[index].timer = setInterval(function() {
      var jsonData = JSON.parse(fs.readFileSync(config.RedFishData.path + value.path + "index.json", 'utf-8'));
      console.log(value.name);

      fs.writeFileSync(config.RedFishData.path + value.path + "index.json", JSON.stringify(jsonData, null, "\t"), 'utf-8', function(err) {
         if (err) {
            return console.log(err);
         }
      });
   }, value.timedelay * 1000);
});

/*
for (var pattern in config.MockupData.MockupPatterns) {
   console.log(util.inspect(pattern));
}
*/
