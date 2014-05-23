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

(new Testcase(function(F) {
  var f = F();
  var outcome = "";
  var x = "[LOCAL]";
  outcome+=" /"+(x);
  outcome+=" /"+(this.x);
//  outcome+=" /"+f();
  outcome+=" /"+f.call(this);
  outcome+=" /"+(x);
  outcome+=" /"+(this.x);
  return outcome;
}, this, {x:"[THIS]"}, [(function() {
  var x = "[FUNCTION] ";
  return function() {
    var outcome = " IN(";
    outcome+=" /"+(x);
    outcome+=" /"+(this.x);
    x="[4711]";
    this.x="[4712]";
    outcome+=" /"+(x);
    outcome+=" /"+(this.x);
    return outcome+") ";
  };
})], "decompile # 1")).run();

(new Testcase(function(F) {
  var f = F();
  var outcome = "";
  var x = "[LOCAL]";
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
  outcome+=" /"+f();
//  outcome+=" /"+f.call(this);
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
  return outcome;
}, this, {x:"[THIS]"}, [(function() {
  var x = "[FUNCTION] ";
  return function() {
    var outcome = " IN(";
//    outcome+=" /"+(x);
    outcome+=" /"+(this.x);
    x="[4711]";
    this.x="[4712]";
//    outcome+=" /"+(x);
    outcome+=" /"+(this.x);
    return outcome+") ";
  };
})], "decompile # 2")).run();

