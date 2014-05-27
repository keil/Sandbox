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

/** Statistix 
 * Sandbox Statistic.
 */
function Statistic() {
  if(!(this instanceof Statistic)) return new Statistic();

  var statistic = {};

  __define("increment", function(op) {
    if(statistic[op]===undefined) statistic[op]=0;
    statistic[op]++;
  }, this);

  __define("toString", function() {
    var string = "Statistic: ";
    for(op in statistic) {
      string += op+":"+statistic[op]+" ";
    }
    return string;
  }, this);
}
