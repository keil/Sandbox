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
  Object.seal(object.c);

  object.a = "~";
  delete object.b;
  object.x = "~";

  object.c.x = "~";
  delete object.c.y;
  object.c.z = "~";

  var outcome = "" + object.a + object.b + object.c.x + object.c.y + object.c.z + object.x;
  return outcome;
}, {}, {}, [{a:4711, b:4712, c:{x:4713, y:4714}}], "Object.seal")).run();