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

/** JavaScript Sandbox
 * @param params Object
 *
 * Sandbox Optione
 *
 * - verbose
 *   Enables verbose mode. (default: false)
 *
 * - decompile
 *   Decompiles functions. (default: true)
 *
 * - membrane
 *   Implements a sandbox membrane. (default: true)
 *
 * - nativepassthrough
 *   Tells the sandbox to do not decompile natice functins. (default: true)
 *
 * - out
 *   Instance for the output. (default: new Out())
 *
 */
function Sandbox(params) {
  if(!(this instanceof Sandbox)) return new Sandbox(params);

  /** 
   * Verbose Mode
   * (default: false)
   */
  var __verbose__ = configure("verbose", false);

  /*
   * Decompile
   * (default: true)
   */
  var __decompile__ = configure("decompile", true);

  /*
   * Membrane
   * (default: true)
   */
  var __membrane__ = configure("membrane", true);

  /*
   * Native Function pass-through
   * (default: true)
   */
  var __nativepassthrough__ = configure("nativepassthrough", true);

  /*
   * Output
   * (default:null);
   */
  var __out__ = configure("out", new Out());

  //              __ _                   
  // __ ___ _ _  / _(_)__ _ _  _ _ _ ___ 
  /// _/ _ \ ' \|  _| / _` | || | '_/ -_)
  //\__\___/_||_|_| |_\__, |\_,_|_| \___|
  //                  |___/              
  function configure(param, value) {
    return (param in (params===undefined ? {} : params)) ? params[param] : value;
  };

  // _           
  //| |___  __ _ 
  //| / _ \/ _` |
  //|_\___/\__, |
  //       |___/ 

  var id = this;

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg) {
    if(__verbose__) {
      __out__.membrane(msg, id);
    }
  }

  /** logc(msg)
   * @param msg String message
   */ 
  function logc(cmd, arg) {
    if(__verbose__) {
      __out__.membrane("$."+cmd+"("+((arg!==undefined) ? arg : "")+")", id);
    }
  }

  // _    _  _      _   _         ___             _   _          
  //(_)__| \| |__ _| |_(_)_ _____| __|  _ _ _  __| |_(_)___ _ _  
  //| (_-< .` / _` |  _| \ V / -_) _| || | ' \/ _|  _| / _ \ ' \ 
  //|_/__/_|\_\__,_|\__|_|\_/\___|_| \_,_|_||_\__|\__|_\___/_||_|

  var FunctionPrototypeToString = Function.prototype.toString;

  /** isNative(fun)
   * Checks whether the given function is a native function or not.
   *
   * @param fuc Function Object
   * @return true, if fun is a native function, false otherwise
   */
  function isNative(fun) {
    if(!(fuc instanceof Function)) return false;
    else return (FunctionPrototypeToString.apply(func).indexOf('[native code]') > -1);
  }

  //__ __ ___ _ __ _ _ __ 
  //\ V  V / '_/ _` | '_ \
  // \_/\_/|_| \__,_| .__/
  //                |_|   

  var cache = new WeakMap();

  /** 
   * wrap(target)
   * Wraps a target object.
   *
   * @param target The Target Object.
   * @param global The current Global Object.
   * @return JavaScript Proxy 
   */
  function wrap(target, global) { 
    logc("wrap", target);

    if(target===undefined)
      throw new ReferenceError("Target is undefined.");
    if(global===undefined)
      throw new ReferenceError("Global is undefined.");

    // If target is a primitive value, then return target
    if (target !== Object(target)) {
      return target;
    }

    // Membrane ? 
    if(!(__membrane__))
      return target;

    // Native Function pass-through
    if((target instanceof Function) && __nativepassthrough__) {
      if(isNative(target)) {
        return target;
      }
    }

    // If target already wrapped, return cached proxy
    if(cache.has(target)) {
      return cache.get(target);
    } else {
      var proxy = new Proxy(target, new Membrane(global));
      cache.set(target, proxy);
      return proxy;
    }
  }

  // __  __           _                      
  //|  \/  |___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| |\/| / -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|  |_\___|_|_|_|_.__/_| \__,_|_||_\___|

  /** Membrabe(global)
   * Implements a sandbox membrane.
   *
   * @param global The current Global Object.
   */
  function Membrane(global) {

    if(!(global instanceof Object))
      throw new TypeError("global");

    /* 
     * Write scope.
     */
    var scope = {};

    /*
     * List of effected properties
     */
    var properties = new Set();

    function affected(property) {
      return properties.has(property);
    }

    function unaffected(property) {
      return !affected(property);
    }

    function touch(target, name) {
      if(unaffected(name)) {
        scope[name]=target[name];
        properties.add(name);
      }
    }

    //  ___                     _   _             
    // / _ \ _ __  ___ _ _ __ _| |_(_)___ _ _  ___
    //| (_) | '_ \/ -_) '_/ _` |  _| / _ \ ' \(_-<
    // \___/| .__/\___|_| \__,_|\__|_\___/_||_/__/
    //      |_|                                   

    function doHas(target, name) {
      // TODO, not correct because of prototype values
      return (affected(name)) ? (name in scope) : (name in target);
    }


    function doHasOwn(target, name) {
      return (affected(name)) ? Object.prototype.hasOwnProperty.call(scope, name) : Object.prototype.hasOwnProperty.call(target, name);
    }

    function doGet(target, name) {
      // TODO, not correct because of prototype values
      return (affected(name)) ? scope[name] : target[name];
    }

    function doSet(target, name, value) {
      touch(target, name);
      return (scope[name]=value);
    }

    function doDelete(target, name) {
      // TODO, not correct because of prototype values

      touch(target, name);
      return (delete scope[name]);
    }

    // _____                 
    //|_   _| _ __ _ _ __ ___
    //  | || '_/ _` | '_ (_-<
    //  |_||_| \__,_| .__/__/
    //              |_|      

    this.getOwnPropertyDescriptor = function(target, name) {
      logc("getOwnPropertyDescriptor", name);

      // TODO switch target
      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc !== undefined) desc.value = wrap(desc, global);
      return desc;
    };
    this.getOwnPropertyNames = function(target) {
      logc("getOwnPropertyNames", name);

      // TODO merge property names
      return Object.getOwnPropertyNames(target);
    };
    this.getPrototypeOf = function(target) {
      logc("getPrototypeOf");

      return Object.getPrototypeOf(target)
    };
    this.defineProperty = function(target, name, desc) {
      logc("defineProperty", name);

      return Object.defineProperty(scope, name, desc);
    };
    this.deleteProperty = function(target, name) {
      logc("deleteProperty", name);

      return doDelete(target, name);

      // TODO, implement delete
      //return delete target[name];
    };
    this.freeze = function(target) {
      logc("freeze");

      return Object.freeze(target);
    };
    this.seal = function(target) {
      logc("seal");

      return Object.seal(target);
    };
    this.preventExtensions = function(target) {
      logc("preventExtensions");

      return Object.preventExtensions(target);
    };
    this.isFrozen = function(target) {
      logc("isFrozen");

      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      logc("isSealed");

      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      logc("isExtensible");

      return Object.isExtensible(target);
    };
    this.has = function(target, name) {
      logc("has", name);

      return doHas(target, name);

      // TODO switch target
      //if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      //else return (name in target);
    };
    this.hasOwn = function(target, name) {
      logc("hasOwn", name);

      // TODO switch target
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return ({}).hasOwnProperty.call(target, name); 
    };
    this.get = function(target, name, receiver) {
      logc("get", name);
      // TODO, test
      return wrap(doGet(target, name), global);
    };
    this.set = function(target, name, value, receiver) {
      logc("set", name);

      return doSet(target, name, value);

      // XTODO, test if property is writable
      //return (scope[name]=value);
    };
    this.enumerate = function(target) {
      logc("enumerate");

      // TODO merge property names
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.iterate = function(target) {
      logc("iterate");

      // TODO merge property names
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };

    this.keys = function(target) {
      logc("keys");

      // TODO merge property names
      return Object.keys(target);
    };
    this.apply = function(target, thisArg, argsArray) {
      logc("apply");

      // TODO implement apply
      return evalaluate(target, global, thisArg, argsArray);
    };
    this.construct = function(target, argsArray) {
      logc("construct");

      // TODO implement construct
      return construct(target, global, this, argsArray);
    };
  };

  //    _                       _ _     
  // __| |___ __ ___ _ __  _ __(_) |___ 
  /// _` / -_) _/ _ \ '  \| '_ \ | / -_)
  //\__,_\___\__\___/_|_|_| .__/_|_\___|
  //                      |_|           

  // TODO
  // Implement a decompile cache.
  // This could look as follows:
  //
  // WeakMap: Function -> Global -> Sbxed

  /** decompile
   * Decompiles functions.
   * @param fun JavaScript Function
   * @param env The current Global Object
   * @return JavaScript Function
   */
  function decompile(fun, env) {
    logc("decompile");

    if(!(fun instanceof Function))
      throw new TypeError("fun");
    if(!(env instanceof Object))
      throw new TypeError("env");

    // Decompile ?
    if(!(__decompile__))
      return fun;

    var body = "(" + fun.toString() + ")"; 
    var sbxed = eval("(function() { with(env) { return " + body + " }})();");

    return sbxed;
  }

  /** evaluate
   * Evaluates the given function.
   * @param fun JavaScript Function
   * @param globalArg The current Global Object
   * @param thisArg The current this Object
   * @param argsArray The Function arguments
   * @return Any
   */
  function evaluate(fun, globalArg, thisArg, argsArray) {
    logc("evaluate");

    if(!(globalArg instanceof Object))
      throw new TypeError("globalArg");
    if(!(thisArg instanceof Object))
      throw new TypeError("thisArg");
    if(!(argsArray instanceof Array))
      throw new TypeError("argsArray");

    // sandboxed function
    var sbxed = decompile(fun, wrap(globalArg, globalArg));
    // apply constructor function
    var val = sbxed.apply(wrap(thisArg, globalArg), wrap(argsArray, globalArg));
    // return val
    return val;

    // TODO
    // Is it required to wrap the return?
  }

  /** Construct
   * Evaluates the given constructor.
   * @param fun JavaScript Function
   * @param globalArg The current Global Object
   * @param argsArray The Function arguments
   * @return Object
   */
  function construct(fun, globalArg, argsArray) {
    logc("construct");

    if(!(globalArg instanceof Object))
      throw new TypeError("globalArg");
    if(!(argsArray instanceof Array))
      throw new TypeError("argsArray");

    // sandboxed function
    var sbxed = decompile(fun, wrap(globalArg, globalArg));
    // new this reference
    var thisArg = Object.create(secureFun.prototype);
    // apply function
    var val = sbxed.apply(wrap(thisArg, globalArg), wrap(argsArray, globalArg));
    // return thisArg | val
    return (val instanceof Object) ? val : thisArg;

    // TODO
    // Is it required to wrap the return?
  }

  /** bind
   * Binds the given function in the sandbox.
   * @param fun JavaScript Function
   * @param globalArg The current Global Object
   * @param thisArg The current this Object
   * @param argsArray The Function arguments
   * @return Any
   */
  function bind(fun, globalArg, thisArg, argsArray) {
    logc("bind");

    if(!(globalArg instanceof Object))
      throw new TypeError("globalArg");
    if(!(thisArg instanceof Object))
      throw new TypeError("thisArg");
    if(!(argsArray instanceof Array))
      throw new TypeError("argsArray");

    // sandboxed function
    var sbxed = decompile(fun, wrap(globalArg, globalArg));
    // bind thisArg
    var bound = sbxed.bind(wrap(thisArg, globalArg));
    // bind arguments
    for(var arg in argsArray) {
      bound = bound.bind(null, arg);
    }
    // return bound function
    return bound;

    // TODO
    // Is it required to wrap the return?
  }

  //   _             _      
  //  /_\  _ __ _ __| |_  _ 
  // / _ \| '_ \ '_ \ | || |
  ///_/ \_\ .__/ .__/_|\_, |
  //      |_|  |_|     |__/ 

  __define("apply", function(fun, globalArg, thisArg, argsArray) {

    if(!(fun instanceof Function))
    throw new TypeError("No function object.");

  globalArg = (globalArg!==undefined) ? globalArg : new Object();
  thisArg = (thisArg!==undefined) ? thisArg : globalArg;
  argsArray = (argsArray!==undefined) ? argsArray : new Array();

  // TODO, is it required to wrap the return value ?
  return evaluate(fun, globalArg, thisArg, argsArray);
  }, this);

  //  ___      _ _ 
  // / __|__ _| | |
  //| (__/ _` | | |
  // \___\__,_|_|_|

  __define("call", function(fun, globalArg, thisArg) {

    if(!(fun instanceof Function))
    throw new TypeError("No function object.");

  globalArg = (globalArg!==undefined) ? globalArg : new Object();
  thisArg = (thisArg!==undefined) ? thisArg : globalArg;

  // TODO, is it required to wrap the return value ?
  return evaluate(fun, globalArg, thisArg, arguments);
  }, this);

  // ___ _         _ 
  //| _ |_)_ _  __| |
  //| _ \ | ' \/ _` |
  //|___/_|_||_\__,_|

  __define("bind", function(fun, globalArg, thisArg, argsArray) {

    if(!(fun instanceof Function))
    throw new TypeError("No function object.");

  globalArg = (globalArg!==undefined) ? globalArg : new Object();
  thisArg = (thisArg!==undefined) ? thisArg : globalArg;
  argsArray = (argsArray!==undefined) ? argsArray : new Array();

  // TODO, is it required to wrap the return value ?
  return bind(fun, globalArg, thisArg, argsArray);
  }, this);
}

// ___               _ _               ___ ___  
/// __| __ _ _ _  __| | |__  _____ __ |_ _|   \ 
//\__ \/ _` | ' \/ _` | '_ \/ _ \ \ /  | || |) |
//|___/\__,_|_||_\__,_|_.__/\___/_\_\ |___|___/ 

Object.defineProperty(Sandbox.prototype, "id", {
  get: (function() {
    var str = "SBX";
    var i = 0;

    function makeID() {
      i = i+1;
      return (str+(padding_left(String(i), "0", 3)));
    }

    return function() {
      var id = makeID();

      Object.defineProperty(this, "id", {
        get: function() { return id; }});

      return id;
    };
  })()
});

// _       ___ _       _           
//| |_ ___/ __| |_ _ _(_)_ _  __ _ 
//|  _/ _ \__ \  _| '_| | ' \/ _` |
// \__\___/___/\__|_| |_|_||_\__, |
//                           |___/ 

Object.defineProperty(Sandbox.prototype, "toString", {
  get: function() {
    return function() { return "[[Sandbox#" + this.id + "]]"; };
  }
});
