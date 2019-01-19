"use strict";

function PatternFuncs(min, max, step) {
  //default to percent from 0 to 100
  this.min = min || 0;
  this.max = max || 100;
  this.step = step || 1;

  this.value = this.min;
  this.isRev = false;
}

PatternFuncs.prototype.setStep = function(step) {
  this.step = step;
};

PatternFuncs.prototype.sawtooth = function() {
  this.doStep();
  this.doModulo();

  return this.value;
};

PatternFuncs.prototype.pingpong = function() {
  this.doStep();

  if (this.value > this.max) {
    this.doReverse();
    this.value = this.max - (this.value - this.max);
  } else if (this.value < this.min) {
    this.doReverse();
    this.value = this.min - (this.value - this.min);
  }

  this.doModulo();

  return this.value;
};

PatternFuncs.prototype.fullrand = function() {
  this.value =
    Math.floor(Math.random() * (this.max - this.min + 1)) + this.min;

  return this.value;
};

PatternFuncs.prototype.steprand = function() {
  var step = Math.floor(Math.random() * (this.step * 2 + 1)) - this.step;

  this.value += step;
  if (this.value > this.max) {
    this.value = this.max - (this.value - this.max);
  } else if (this.value < this.min) {
    this.value = this.min - (this.value - this.min);
  }

  return this.value;
};

PatternFuncs.prototype.doReverse = function() {
  this.isRev = !this.isRev;
};

PatternFuncs.prototype.doStep = function() {
  this.value += this.step * (this.isRev ? -1 : 1);
};

PatternFuncs.prototype.doModulo = function() {
  this.value = this.modulo(this.value);
};

PatternFuncs.prototype.modulo = function(x) {
  var diff = this.max - this.min + 1;
  x = ((((x - this.min) % diff) + diff) % diff) + this.min;

  return x;
};

module.exports = PatternFuncs;
