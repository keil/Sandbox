/*
 * TreatJS: Sandbox 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

(new Testcase(function(object) {
  var outcome = "";
  outcome += ((new object.f()) instanceof object.f);
  outcome += ((new (new object.g()).b()) instanceof (new object.g()).b);
  outcome += ((new object.h()) instanceof object.h);
  return outcome;
}, {}, {}, [{
  f:function() { 
    this.a = "4711";},
g:function() {
  this.b = function() {
    this.c = "4712";
  }},
h:function() {
  return {x:4713, y:4714};
}}], "Object.getPrototypeOf")).run();
