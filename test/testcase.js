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
  exit = false;

  var out = new ShellOut();

  var params = {
    verbose: true,
    out: out
  }

  function run() {
    var sbx = new Sandbox(params);

    print("### " + Object.isExtensible(argsArray[0].c));


    try{
      var outcomeA = sbx.apply(fun, globalArg, thisArg, argsArray);
    //  var outcomeA = "ERR";
    } catch(e) {
      var outcomeA = e.toString();
    }

    print("### " + Object.isExtensible(argsArray[0].c));
    Object.preventExtensions(argsArray[0].c);
     print("### " + Object.isExtensible(argsArray[0]));



    try{
      var outcomeB = fun.apply(thisArg, argsArray);
    } catch(e) {
      var outcomeB = e.toString();
    }
    
    var result = (outcomeA===outcomeB);

    var id = (sbx!==undefined) ? "@" + sbx.id : "";
    out.out(out.head("TestCase # "+name) + " " +id);
    if(result) out.ok();
    else out.fail();

    out.notice("SANDBOX : " + outcomeA);
    out.notice("BASELINE: " + outcomeB);

    if(exit && (!result)) quit();
  }
  this.run = run; 
}
