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
/*
var id = "[Global]";

(new Testcase(function() {
  var outcome = "";
  outcome+=id;

  return outcome;
}, this, {id:"[This]"}, [], "decompile # 1", true)).run();


(function() {

  this.idx = "[Global]";

  (new Testcase(function() {
    var outcome = "";
    outcome+=idx;

    return outcome;
  }, this, {id:"[This]"}, [], "decompile # 2", true)).run();

})(this);

(new Testcase(function() {
  var outcome = "";
  outcome+=this.id;

  return outcome;
}, this, {id:"[This]"}, [], "decompile # 3", true)).run();





var uid = "[Global UID]";

(new Testcase(function(f) {
  var outcome = "";
  outcome+=f();
  return outcome;
}, this, {uid:"[This UID]"}, [function() {
  return uid;
}], "decompile # 4", true)).run();



var uid = "[Global UID]";

(new Testcase(function(f) {
  var outcome = "";
  outcome+=this.uid;
  outcome+=f();
  return outcome;
}, this, {uid:"[This UID]"}, [function() {
  return this.uid;
}], "decompile # 5", true)).run();

var uid = "[Global UID]";

(new Testcase(function(f) {
  var outcome = "";
  outcome+=f()();
  return outcome;
}, this, {uid:"[This UID]"}, [function() {
  return function() {
    return uid;
  };
}], "decompile # 6.1", true)).run();

(new Testcase(function(f) {
  var uid = "[IN]";
  var outcome = "";
  outcome+=f()();
  return outcome;
}, this, {uid:"[This UID]"}, [function() {
  return function() {
    return uid;
  };
}], "decompile # 6.2", true)).run();

*/


var uid = "[Global UID]";

(new Testcase(function(f) {
  var outcome = "";
  outcome+=this.uid;
  outcome+=f()();
  return outcome;
}, this, {uid:"[This UID]"}, [function() {
   return function() {
    return this.uid;
  };
}], "decompile # 5", true)).run();






quit();


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
}, {id:"[Global]"}, {x:"[This]"}, [(function() {
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
})], "decompile # 1", false)).run();

print(x);
print(this.x);



quit();


(new Testcase(function(F) {
  var f = F();
  var outcome = "";
  var x = "[LOCAL]";
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
//  outcome+=" /"+f();
  outcome+=" /"+f.call(this);
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
})], "decompile # 1")).run();



(new Testcase(function(F) {
  var f = F();
//  var f = F.apply(this);

  var outcome = "";
  var x = "[LOCAL]";
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
  outcome+=" /"+f();
//  outcome+=" /"+f.call(this);
//  outcome+=" /"+(x);
//  outcome+=" /"+(this.x);
  return outcome;
}, {}, {x:"[THIS]"}, [(function() {
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

