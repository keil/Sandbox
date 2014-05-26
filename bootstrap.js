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


  var object = {a:4711, b:4711};
  var handler = new MetaHandler({
    getOwnPropertyDescriptor: function(target, name) {
      return Object.getOwnPropertyDescriptor(target, name);
    },
      defineProperty: function(target, name, desc) {
        print("XXXXXX");
        print(dump(desc));
        return Object.defineProperty(target, name, desc);
      }
  });
  var proxy = new Proxy(object, handler);

  var desc = {value:5};
  //print(dump(desc));

  print("a)"+dump(Object.getOwnPropertyDescriptor(object, "a")));
  print("b)"+dump(Object.getOwnPropertyDescriptor(object, "b")));
  
  Object.defineProperty(proxy, "a", desc);
  Object.defineProperty(object, "b", desc);

  print("a)"+dump(Object.getOwnPropertyDescriptor(proxy, "a")));
  print("b)"+dump(Object.getOwnPropertyDescriptor(proxy, "b")));
  print("a)"+dump(Object.getOwnPropertyDescriptor(object, "a")));
  print("b)"+dump(Object.getOwnPropertyDescriptor(object, "b")));



  







function dump(pd) {
    if(pd===undefined) return "undefined";
    return " value:" + pd.value + " writeable:" + pd.writeable + " enumerable: " + pd.enumerable + " configurable:" + pd.configurable + " get:"+pd.get + " set:"+pd.set;
  }



quit();


// Make a effect demo

//load("test/membrane/Object.has.js");
//load("test/membrane/Object.hasOwn.js");


//load("test/behavior/eval.js");
//load("test/behavior/decompile.js");


// Test haldler calls
//load("demo/handler.js");

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
