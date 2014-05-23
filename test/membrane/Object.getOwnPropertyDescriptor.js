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
  Object.defineProperty(object,"a", {value: "~"});
  Object.defineProperty(object,"x", {value: "~", configurable:true});
  Object.defineProperty(object.c,"x", {value: "~"});
  Object.defineProperty(object.c,"z", {value: "~", configurable:true});

  function dump(pd) {
    if(pd===undefined) return "undefined";
    return pd.value + pd.writeable + pd.enumerable + pd.configurable + pd.get + pd.set;
  }

  var outcome = "" + 
  dump(Object.getOwnPropertyDescriptor(object, "a")) +
  dump(Object.getOwnPropertyDescriptor(object, "b")) +
  dump(Object.getOwnPropertyDescriptor(object, "c")) +
  dump(Object.getOwnPropertyDescriptor(object.c, "x")) +
  dump(Object.getOwnPropertyDescriptor(object.c, "y")) +
  dump(Object.getOwnPropertyDescriptor(object.c, "x")) +
  dump(Object.getOwnPropertyDescriptor(object, "x"));

return outcome;
}, this, {}, [{a:4711, b:4712, c:{x:4713, y:4714}}], "Object.getOwnPropertyDescriptor")).run();
