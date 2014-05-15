



function Out() {
  this.membrane = function(msg) {};
  this.transactions = function(msg) {};
}


function ShellOut() {
  if(!(this instanceof ShellOut)) return new ShellOut();
  else Out.call(this);

  /** Padding Information
  */
  var idWidth = 30;
  var fstWidth = 100;
  var sndWidth = 20;
  var seperator = ".";

  /** Standard Output (Head + Message)
  */
  function out(string) {
    putstr(padding_right(string + " ", seperator, fstWidth));
  }

  /** Sub-Standard Output (Message)
  */
  function subout(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth));
  }

  /** Blank Output (End Of Line)
  */
  function blank() {
    putstr(padding_left(seperator, seperator, sndWidth));
    putstr("\n");
  }

  /** Notice Output (Sub-Output including Blank)
  */
  function notice(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth+sndWidth));
    putstr("\n");
  }

  /** Head Output
  */
  function head(id) {
    return padding_right(id + " ", ".", idWidth);
  }
  //                 _                      
  // _ __  ___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| '  \/ -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|_|_\___|_|_|_|_.__/_| \__,_|_||_\___|

  this.membrane = function(msg) {
    out(head("[Membrane]") + msg);
    blank();
  };

  // _                             _   _             
  //| |_ _ _ __ _ _ _  ___ __ _ __| |_(_)___ _ _  ___
  //|  _| '_/ _` | ' \(_-</ _` / _|  _| / _ \ ' \(_-<
  // \__|_| \__,_|_||_/__/\__,_\__|\__|_\___/_||_/__/

  this.transactions = function(msg) {
    out(head("[Transaction]") + msg);
    blank();
  };


  // TODO

  this.error = function(msg) {
    subout("Error");
    blank();
    notice(msg);
  }



}
ShellOut.prototype = new Out();


/*
 * out
 *
 * verbose
 * - membrane
 * - transactions
 *
 * configuration
 * - nativepassthrough
 *
 * evaluation
 * - decompile
 * - membrane
 *
 *
 *
 *
 */

/*
   var sbx = new Sandbox({
   verbose={
   membrabe:true
   },
   decompile=true
   });
   */
// TODO: to stricng function

// return type errores iontead of ...

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

  /** log(msg)
   * @param msg String message
   */ 
  function log(msg) {
    if(__verbose__) {
      __out__.membrane(msg);
    }
  }

  /** logc(msg)
   * @param msg String message
   */ 
  function logc(cmd, arg) {
    if(__verbose__) {
      __out__.membrane("$."+cmd+"("+((arg!==undefined) ? arg : "")+")"+" @"+this.id+"");
    }
  }

  // TODO
  function error(cmd, msg) {
    __out__.error("$."+cmd+"("+((arg!==undefined) ? arg : "")+")"+" @"+this.id+"");
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

    // If target is a primitive value, then return target
    if (target !== Object(target)) {
      return target;
    }

    // TODO
    if(!(__membrane__))
      return target;

    // Native Function pass-through
    if((target  instanceof Function) && __nativepassthrough__) {
      if(isNative(target)) {
        return target;
      }
    }

    // If target is already wrapped, return cached proxy
    if(cache.has(target)) {
      return cache.get(target);
    } else {
      var proxy = new Proxy(target, new Membrane());
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
  function Membrabe(global) {
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



    // Handler Traps

    //  function()

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

      // TODOX, implement delete
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

      // XTODO switch target
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

      return wrap(doGet(target, name));
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
      return evalFunction(target, global, thisArg, argsArray);
    };
    this.construct = function(target, argsArray) {
      logc("construct");

      // TODO implement construct
      return evalNew(target, global, this, argsArray);
    };
  };

  //    _                       _ _     
  // __| |___ __ ___ _ __  _ __(_) |___ 
  /// _` / -_) _/ _ \ '  \| '_ \ | / -_)
  //\__,_\___\__\___/_|_|_| .__/_|_\___|
  //                      |_|           


  // TODO, decompile cache ?

  function decompile(fun, env) {
    logc("decompile");

    if(!(fun instanceof Function))
      error("decompile", "No Function Object");

    // TODO
    if(!(__decompile__))
      return fun;

    var body = "(" + fun.toString() + ")"; 
    var sbxed = eval("(function() { with(env) { return " + body + " }})();");

    return sbxed;
  }


  function evaluate(fun, globalArg, thisArg, argsArray) {
    logc("evaluate");

    if(!(globalArg instanceof Object))
      error("evaluate", "No Global Object");
    if(!(thisArg instanceof Object))
      error("evaluate", "No This Object");
    if(!(argsArray instanceof Array))
      error("evaluate", "Not Arguments Array");

    // sandboxed function
    var sbxed = decompile(fun, wrap(globalArg));
    // apply constructor function
    var val = sbxed.apply(wrap(thisArgs), wrap(argsArray));
    // return val
    return val;
  }

  function construct(fun, globalArg, argsArray) {
    logc("construct");

    if(!(globalArg instanceof Object))
      error("evaluate", "No Global Object");
    if(!(argsArray instanceof Array))
      error("evaluate", "Not Arguments Array");

    // sandboxed function
    var sbxed = decompile(fun, wrap(globalArg));
    // new this reference
    var thisArg = Object.create(secureFun.prototype);
    // apply function
    var val = sbxed.apply(wrap(thisArgs), wrap(argsArray));
    // return thisArg | val
    return (val instanceof Object) ? val : thisArg;
  }

  // TODO, wrao requires the glibal arg

  // todo
  //__membrane in wrap
  //__decompile in ceocmpile

  function bind(fun, globalArg, thisArg, argsArray) {
    logc("bind");

    if(!(globalArg instanceof Object))
      error("evaluate", "No Global Object");
    if(!(thisArg instanceof Object))
      error("evaluate", "No This Object");
    if(!(argsArray instanceof Array))
      error("evaluate", "Not Arguments Array");

    // sandboxed function
    var sbxed = decompile(fun, wrap(globalArg));
    // bind thisArg
    var bound = sbxed.bind(wrap(thisArgs));
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
    return function() {
      i = i+1;
      return (str+(padding_left(String(i), "0", 3)));
    }
  })(),
  enumerable: false
});

// _       ___ _       _           
//| |_ ___/ __| |_ _ _(_)_ _  __ _ 
//|  _/ _ \__ \  _| '_| | ' \/ _` |
// \__\___/___/\__|_| |_|_||_\__, |
//                           |___/ 

Sandbox.prototype.toString = function() {
  return "[[Sandbox#" + this.id + "]]";
}
