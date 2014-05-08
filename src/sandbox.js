



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
    __out(head("[Membrane]") + msg);
    __blank();
  };

  // _                             _   _             
  //| |_ _ _ __ _ _ _  ___ __ _ __| |_(_)___ _ _  ___
  //|  _| '_/ _` | ' \(_-</ _` / _|  _| / _ \ ' \(_-<
  // \__|_| \__,_|_||_/__/\__,_\__|\__|_\___/_||_/__/

  this.transactions = function(msg) {
    __out(head("[Transaction]") + msg);
    __blank();
  };
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


function Sandbox(params) {
  if(!(this instanceof Sandbox)) return new Sandbox(params);

  /** 
   * Verbose Mode
   * (default: false)
   */
  var verbose = configure("verbose", false);

  /*
   * Decompile
   * (default: true)
   */
  var decompile = configure("decompile", true);

  /*
   * Membrane
   * (default: true)
   */
  var membrane = configure("membrane", true);

  /*
   * Output
   * (default:null);
   */
  var out = configure("out", new Out());

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
    if(verbose) {
      out.membrane(msg);
    }
  }

  /** logc(msg)
   * @param msg String message
   */ 
  function logc(command) {
    if(verbose) {
      out.membrane("$."+command+" (@"+this.id+")");
    }
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
    logc("wrap");

    // If target is a primitive value, then return target
    if (target !== Object(target)) {
      return target;
    }

    // if target is already wrapped, return cached proxy
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

  //  function()


    this.getOwnPropertyDescriptor = function(target, name) {
      logc("getOwnPropertyDescriptor(" + name + ")");

      // TODO switch target
      var desc = Object.getOwnPropertyDescriptor(target, name);
      if (desc !== undefined) desc.value = wrap(desc, global);
      return desc;
    };
    this.getOwnPropertyNames = function(target) {
      logc("getOwnPropertyNames(" + name + ")");

      // TODO merge property names
      return Object.getOwnPropertyNames(target);
    };
    this.getPrototypeOf = function(target) {
      logc("getPrototypeOf()");

      return Object.getPrototypeOf(target)
    };
    this.defineProperty = function(target, name, desc) {
      logc("defineProperty(" + name + ")");

      return Object.defineProperty(scope, name, desc);
    };
    this.deleteProperty = function(target, name) {
      logc("deleteProperty(" + name + ")");

      // TODO, implement delete
      return delete target[name];
    };
    this.freeze = function(target) {
      logc("freeze()");

      return Object.freeze(target);
    };
    this.seal = function(target) {
      logc("seal()");

      return Object.seal(target);
    };
    this.preventExtensions = function(target) {
      logc("preventExtensions()");

      return Object.preventExtensions(target);
    };
    this.isFrozen = function(target) {
      logc("isFrozen()");

      return Object.isFrozen(target);
    };
    this.isSealed = function(target) {
      logc("isSealed()");

      return Object.isSealed(target);
    };
    this.isExtensible = function(target) {
      logc("isExtensible()");

      return Object.isExtensible(target);
    };
    this.has = function(target, name) {
      logc("has(" + name + ")");

      // TODO switch target
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return (name in target);
    };
    this.hasOwn = function(target, name) {
      logc("hasOwn(" + name + ")");

      // TODO switch target
      if(!(name in target)) violation("Unauthorized Access " + name, (new Error()).fileName, (new Error()).lineNumber);
      else return ({}).hasOwnProperty.call(target, name); 
    };
    this.get = function(target, name, receiver) {
      logc("get(" + name + ")");

      // TODO, switch target
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
      logc("set(" + name + ")");
      
      // TODO, test if property is writable
      return (scope[name]=value);
    };
    this.enumerate = function(target) {
      logc("enumerate()");

      // TODO merge property names
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };
    this.iterate = function(target) {
      logc("iterate()");

      // TODO merge property names
      var result = [];
      for (var name in target) {
        result.push(name);
      };
      return result;
    };

    this.keys = function(target) {
      logc("keys()");

      // TODO merge property names
      return Object.keys(target);
    };
    this.apply = function(target, thisArg, argsArray) {
      logc("apply()");

      // TODO implement apply
      return evalFunction(target, global, thisArg, argsArray);
    };
    this.construct = function(target, argsArray) {
      logc("construct()");

      // TODO implement construct
      return evalNew(target, global, this, argsArray);
    };
  };








  this.bind = function() {};
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




//(new Out()).id;

var sbx = new Sandbox();
sbx.bind();
sbx.bind();
print("###1" + sbx.id);
print(sbx);

var sbx2 = new Sandbox({});
sbx2.bind();
sbx2.bind();
print("###2" + sbx2.id);
print(sbx2);


