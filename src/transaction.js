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

function Transaction() {
}




var Set = new Transaction();


function SetTransaction(target, name, origin, value) {

  var milliseconds = (new Date().getTime());
  var cmd = "SET";

  function conflict?() {
    return (target[name]===origin);
  }

  function commit() {
    return target[name]=value;
  }
  
  function toString() {
    return CMD + " " + name  + " <" + timestamp + "> <" + (conflict()?"Conflict":"NonConflict") + ">";
  }
}

