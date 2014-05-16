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

  var out = new ShellOut();

  var params = {
    verbose: true,
    out: out
  }

  function run() {
    var sbx = new Sandbox(params);

    var outcomeA = sbx.apply(fun, globalArg, thisArg, argsArray);
    var outcomeB = fun.apply(thisArg, argsArray);

    var result = (outcomeA===outcomeB);

    var id = (sbx!==undefined) ? "@" + sbx.id : "";
    out.out(out.head("Run TestCase # "+name) + " " +id);
    if(result) out.ok();
    else out.fail();

    out.notice("SANDBOX : " + outcomeA);
    out.notice("BASELINE: " + outcomeB);

    if(!result) quit();
  }
  this.run = run; 
}
