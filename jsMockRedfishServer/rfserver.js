var express = require('express');

var PFuncs = require('./PatternFuncs');

var sawtooth = new PFuncs();
var revtooth = new PFuncs();
var pingpong = new PFuncs();

console.log(pfuncs.value);

for (var i = 0; i < 120; i++) {
   pfuncs.sawtooth();
}

console.log(pfuncs.value);
