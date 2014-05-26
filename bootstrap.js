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


load("lib/padding.js")

load("src/misc.js");
load("src/out.js");
load("src/shell.js");

// TODO
load("src/this.js");

load("src/effect.js");
load("src/sandbox.js");

load('test/testcase.js');
load('test/metahandler.js');

// ==================================================

// TODO, test
// value in get property descriptor



  
this.isFrozen = function(target) {
      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      return Object.isExtensible(target);
    };


// Test effect system
//load("demo/effect.js");

/*
  var object = {};
  var handler = new MetaHandler({
    preventExtensions: function(target) {
      return Object.preventExtensions(target);
    },
      isExtensible: function(target) {
        return Object.isExtensible(target);
      }
  });
  var proxy = new Proxy(object, handler);

  
  print(Object.isFrozen(proxy));
  print(Object.isFrozen(object));

  Object.preventExtensions(object);
  Object.freeze(proxy);

  print(Object.isExtensible(proxy));
  print(Object.isExtensible(object));

  print(Object.isFrozen(proxy));
  print(Object.isFrozen(object));

  print(Object.isSealed(proxy));
  print(Object.isSealed(object));
*/

//load("test/membrane/Object.getPrototypeOf.js");

//load("test/membrane/Object.freeze.js");
load("test/membrane/Object.getOwnPropertyDescriptor.js");
//load("test/membrane/Object.seal.js");








// ==================================================

quit();
