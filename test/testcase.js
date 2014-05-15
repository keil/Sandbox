/*
 * TreatJS: Higher-Order Contracts for JavaScript 
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

function Testcase(fun, globalArg, thisArg, argsArray, name) {

  function run() {
    // TODO: rename SandboxEnvironment to Sandbox
    var sbx = new SandboxEnvironment(globalArg);

    var outcomeA = sbx.eval(fun, globalArg, thisArg, argsArray)
      var outcomeB = fun.apply(thisArg, argsArray);

    var result = (outcomeA===outcomeB);

    // TODO decoupling of print
    print("# " + name + " .. " + result);
    // TODO output only if false
    if(true || !result) {
      print(" .. Sandbox: " + outcomeA);
      print(" .. Normal:  " + outcomeB);
    } 
  }

  this.run = run; 
}
