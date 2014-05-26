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

  //     _     _      _   _          
  //__ _(_)___| |__ _| |_(_)___ _ _  
  //\ V / / _ \ / _` |  _| / _ \ ' \ 
  // \_/|_\___/_\__,_|\__|_\___/_||_|

  function violation(msg) {
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
    print(fun);
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
    logc("wrap", (typeof target) + "=" + target);

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
      return cache.get(target);
    } else {
      log("Cache miss.");

      // decompiles function or clones object
      // to preserve typeof/ instanceof
      // and to make an iterable image for loops
      if(target instanceof Function) {
        log("target instanceOf Function");
        var scope = cloneFunction(target, global)
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

      var handler = make(new Membrane(global, target, scope))
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
    // ** object[property] = wrap(target[property], global);

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
  function cloneFunction(target, global) {
    log("Clone Function.");

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
      var has = (affected(name)) ? (name in scope) : (name in target);

      // TODO
      // is violation the right way
      // otherwise return true and say get to return undefined
      if(has===false) violation(name);

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

      print("# NAME: " + name);
      print("# DESC: " + Xdump(desc));
      print("# CURR: " + Xdump(Object.getOwnPropertyDescriptor(scope, name)));
      Object.defineProperty(scope, name, desc);
     print("# CURR: " + Xdump(Object.getOwnPropertyDescriptor(scope, name)));



      quit();


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


      //  if (desc !== undefined) desc.value = wrap(desc.value, global);
        // TODO, required to wrap desc, is a line of traget?
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
      trace(new Effect.GetOwnPropertyDescriptor(target, name));

      return doGetOwnPropertyDescriptor(scope, name);
    };
    /** target -> [String]
    */
    this.getOwnPropertyNames = function(scope) {
      logc("getOwnPropertyNames");
      trace(new Effect.GetOwnPropertyNames(target));

      return doGetOwnPropertyNames(scope);
    };
    /** target, name, propertyDescriptor -> any
    */
    this.defineProperty = function(scope, name, desc) {
      logc("defineProperty", name);
      trace(new Effect.DefineProperty(target, name, desc));

      return doDefineProperty(scope, name, desc);
    };
    /** target, name -> boolean
    */
    this.deleteProperty = function(scope, name) {
      logc("deleteProperty", name);
      trace(new Effect.DeleteProperty(target, name));

      return doDelete(scope, name);
    };
    /** target -> boolean
    */
    this.freeze = function(scope) {
      logc("freeze");
      trace(new Effect.Freeze(target));

      return Object.freeze(scope);
    };
    /** target -> boolean
    */
    this.seal = function(scope) {
      logc("seal");
      trace(new Effect.Seal(target));

      return Object.seal(scope);
    };
    /** target -> boolean
    */
    this.preventExtensions = function(scope) {
      logc("preventExtensions");
      trace(new Effect.PreventExtensions(target));

      return Object.preventExtensions(scope);
    };
    /** target -> boolean
    */
    this.isExtensible = function(scope) {
      logc("isExtensible");
      trace(new Effect.IsExtensible(target));

      return Object.isExtensible(scope);
    };
    /** target, name -> boolean
    */
    this.has = function(scope, name) {
      logc("has", name);
      trace(new Effect.Has(target, name));

      return doHas(scope, name);
    };
    /** target, name -> boolean
    */
    this.hasOwn = function(scope, name) {
      logc("hasOwn", name);
      trace(new Effect.HasOwn(target, name));

      return doHasOwn(scope, name);
    };
    /** target, name, receiver -> any
    */
    this.get = function(scope, name, receiver) {
      logc("get", name);
      trace(new Effect.Get(target, name, receiver));

      return doGet(scope, name);
    };
    /** target, name, val, receiver -> boolean
    */
    this.set = function(scope, name, value, receiver) {
      logc("set", name);
      trace(new Effect.Set(target, name, value, receiver));

      return doSet(scope, name, value);
    };
    /** target -> [String]
    */
    this.enumerate = function(scope) {
      logc("enumerate");
      trace(new Effect.Enumerate(target));

      // NOTE: Trap is never called
      // return doEnumnerate(scope);
      throw new Error("Unimplemented Trap enumerate.");
    };
    /** target -> iterator
    */
    this.iterate = function(scope) {
      logc("iterate");
      trace(new Effect.Iterate(target));

      // NOTE: Trap is never called
      // return doIterate(scope);
      throw new Error("Unimplemented Trap iterate.");
    };
    /** target) -> [String]
    */
    this.keys = function(scope) {
      logc("keys");
      trace(new Effect.Keys(target));

      return doKeys(scope);
    };
    /** target, thisValue, args -> any
    */
    this.apply = function(scope, thisArg, argsArray) {
      logc("apply", scope);
      trace(new Effect.Apply(target, thisArg, argsArray));

      thisArg = (thisArg!==undefined) ? thisArg : global;
      argsArray = (argsArray!==undefined) ? argsArray : new Array();

      print("@@@@@@@@@@@@ "+thisArg.uuid);
      
      // Note: 
      // The function in scope is already decompiled.
      return scope.apply(wrap(thisArg, global), wrap(argsArray, global));
     //
     // var ren = scope.apply(wrap(thisArg, global), wrap(argsArray, global));
     // return wrapper.wrapThis(ren, global);


//      return evaluate(scope, global, thisArg, argsArray);
    };
    /** target, args -> object
    */
    this.construct = function(scope, thisArg, argsArray) {
      logc("construct");
      trace(new Effect.Construct(target, thisArg, argsArray));

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
      return (val instanceof Object) ? wrap(val, global) : thisArg;
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

    if(!(fun instanceof Function))
      throw new TypeError("fun");
    if(!(env instanceof Object))
      throw new TypeError("env");
    
    // Decompile ?
    if(!(__decompile__))
      return fun;

//    var body = "(" + fun.toString() + ")"; 
//    var sbxed = eval("(function() { with(env) { return " + body + " }})();");

    //env["__sbx__"]=env;
    //var body = ("(" + fun.toString() + ")").replace(/this/g, "that"); 
    var body = "(function() {'use strict'; return " + ("(" + fun.toString() + ")") + "})();"
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
    logc("evaluate", fun);

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
    logc("construct", fun);

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
    logc("bind", fun);

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
      bound = bound.bind(null, wrap(arg, globalArg));
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

  var argsArray = [];
  for(var i=0; i<arguments.length;i++) argsArray[i]=arguments[i];

  // pop fun
  domain.pop();
  // pop globalArg
  domain.pop();
  // pop thisArg
  domain.pop();

  return evaluate(fun, globalArg, thisArg, argsArray);
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
