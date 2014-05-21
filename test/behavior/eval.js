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
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
  this.ZZZ;
//  outcome+=" /"+f();
  outcome+=" /"+f.call(this);
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
  return outcome;
}, this, {x:"[THIS]"}, [(function() {
  var x = "[FUNCTION] ";
  this.XXX;
  return function() {
    this.YYY;
    var outcome = " IN(";
//    outcome+=" /"+(x);
    outcome+=" /"+(this.x);
    x="[4711]";
    this.x="[4712]";
//    outcome+=" /"+(x);
    outcome+=" /"+(this.x);
    return outcome+") ";
  };
})], "eval # 1")).run();





// TODO TEST this with outside created f
// test when f is defined outside// access throught get


/*

   (new Testcase(function(F) {
   var f = F();
   var outcome = "";
   var x = "4711";
   outcome+=(x);
   outcome+=(this.x);
   outcome+=f();
   outcome+=(x);
   outcome+=(this.x);

   return outcome;
   }, this, {x:4711}, [(function() {
   var x = "4711X ";
   return function() {
   var outcome = " IN(";
   outcome+=(x);
   outcome+=(this.x);
   eval("x=4712");
   eval("this.x=4714");
   outcome+=(x);
   outcome+=(this.x);
   return outcome+") ";
   };
   })], "eval")).run();
   */
/*
   (new Testcase(function(f) {
   var outcome = "";
   var x = "4711";

   outcome+=(x);
   outcome+=(this.x);
   outcome+=f();
   outcome+=(x);
   outcome+=(this.x);

   return outcome;
   }, {x:4711}, {x:4711}, [(function() {
   var x = "4711";
   return function() {
   var outcome = " IN(";
   outcome+=(x);
   outcome+=(this.x);
   eval("x=4712");
   eval("this.x=4712");
   outcome+=(x);
   outcome+=(this.x);
   return outcome+") ";
   };
   })()], "eval")).run();
   */
