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

  // _    ___          _ 
  //(_)__| __|_ ____ _| |
  //| (_-< _|\ V / _` | |
  //|_/__/___|\_/\__,_|_|

  var GlobalEval = eval;

  /** isEval(fun)
   * Checks whether the given function is the global eval function or not.
   *
   * @param fuc Function Object
   * @return true, if fun is eval, false otherwise
   */
  function isEval(fun) {
    if(!(fun instanceof Function)) return false;
    else return (fun===GlobalEval);
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

    // TODO
    // * wrap eval to support it
    // * test the support of eval when behaviot/eval succeeds
    // ** Access to Math.abd
    // ** ...
    if(isEval(target)) {
      throw new Error("eval nut supported");
    }

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

      // decompiles function or clones object
      // to preserve typeof/ instanceof
      // and to make an iterable image for loops
      if(target instanceof Function) {
        var scope = cloneFunction(target, global)
      } else {
        var scope = cloneObject(target);
      }

      // TODO
      // * implement a meta handler
      // * meta handler checks if the trap is implemented and throws an exception otherwise

      var proxy = new Proxy(scope, new Membrane(global, target, scope));
      cache.set(target, proxy);
      return proxy;
    }
  }

  /**
   * cloneObject(target)
   * clones a JavaScript Object
   *
   * @param target JavaScript Object
   * @return JavaScript Object
   */
  function cloneObject(target) {
    if(!(target instanceof Object))
      throw new Error("No JavaScript Object.");

    var clone = Object.create(Object.getPrototypeOf(target));

    // TODO
    // * discuss flag about building shadow trees
    // ** object[property] = wrap(target[property], global);

    for (var property in target) {
      if (target.hasOwnProperty(property)) clone[property] = target[property];
    }
    return clone;
  }

  /**
   * cloneFunction(target)
   * clones a JavaScript Function
   *
   * @param target JavaScript Function
   * @return JavaScript Function
   */
  function cloneFunction(target, global) {
    if(!(target instanceof Function))
      throw new Error("No JavaScript Function.");

    var clone = decompile(target, wrap(global, global));
    clone.prototype = target.prototype;
    return clone;
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
  function Membrane(global, target) {
    if(!(global instanceof Object))
      throw new TypeError("global");

    /*
     * List of effected properties
     */
    var properties = new Set();

    /** Returns true if the property was touched by the sandbox, false otherwise
     */
    function affected(property) {
      return properties.has(property);
    }
    /** Returns true if the property was not touched by the sandbox, false otherwise
     */
    function unaffected(property) {
      return !affected(property);
    }
    /** Flags a property as touched
     */
    function touch(scope, name) {
      if(unaffected(name)) {
        // TODO
        // *PreStateSnapshot */
        // update current scope required ?
        // scope[name]=target[name];
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
      return (affected(name)) ? scope[name] : wrap(target[name], global);
    }
    /** target, name, val, receiver -> boolean
    */
    function doSet(scope, name, value) {
      touch(scope, name); 
      return (scope[name]=value);
    }
    /** target, name, propertyDescriptor -> any
    */
    function doDefineProperty(scope, name, desc) {
      touch(scope, name);
      return Object.defineProperty(scope, name, desc);
    }
    /** target, name -> boolean
    */
    function doDelete(scope, name) {
      touch(scope, name);
      return (delete scope[name]);
    }
    /** target -> [String]
    */
    function doEnumerate(scope) {
      // Note: Trap is never called
    }
    /** target -> iterator
    */
    function doIterate(scope) {
      // Note: Trap is never called
    }
    /** target -> [String]
    */
    function doKeys(scope) {
      // NOTE: Matthias Keil (May 21 2014)
      // The order of
      // *Object.getOwnPropertyNames*
      // corresponds to the order provided by the for...in loop.
      return Object.keys(scope);
    }
    /** target, name -> PropertyDescriptor | undefined
     */
    function doGetOwnPropertyDescriptor(scope, name) {
      if(affected(name)) {
        return Object.getOwnPropertyDescriptor(scope, name);
      } else {
        var desc = Object.getOwnPropertyDescriptor(scope, name);
        if (desc !== undefined) desc.value = wrap(desc.value, global);
        return desc;
      }
    }
    /** target -> [String]
     */
    function doGetOwnPropertyNames(scope) {
      // NOTE: Matthias Keil (May 21 2014)
      // The order of
      // *Object.getOwnPropertyNames*
      // corresponds to the order provided by the for...in loop.
      return Object.getOwnPropertyNames(scope);
    }

    // _____                 
    //|_   _| _ __ _ _ __ ___
    //  | || '_/ _` | '_ (_-<
    //  |_||_| \__,_| .__/__/
    //              |_|      

    /** target, name -> PropertyDescriptor | undefined
     */
    this.getOwnPropertyDescriptor = function(scope, name) {
      logc("getOwnPropertyDescriptor", name);
      return doGetOwnPropertyDescriptor(scope, name);
    };
    /** target -> [String]
     */
    this.getOwnPropertyNames = function(scope) {
      logc("getOwnPropertyNames");
      return doGetOwnPropertyNames(scope);
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
    /** target -> boolean
    */
    this.freeze = function(scope) {
      logc("freeze");
      return Object.freeze(scope);
    };
    /** target -> boolean
    */
    this.seal = function(scope) {
      logc("seal");
      return Object.seal(scope);
    };
    /** target -> boolean
    */
    this.preventExtensions = function(scope) {
      logc("preventExtensions");
      return Object.preventExtensions(scope);
    };
    /** target -> boolean
    */
    this.isFrozen = function(scope) {
      logc("isFrozen");
      return Object.isFrozen(scope);
    };
    /** target -> boolean
    */
    this.isSealed = function(scope) {
      logc("isSealed");
      return Object.isSealed(scopet);
    };
    /** target -> boolean
    */
    this.isExtensible = function(scope) {
      logc("isExtensible");
      return Object.isExtensible(scope);
    };
    /** target, name -> boolean
    */
    this.has = function(scope, name) {
      logc("has", name);
      return doHas(scope, name);
    };
    /** target, name -> boolean
    */
    this.hasOwn = function(scope, name) {
      logc("hasOwn", name);
      return doHasOwn(scope, name);
    };
    /** target, name, receiver -> any
    */
    this.get = function(scope, name, receiver) {
      logc("get", name);
      return doGet(scope, name);
    };
    /** target, name, val, receiver -> boolean
    */
    this.set = function(scope, name, value, receiver) {
      logc("set", name);
      return doSet(scope, name, value);
    };
    /** target -> [String]
    */
    this.enumerate = function(scope) {
      logc("enumerate");
      throw new Error("Unimplemented Trap enumerate.");
      // NOTE: Trap is never called
      // return doEnumnerate(scope);
    };
    /** target -> iterator
    */
    this.iterate = function(scope) {
      logc("iterate");
      throw new Error("Unimplemented Trap iterate.");
      // NOTE: Trap is never called
      // return doIterate(scope);
    };
    /** target) -> [String]
    */
    this.keys = function(scope) {
      logc("keys");
      return doKeys(scope);      
    };
    /** target, thisValue, args -> any
    */
    this.apply = function(scope, thisArg, argsArray) {
      logc("apply");
      // TODO, is it required to wrap this and argments
      // or only when calling an external evaluate
      return scope.apply(wrap(thisArg,global), wrap(argsArray, global));
    };
    /** target, args -> object
    */
    this.construct = function(scope, argsArray) {
      logc("construct");
      // TODO, is it required to decompile the function ?
      // OR move this back to the seperated function!
      // new this reference
      // TODO is it required to wrap the this arg ?
      // it is still an object inside the sandbox
      // therefore it it no need to wrap the objet
      // target is deompiled ?
      var thisArg = wrap(Object.create(target.prototype), global);
      // var thisArg = Object.create(scope)al);
      // apply function
      var val = scope.apply(thisArg, wrap(argsArray, global));
      // return thisArg | val
      return (val instanceof Object) ? val : thisArg;
    };
  };

  //  _____                 _ _               
  // / ____|               | | |              
  //| (___   __ _ _ __   __| | |__   _____  __
  // \___ \ / _` | '_ \ / _` | '_ \ / _ \ \/ /
  // ____) | (_| | | | | (_| | |_) | (_) >  < 
  //|_____/ \__,_|_| |_|\__,_|_.__/ \___/_/\_\

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
    var thisArg = wrap(Object.create(fun.prototype), globalArg);
    // apply function
    var val = sbxed.apply(thisArg, wrap(argsArray, globalArg)); 
    // return thisArg | val
    return (val instanceof Object) ? val : thisArg;
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

  return bind(fun, globalArg, thisArg, argsArray);
  }, this);

  // _______                             _   _                 
  //|__   __|                           | | (_)                
  //   | |_ __ __ _ _ __  ___  __ _  ___| |_ _  ___  _ __  ___ 
  //   | | '__/ _` | '_ \/ __|/ _` |/ __| __| |/ _ \| '_ \/ __|
  //   | | | | (_| | | | \__ \ (_| | (__| |_| | (_) | | | \__ \
  //   |_|_|  \__,_|_| |_|___/\__,_|\___|\__|_|\___/|_| |_|___/


  // TODO
  // * store also effects?

  var effects = new WeakMap();

  // TODO
  // * make comment
  // * test
  // * name: transaction or effect ?
  function trace(target, transaction) {
    if(!(target instanceof Object))
      throw new TypeError("No traget object.");

    if(!(transaction instanceof Transaction))
      throw new Error("No transasction object.");

    if(!effetcs.has(target)) {
      effects.set(target, []);
    }

    return effetcs.get(target).push(transaction);

    // TODO, what to store in a weak map
    // one target walue can have a couple of effects
    // so store:
    // target -> Timestamp -> Transaction
  }

  // TODO
  // * name?
  __define("effetcs", function(target) {
    if(effects.has(target)) return effects.get(target);
    else return [];
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
