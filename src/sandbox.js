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
      __out__.membrane("$."+padding_right(cmd+" ", ".", 30)+((arg!==undefined) ? " "+arg : ""), id);
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
    if(!(fun instanceof Function)) return false;
    else return (FunctionPrototypeToString.apply(fun).indexOf('[native code]') > -1);
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

    // If target is a primitive value, then return target
    if (target !== Object(target)) {
      return target;
    }

    if(target===undefined)
      throw new ReferenceError("Target is undefined.");
    if(global===undefined)
      throw new ReferenceError("Global is undefined."); 

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
      var scope = {}; // TODO, test id this is all to work with prototypes
      var proxy = new Proxy(scope, new Membrane(global, target, scope));
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
  // TODO
  function Membrane(global, target, _scope) {

    if(!(global instanceof Object))
      throw new TypeError("global");

    // TODO, comment
    // TODO, make function
    // TODO, clone target
    for (property in target) {
      // TODO rename _scope to scioe
      _scope[property]=target[property];
    }

    /* 
     * Write scope.
     */
    //    var scope = {};
    // TODO, moved to target


    // TODO, implement clone !
    // without effected flag!

    /*
     * List of effected properties
     */
    var properties = new Set();
    // TODO, comment
    function affected(property) {
      return properties.has(property);
    }
    // TODO, comment
    function unaffected(property) {
      return !affected(property);
    }
    // TODO, comment
    function touch(scope, name) {
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

    /** target, name -> boolean
    */
    function doHas(scope, name) {
      /*
         var keys = [];

         for(key in target) {
         keys.add(key);
         }

         for(key in scope) {
         keys.add(key);
         }

         var base = keys.sort();
      // return (name in base);
      */

      // TODO, not correct because of prototype values
      // TODO, not correct because target may change during execution 
      return (affected(name)) ? (name in scope) : (name in target);
    }
    /** target, name -> boolean
     */
    function doHasOwn(scope, name) {
      return (affected(name)) ? Object.prototype.hasOwnProperty.call(scope, name) : Object.prototype.hasOwnProperty.call(target, name);
    }

    /** target, name, receiver -> any
    */
    function doGet(scope, name) {
      // TODO, not correct because of prototype values
      return (affected(name)) ? scope[name] : target[name];
    }
    /** target, name, val, receiver -> boolean
     */
    function doSet(scope, name, value) {
      touch(target, name);
      return (scope[name]=value);
    }
    /** target, name, propertyDescriptor -> any
     */
    function doDefineProperty(scope, name, desc) {
      touch(target, name);
      return Object.defineProperty(scope, name, desc);
    }
    /** target, name -> boolean
     */
    function doDelete(scope, name) {
      touch(target, name);
      // TODO, not correct because of prototype values
      return (delete scope[name]);
    }

    // _____                 
    //|_   _| _ __ _ _ __ ___
    //  | || '_/ _` | '_ (_-<
    //  |_||_| \__,_| .__/__/
    //              |_|      

    this.getOwnPropertyDescriptor = function(scope, name) {
      logc("getOwnPropertyDescriptor", name);

      // TODO switch target
      var desc = Object.getOwnPropertyDescriptor(scope, name);
      if (desc !== undefined) desc.value = wrap(desc, global);
      return desc;
    };
    this.getOwnPropertyNames = function(scope) {
      logc("getOwnPropertyNames");

      // TODO merge property names
      return Object.getOwnPropertyNames(scope);
    };
    this.getPrototypeOf = function(scope) {
      logc("getPrototypeOf");
      // TODO
      return Object.getPrototypeOf(target)
    };
    /** target, name, propertyDescriptor -> any
     */
    this.defineProperty = function(scope, name, desc) {
      logc("defineProperty", name);
      return doDefineProperty(scope, name, desc);
    };
    /** target, name -> boolean
     */
    this.deleteProperty = function(scope, name) {
      logc("deleteProperty", name);
      return doDelete(scope, name);
    };
    this.freeze = function(scope) {
      logc("freeze");

      return Object.freeze(target);
    };
    this.seal = function(scope) {
      logc("seal");

      // TODO
      //      return Object.seal(target);
      return Object.seal(scope);

    };
    this.preventExtensions = function(scope) {
      logc("preventExtensions");
      //       return Object.preventExtensions(target);
      return Object.preventExtensions(scope);
    };
    this.isFrozen = function(scope) {
      logc("isFrozen");

      return Object.isFrozen(scope);
    };
    this.isSealed = function(scope) {
      logc("isSealed");

      return Object.isSealed(scopet);
    };
    this.isExtensible = function(scope) {
      logc("isExtensible");

      return Object.isExtensible(scope);

      return Object.isExtensible(scope);
    };
    /** target, name -> boolean
    */
    this.has = function(scope, name) {
      logc("has", name);
      return doHas(target, name);
    };
    /** target, name -> boolean
     */
    this.hasOwn = function(scope, name) {
      logc("hasOwn", name);
      return doHasOwn(target, name);
    };
    /** target, name, receiver -> any
    */
    this.get = function(scope, name, receiver) {
      logc("get", name);
      return wrap(doGet(scope, name), global);
    };
    /** target, name, val, receiver -> boolean
     */
    this.set = function(scope, name, value, receiver) {
      logc("set", name);
      return doSet(scope, name, value);
    };
    this.enumerate = function(target) {
      logc("enumerate");


      return [];

      // TODO merge property names
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.iterate = function(scope) {
      logc("iterate");

      return [];

      // TODO merge property names
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };

    this.keys = function(scope) {
      logc("keys");
      // TODO merge property names
      return Object.keys(target);
    };
    this.apply = function(scope, thisArg, argsArray) {
      logc("apply");

      // TODO implement apply
      return evaluate(target, global, thisArg, argsArray);
    };
    this.construct = function(target, argsArray) {
      logc("construct");

      // TODO implement construct
      return construct(scope, global, argsArray);
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
    var thisArg = Object.create(fun.prototype);
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
