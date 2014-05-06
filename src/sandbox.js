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

function Sandbox() {

  /** Membrabe(global)
   * Implements a membrane to evaluate functions in a sandbox
   *
   * @param, the sandboxs global object
   */
  function Membrabe(global) {
    this.getOwnPropertyDescriptor = function(target, name) {
      log("[[getOwnPropertyDescriptor]]", name);
      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc !== undefined) desc.value = wrap(desc, global);
      return desc;
    };
    this.getOwnPropertyNames = function(target) {
      log("[[getOwnPropertyNames]]", name);
      return Object.getOwnPropertyNames(target);
    };
    this.getPrototypeOf = function(target) {
      log("[[getPrototypeOf]]", name);
      return Object.getPrototypeOf(target)
    };
    this.defineProperty = function(target, name, desc) {
      log("[[defineProperty]]", name);
      return Object.defineProperty(target, name, desc);
    };
    this.deleteProperty = function(target, name) {
      log("[[deleteProperty]]", name);
      return delete target[name];
    };
    this.freeze = function(target) {
      log("[[freeze]]", name);
      return Object.freeze(target);
    };
    this.seal = function(target) {
      log("[[seal]]", name);
      return Object.seal(target);
    };
    this.preventExtensions = function(target) {
      log("[[preventExtensions]]", name);
      return Object.preventExtensions(target);
    };
    this.isFrozen = function(target) {
      log("[[isFrozen]]", name);
      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      log("[[isSealed]]", name);
      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      log("[[isExtensible]]", name);
      return Object.isExtensible(target);
    };
    this.has = function(target, name) {
      log("[[has]]", name);
      // TODO
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return (name in target);
    };
    this.hasOwn = function(target, name) {
      log("[[hasOwn]]", name);

      // TODO
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return ({}).hasOwnProperty.call(target, name); 
    };
    this.get = function(target, name, receiver) {
      log("[[get]]", name);

      if (name in scope) {
        return  wrap(scope[name], global);
      } else if(name in target) {
        if( _.Config.nativePassThrough) {
          // pass-through of native functions
          if(isNativeFunction(target[name])) {
            return target[name];
          }
          else return wrap(target[name], global);
        } else {
          return wrap(target[name], global);
        }

      } else {
        violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber); 
      }


      //      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

      // pass-through of Contract System
      // if(name=="$") return target[name];

      /*      if( _.Config.nativePassThrough) {
      // pass-through of native functions
      if(isNativeFunction(target[name])) {
      return target[name];
      }
      else return wrap(target[name], global);
      } else {
      return wrap(target[name], global);
      }
      */
    };
    this.set = function(target, name, value, receiver) {
      log("[[set]]", name);
      // NOTE: no write access allowed
      //violation("XXXX Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      return (scope[name]=value);
      //otherwise use this code:
      //if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //else return target[name] = value;
    };
    this.enumerate = function(target) {
      log("[[enumerate]]", name);
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.keys = function(target) {
      log("[[keys]]");
      return Object.keys(target);
    };
    this.apply = function(target, thisArg, argsArray) {
      log("[[apply]]");
      return evalFunction(target, global, thisArg, argsArray);
    };
    this.construct = function(target, argsArray) {
      log("[[construct]]");
      return evalNew(target, global, this, argsArray);
    };
  };


  function wrap(target, global) { 
    log("[[wrap]]");

    // IF target is primitive value, return target
    if (target !== Object(target)) {
      return target;
    }

    if(cache.contains(target)) {
      return cache.get(target);
    } else { 
      var membraneHandler = new Membrabe(global);
      var proxy = new Proxy(target, membraneHandler);

      cache.put(target, proxy);

      return proxy;
    }
  }
}




function Sandbox(global) {
  if(!(this instanceof Sandbox)) return new Sandbox(global);

  // TODO
  // 

  var scope = {};





  function decompile() {
  }





  this.bind = function() {
  };

  this.apply = function() {
  };

  this.call = function() {
  };

}


function Environment(target) {
  if(!(this instanceof Environment)) return new Environment(target);

  // todo
  function log(arg) {print(arg);}
  function violation(arg) {print(arg);}

  var scope = {};

  function Handler() {
    this.getOwnPropertyDescriptor = function(target, name) {
      log("[[getOwnPropertyDescriptor]]", name);
      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc !== undefined) desc.value = wrap(desc, global);
      return desc;
    };
    this.getOwnPropertyNames = function(target) {
      log("[[getOwnPropertyNames]]", name);
      return Object.getOwnPropertyNames(target);
    };
    this.getPrototypeOf = function(target) {
      log("[[getPrototypeOf]]", name);
      return Object.getPrototypeOf(target)
    };
    this.defineProperty = function(target, name, desc) {
      log("[[defineProperty]]", name);
      return Object.defineProperty(target, name, desc);
    };
    this.deleteProperty = function(target, name) {
      log("[[deleteProperty]]", name);
      return delete target[name];
    };
    this.freeze = function(target) {
      log("[[freeze]]", name);
      return Object.freeze(target);
    };
    this.seal = function(target) {
      log("[[seal]]", name);
      return Object.seal(target);
    };
    this.preventExtensions = function(target) {
      log("[[preventExtensions]]", name);
      return Object.preventExtensions(target);
    };
    this.isFrozen = function(target) {
      log("[[isFrozen]]", name);
      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      log("[[isSealed]]", name);
      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      log("[[isExtensible]]", name);
      return Object.isExtensible(target);
    };
    this.has = function(target, name) {
      log("[[has]]", name);
      // TODO
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return (name in target);
    };
    this.hasOwn = function(target, name) {
      log("[[hasOwn]]", name);

      // TODO
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return ({}).hasOwnProperty.call(target, name); 
    };
    this.get = function(target, name, receiver) {
      log("[[get]]", name);

      if (name in scope) {
        return  wrap(scope[name], global);
      } else if(name in target) {
        if( _.Config.nativePassThrough) {
          // pass-through of native functions
          if(isNativeFunction(target[name])) {
            return target[name];
          }
          else return wrap(target[name], global);
        } else {
          return wrap(target[name], global);
        }

      } else {
        violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber); 
      }


      //      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);

      // pass-through of Contract System
      // if(name=="$") return target[name];

      /*      if( _.Config.nativePassThrough) {
      // pass-through of native functions
      if(isNativeFunction(target[name])) {
      return target[name];
      }
      else return wrap(target[name], global);
      } else {
      return wrap(target[name], global);
      }
      */
    };
    this.set = function(target, name, value, receiver) {
      log("[[set]]", name);
      // NOTE: no write access allowed
      //violation("XXXX Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      return (scope[name]=value);
      //otherwise use this code:
      //if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //else return target[name] = value;
    };
    this.enumerate = function(target) {
      log("[[enumerate]]", name);
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.keys = function(target) {
      log("[[keys]]");
      return Object.keys(target);
    };
  };

  print("XX" + target.a);
  return new Proxy(target, new Handler(target));
}



