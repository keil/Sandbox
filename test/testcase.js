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

function Testcase(fun, globalArg, thisArg, argsArray, name, quitOnExit) {

  var exit = (quitOnExit!==undefined) ? quitOnExit : true;

  var out = new ShellOut();

  var params = {
    verbose: true,
    out: out
  }

  function run() {
    var sbx = new Sandbox(params);

    try{
      var outcomeA1 = sbx.apply(fun, globalArg, thisArg, argsArray);
    } catch(e) {
      var outcomeA1 = e.toString();
    }

    try{
      var outcomeA2 = sbx.apply(fun, globalArg, thisArg, argsArray);
    } catch(e) {
      var outcomeA2 = e.toString();
    }

    try{
      var outcomeB = fun.apply(thisArg, argsArray);
    } catch(e) {
      var outcomeB = e.toString();
    }
    
    var result = (outcomeA1===outcomeB && outcomeA1===outcomeA2);

    var id = (sbx!==undefined) ? "@" + sbx.id : "";
    out.out(out.head("TestCase # "+name) + " " +id);
    if(result) out.ok();
    else out.fail();

    out.notice("SANDBOX1: " + outcomeA1);
    out.notice("SANDBOX2: " + outcomeA2);
    out.notice("BASELINE: " + outcomeB);

    if(exit && (!result)) quit();
  }
  this.run = run; 
}
