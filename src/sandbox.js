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
 *
 * @param global The Snadbox Global Object
 * @param params Object
 *
 * Sandbox Optione
 *
 * - verbose
 *   Enables verbose mode. (default: false)
 *
 * - statistic
 *   Enables statistic. (default: false)
 *
 * - decompile
 *   Decompiles functions. (default: true)
 *
 * - membrane
 *   Implements a sandbox membrane. (default: true)
 *
 * - effect
 *   Enables effect logging. (default: true)
 *
 * - metahandler
 *   Implements a proxy meta handler. (default: true)
 *
 * - nativepassthrough
 *   Tells the sandbox to do not decompile natice functins. (default: true)
 *
 * - out
 *   Instance for the output. (default: new Out())
 *
 */
function Sandbox(global, params) {
  if(!(this instanceof Sandbox)) return new Sandbox(global, params);

  if(!(global instanceof Object))
    throw new TypeError("No Global Object.");

  /** 
   * Verbose Mode
   * (default: false)
   */
  var __verbose__ = configure("verbose", false);

  /** 
   * Enable Statistic
   * (default: false)
   */
  var __statistic__ = configure("statistic", false);

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
   * Effect
   * (default: true)
   */
  var __effect__ = configure("effect", true);

  /*
   * MetaHandler
   * (default: true)
   */
  var __metahandler__ = configure("metahandler", true);

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

  //    _        _   _    _   _    
  // __| |_ __ _| |_(_)__| |_(_)__ 
  //(_-<  _/ _` |  _| (_-<  _| / _|
  ///__/\__\__,_|\__|_/__/\__|_\__|

  var statistic = new Statistic();

  function increment(op) {
    if(__statistic__) {
      statistic.increment(op);
    }
  }

  //     _     _      _   _          
  //__ _(_)___| |__ _| |_(_)___ _ _  
  //\ V / / _ \ / _` |  _| / _ \ ' \ 
  // \_/|_\___/_\__,_|\__|_\___/_||_|

  function violation(msg) {
    // TODO, is it better to return undefined ?
    throw new Error("Unauthorized Access: "+msg);
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
   * @return JavaScript Proxy 
   */
  function wrap(target) { 
    logc("wrap", (typeof target) + "=" + target);

    // If target is a primitive value, then return target
    if (target !== Object(target)) {
      return target;
    }

    increment("wrap");

    if(target===undefined)
      throw new ReferenceError("Target is undefined.");

    // Membrane ? 
    if(!(__membrane__))
      return target;

    if(isEval(target)) {
      throw new Error("eval not supported");
    }

    // Native Function pass-through
    if((target instanceof Function) && __nativepassthrough__) {
      if(isNative(target)) {
        return target;
      }
    }

    // If target already wrapped, return cached proxy
    if(cache.has(target)) {
      log("Cache hit.");
      increment("Cache hit");
      return cache.get(target);
    } else {
      log("Cache miss.");
      increment("Cache miss");

      // decompiles function or clones object
      // to preserve typeof/ instanceof
      // and to make an iterable image for loops
      if(target instanceof Function) {
        log("target instanceOf Function");
        var scope = cloneFunction(target)
      } else {
        log("target instanceOf Object");
        var scope = cloneObject(target);
      }

      function make(handler) {
        // meta handler ?
        if(!__metahandler__) return handler;

        var metahandler = {
          get: function(target, name) {
            log("Call Trap: "+name);
            if(name in handler) return target[name];
            else throw new ReferenceError("Trap "+name+" not implemented.");
          }
        };
        return new Proxy(handler, metahandler)
      }

      var handler = make(new Membrane(target))
      var proxy = new Proxy(scope, handler);
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
    log("Clone Object.");

    if(!(target instanceof Object))
      throw new Error("No JavaScript Object.");

    var clone = Object.create(Object.getPrototypeOf(target));

    // TODO
    // * discuss flag about building shadow trees
    // ** object[property] = wrap(target[property]);

    for (var property in target) {
      if (target.hasOwnProperty(property)) {
        var descriptor = Object.getOwnPropertyDescriptor(target, property);
        Object.defineProperty(clone, property, descriptor);
      }   
       // clone[property] = target[property];
    }
//    return target;
    return clone;
  }

  /**
   * cloneFunction(target)
   * clones a JavaScript Function
   *
   * @param target JavaScript Function
   * @return JavaScript Function
   */
  function cloneFunction(target) {
    log("Clone Function.");

    if(!(target instanceof Function))
      throw new Error("No JavaScript Function.");

    var clone = decompile(target, wrap(global));
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
   * @param origin The current Global Object.
   */
  function Membrane(origin) {
    if(!(origin instanceof Object))
      throw new TypeError("No Origin (Target) Object.");

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
        // scope[name]=origin[name];
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
      var has = (affected(name)) ? (name in scope) : (name in origin);

      // TODO
      // is violation the right way
      // otherwise return true and say get to return undefined
      if(has===false) violation(name);

      return (affected(name)) ? (name in scope) : (name in origin);
    }
    /** target, name -> boolean
    */
    function doHasOwn(scope, name) {
      return (affected(name)) ? Object.prototype.hasOwnProperty.call(scope, name) : Object.prototype.hasOwnProperty.call(origin, name);
    }
    /** target, name, receiver -> any
    */
    function doGet(scope, name) {
      return (affected(name)) ? scope[name] : wrap(origin[name]);
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
      // Note: Matthias Keil
      // Object.defineProperty is not equivalent to the behavior 
      // described in the ECMA Standard
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
        var desc = Object.getOwnPropertyDescriptor(origin, name);
        if (desc.value !== undefined) desc.value = wrap(desc.value);
        if (desc.get !== undefined) desc.get = wrap(desc.get);
        if (desc.set !== undefined) desc.set = wrap(desc.set);
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
      trace(new Effect.GetOwnPropertyDescriptor(origin, name));

      return doGetOwnPropertyDescriptor(scope, name);
    };
    /** target -> [String]
    */
    this.getOwnPropertyNames = function(scope) {
      logc("getOwnPropertyNames");
      trace(new Effect.GetOwnPropertyNames(origin));

      return doGetOwnPropertyNames(scope);
    };
    /** target, name, propertyDescriptor -> any
    */
    this.defineProperty = function(scope, name, desc) {
      logc("defineProperty", name);
      trace(new Effect.DefineProperty(origin, name, desc));

      return doDefineProperty(scope, name, desc);
    };
    /** target, name -> boolean
    */
    this.deleteProperty = function(scope, name) {
      logc("deleteProperty", name);
      trace(new Effect.DeleteProperty(origin, name));

      return doDelete(scope, name);
    };
    /** target -> boolean
    */
    this.freeze = function(scope) {
      logc("freeze");
      trace(new Effect.Freeze(origin));

      return Object.freeze(scope);
    };
    /** target -> boolean
    */
    this.seal = function(scope) {
      logc("seal");
      trace(new Effect.Seal(origin));

      return Object.seal(scope);
    };
    /** target -> boolean
    */
    this.preventExtensions = function(scope) {
      logc("preventExtensions");
      trace(new Effect.PreventExtensions(origin));

      return Object.preventExtensions(scope);
    };
    /** target -> boolean
    */
    this.isExtensible = function(scope) {
      logc("isExtensible");
      trace(new Effect.IsExtensible(origin));

      return Object.isExtensible(scope);
    };
    /** target, name -> boolean
    */
    this.has = function(scope, name) {
      logc("has", name);
      trace(new Effect.Has(origin, name));

      return doHas(scope, name);
    };
    /** target, name -> boolean
    */
    this.hasOwn = function(scope, name) {
      logc("hasOwn", name);
      trace(new Effect.HasOwn(origin, name));

      return doHasOwn(scope, name);
    };
    /** target, name, receiver -> any
    */
    this.get = function(scope, name, receiver) {
      logc("get", name);
      trace(new Effect.Get(origin, name, receiver));

      return doGet(scope, name);
    };
    /** target, name, val, receiver -> boolean
    */
    this.set = function(scope, name, value, receiver) {
      logc("set", name);
      trace(new Effect.Set(origin, name, value, receiver));

      return doSet(scope, name, value);
    };
    /** target -> [String]
    */
    this.enumerate = function(scope) {
      logc("enumerate");
      trace(new Effect.Enumerate(origin));

      // NOTE: Trap is never called
      // return doEnumnerate(scope);
      throw new Error("Unimplemented Trap enumerate.");
    };
    /** target -> iterator
    */
    this.iterate = function(scope) {
      logc("iterate");
      trace(new Effect.Iterate(origin));

      // NOTE: Trap is never called
      // return doIterate(scope);
      throw new Error("Unimplemented Trap iterate.");
    };
    /** target) -> [String]
    */
    this.keys = function(scope) {
      logc("keys");
      trace(new Effect.Keys(origin));

      return doKeys(scope);
    };
    /** target, thisValue, args -> any
    */
    this.apply = function(scope, thisArg, argsArray) {
      logc("apply", scope);
      trace(new Effect.Apply(origin, thisArg, argsArray));

      thisArg = (thisArg!==undefined) ? thisArg : global;
      argsArray = (argsArray!==undefined) ? argsArray : new Array();

      // Note: 
      // The function in scope is already decompiled.
      return scope.apply(wrap(thisArg), wrap(argsArray));
    };
    /** target, args -> object
    */
    this.construct = function(scope, thisArg, argsArray) {
      logc("construct");
      trace(new Effect.Construct(origin, thisArg, argsArray));

      var thisArg = wrap(Object.create(origin.prototype));
      var val = scope.apply(thisArg, wrap(argsArray));
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

  /** decompile
   * Decompiles functions.
   * @param fun JavaScript Function
   * @param env The current Global Object
   * @return JavaScript Function
   */
  function decompile(fun, env) {
    logc("decompile", fun);
    increment("decompile");

    if(!(fun instanceof Function))
      throw new TypeError("fun");
    if(!(env instanceof Object))
      throw new TypeError("env");
    
    // Decompile ?
    if(!(__decompile__))
      return fun;

    // Note: Roman Matthias Keil
    // * use strict mode only
    // var body = "(" + fun.toString() + ")"; 
    // var sbxed = eval("(function() { with(env) { return " + body + " }})();");

    var body = "(function() {'use strict'; return " + ("(" + fun.toString() + ")") + "})();";
    var sbxed = eval("(function() { with(env) { return " + body + " }})();");

    return sbxed;
  }

  /** evaluate
   * Evaluates the given function.
   * @param fun JavaScript Function
   * @param thisArg The current this Object
   * @param argsArray The Function arguments
   * @return Any
   */
  function evaluate(fun, thisArg, argsArray) {
    logc("evaluate", fun);

    if(!(thisArg instanceof Object))
      throw new TypeError("thisArg");
    if(!(argsArray instanceof Array))
      throw new TypeError("argsArray");

    // sandboxed function
    var sbxed = decompile(fun, wrap(global));
    // apply constructor function
    var val = sbxed.apply(wrap(thisArg), wrap(argsArray));
    // return val
    return val;
  }

  /** Construct
   * Evaluates the given constructor.
   * @param fun JavaScript Function
   * @param argsArray The Function arguments
   * @return Object
   */
  function construct(fun, argsArray) {
    logc("construct", fun);

    if(!(argsArray instanceof Array))
      throw new TypeError("argsArray");

    // sandboxed function
    var sbxed = decompile(fun, wrap(global));
    // new this reference
    var thisArg = wrap(Object.create(fun.prototype));
    // apply function
    var val = sbxed.apply(thisArg, wrap(argsArray)); 
    // return thisArg | val
    return (val instanceof Object) ? val : thisArg;
  }

  /** bind
   * Binds the given function in the sandbox.
   * @param fun JavaScript Function
   * @param thisArg The current this Object
   * @param argsArray The Function arguments
   * @return Any
   */
  function bind(fun, thisArg, argsArray) {
    logc("bind", fun);

    if(!(thisArg instanceof Object))
      throw new TypeError("thisArg");
    if(!(argsArray instanceof Array))
      throw new TypeError("argsArray");

    // sandboxed function
    var sbxed = decompile(fun, wrap(global));
    // bind thisArg
    var bound = sbxed.bind(wrap(thisArg));
    // bind arguments
    for(var arg in argsArray) {
      bound = bound.bind(null, wrap(arg));
    }
    // return bound function
    return bound;
  }

  //   _             _      
  //  /_\  _ __ _ __| |_  _ 
  // / _ \| '_ \ '_ \ | || |
  ///_/ \_\ .__/ .__/_|\_, |
  //      |_|  |_|     |__/ 

  __define("apply", function(fun, thisArg, argsArray) {

    if(!(fun instanceof Function))
    throw new TypeError("No function object.");

  thisArg = (thisArg!==undefined) ? thisArg : global;
  argsArray = (argsArray!==undefined) ? argsArray : new Array();

  return evaluate(fun, thisArg, argsArray);
  }, this);

  //  ___      _ _ 
  // / __|__ _| | |
  //| (__/ _` | | |
  // \___\__,_|_|_|

  __define("call", function(fun, thisArg) {

    if(!(fun instanceof Function))
    throw new TypeError("No function object.");

  thisArg = (thisArg!==undefined) ? thisArg : global;

  var argsArray = [];
  for(var i=0; i<arguments.length;i++) argsArray[i]=arguments[i];

  // pop fun
  domain.pop();
  // pop thisArg
  domain.pop();

  return evaluate(fun, thisArg, argsArray);
  }, this);

  // ___ _         _ 
  //| _ |_)_ _  __| |
  //| _ \ | ' \/ _` |
  //|___/_|_||_\__,_|

  __define("bind", function(fun, thisArg, argsArray) {

    if(!(fun instanceof Function))
    throw new TypeError("No function object.");

  thisArg = (thisArg!==undefined) ? thisArg : global;
  argsArray = (argsArray!==undefined) ? argsArray : new Array();

  return bind(fun, thisArg, argsArray);
  }, this);

  // _______                             _   _                 
  //|__   __|                           | | (_)                
  //   | |_ __ __ _ _ __  ___  __ _  ___| |_ _  ___  _ __  ___ 
  //   | | '__/ _` | '_ \/ __|/ _` |/ __| __| |/ _ \| '_ \/ __|
  //   | | | | (_| | | | \__ \ (_| | (__| |_| | (_) | | | \__ \
  //   |_|_|  \__,_|_| |_|___/\__,_|\___|\__|_|\___/|_| |_|___/

  var readset = new WeakMap();
  var writeset = new WeakMap();

  var effectset = new WeakMap();

  /** saves an sandbox effect
   * @param effect Effect
   */
  function trace(effect) {
    logc("trace", effect.toString());

    // Effect Logging ?
    if(!__effect__) return true;

    if(!(effect instanceof Effect.Effect))
      throw new Error("No effect object.");

      if(effect instanceof Effect.Read) {
        update(readset, effect.target, effect);
        update(effectset, effect.target, effect);

      } else if(effect instanceof Effect.Write) {
        update(writeset, effect.target, effect);
        update(effectset, effect.target, effect);
      } 

    function update(set, target, effect) {
      if(!set.has(target))
        set.set(target, []);
      return set.get(target).push(effect);
    }
  }

   /** Get Effects
   * @param target JavaScript Obejct
   * @return JavaScript Array [Effect]
   */
  __define("getReadEffects", function(target) {
    if(readset.has(target)) return readset.get(target);
    else return [];
  }, this);

   /** Get Effects
   * @param target JavaScript Obejct
   * @return JavaScript Array [Effect]
   */
  __define("getWriteEffects", function(target) {
    if(writeset.has(target)) return writeset.get(target);
    else return [];
  }, this);

  /** Get Effects
   * @param target JavaScript Obejct
   * @return JavaScript Array [Effect]
   */
  __define("getEffects", function(target) {  
    if(effectset.has(target)) return effectset.get(target);
    else return [];
  }, this);

  //  _____ _        _   _     _   _      
  // / ____| |      | | (_)   | | (_)     
  //| (___ | |_ __ _| |_ _ ___| |_ _  ___ 
  // \___ \| __/ _` | __| / __| __| |/ __|
  // ____) | || (_| | |_| \__ \ |_| | (__ 
  //|_____/ \__\__,_|\__|_|___/\__|_|\___|

  /** Statistic
  */
  __define("statistic", statistic, this);
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
