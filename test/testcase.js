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

function Testcase(func, fixture, name) {

  function run() {
    var sbx = new SandboxEnvironment(fixture);
    var sbxFun = sbx.bind(func);

    var outcomeA = sbx.bind(func).apply({}, [])
    var outcomeB = func.apply({}, []);

    var result = (outcomeA===outcomeB);

    print("# " + name + " - " + result);
    if(true || !result) {
      print("A) " + outcomeA);
      print("B) " + outcomeB);
    } 
  }

  this.run = run; 
}



load('test/membrane/object.hasown.js');
