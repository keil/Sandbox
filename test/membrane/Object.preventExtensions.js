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

  print(Object.isExtensible(object.c));

  Object.preventExtensions(object.c);

  print(Object.isExtensible(object.c));

/*  object.a = "~";
  delete object.b;
  object.x = "~";

  object.c.x = "~";
  delete object.c.y;*/
  print(Object.isExtensible(object.c));
  print(object.c.z);
  object.c.z = "~";
  print(object.c.z);

  return object.c.z;

  //var outcome = "" + " a)" + object.a + " b)" + object.b + " c.x)" + object.c.x + " c.y)" + object.c.y + " c.z)" + object.c.z + " x)" + object.x;
  //outcome += "?" + Object.isExtensible(object) + " " + Object.isExtensible(object.c);
  //return outcome;
}, {}, {}, [{a:4711, b:4712, c:{x:4713, y:4714}}], "Object.preventExtensions")).run();




print("... EXTRA:    " + (function(object) {
  Object.preventExtensions(object.c);

  /*
  object.a = "~";
  delete object.b;
  object.x = "~";

  object.c.x = "~";
  delete object.c.y;*/
  object.c.z = "~";

  return object.c.z;

//  var outcome = "" + " a)" + object.a + " b)" + object.b + " c.x)" + object.c.x + " c.y)" + object.c.y + " c.z)" + object.c.z + " x)" + object.x;
//  outcome += "?" + Object.isExtensible(object) + " " + Object.isExtensible(object.c);
//  return outcome;
}).apply({}, [{a:4711, b:4712, c:{x:4713, y:4714}}]));



/*
(new Testcase(function(object) {

    print("$$.a "+object.a);
    print("$$.b "+object.b);
    print("$$.c.x "+object.c.x);
    print("$$.c.y "+object.c.y);
    print("$$.c.z "+object.c.z);
    print("$$.x "+object.x);


Object.preventExtensions(object.c);

 print("$$.a "+object.a);
    print("$$.b "+object.b);
    print("$$.c.x "+object.c.x);
    print("$$.c.y "+object.c.y);
    print("$$.c.z "+object.c.z);
    print("$$.x "+object.x);



  object.a = "~";
  delete object.b;
  object.x = "~";

  object.c.x = "~";
  delete object.c.y;
  object.c.z = "~";

  var outcome = "" + " a)" + object.a + " b)" + object.b + " c.x)" + object.c.x + " c.y)" + object.c.y + " c.z)" + object.c.z + " x)" + object.x;
  outcome += "?" + Object.isExtensible(object) + " " + Object.isExtensible(object.c);
  return outcome;
}, {}, {}, [{a:4711, b:4712, c:{x:4713, y:4714}}], "Object.preventExtensions")).run();




print("... EXTRA:    " + (function(object) {
  Object.preventExtensions(object.c);

  object.a = "~";
  delete object.b;
  object.x = "~";

  object.c.x = "~";
  delete object.c.y;
  object.c.z = "~";

  var outcome = "" + " a)" + object.a + " b)" + object.b + " c.x)" + object.c.x + " c.y)" + object.c.y + " c.z)" + object.c.z + " x)" + object.x;
  outcome += "?" + Object.isExtensible(object) + " " + Object.isExtensible(object.c);
  return outcome;
}).apply({}, [{a:4711, b:4712, c:{x:4713, y:4714}}]));
 */
