var wrapper = (function() {
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
  function wrapFunction(target, global) { 
    // logc("wrap", (typeof target) + "=" + target);

    // TODO
    // test if target is a function
    //
    if(target===undefined)
      throw new ReferenceError("Target is undefined.");
    if(global===undefined)
      throw new ReferenceError("Global is undefined."); 

    print("################### " + target);

    // If target is a primitive value, then return target
    if (!(target instanceof Function)) {
      return target;
    }



    // Membrane ? 
    //    if(!(__membrane__))
    //      return target;

    // TODO
    // * wrap eval to support it
    // * test the support of eval when behaviot/eval succeeds
    // ** Access to Math.abd
    // ** ...
    //    if(isEval(target)) {
    //      throw new Error("eval not supported");
    //   }

    // Native Function pass-through
    //   if((target instanceof Function) && __nativepassthrough__) {
    //     if(isNative(target)) {
    //       return target;
    //     }
    //   }

    // If target already wrapped, return cached proxy
    if(cache.has(target)) {
//      log("Cache hit.");
      return cache.get(target);
    } else {
//      log("Cache miss.");

      var handler = new ThisMembrane(global);
      var proxy = new Proxy(target, handler);
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
  function ThisMembrane(global, target) {
    if(!(global instanceof Object))
      throw new TypeError("global");

    // _____                 
    //|_   _| _ __ _ _ __ ___
    //  | || '_/ _` | '_ (_-<
    //  |_||_| \__,_| .__/__/
    //              |_|      

    /** target, thisValue, args -> any
    */
    this.apply = function(target, thisArg, argsArray) {
      //      logc("apply", scope);
      //      trace(new Effect.Apply(target, thisArg, argsArray));

      thisArg = (thisArg!==undefined) ? thisArg : global;
      argsArray = (argsArray!==undefined) ? argsArray : new Array();

      return target.apply(thisArg, argsArray);

      //      return evaluate(scope, global, thisArg, argsArray);
    };
    /** target, args -> object
    */
    this.construct = function(target, thisArg, argsArray) {
      //      logc("construct");
      //      trace(new Effect.Construct(target, thisArg, argsArray));

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


  // ___ _         _ 
  //| _ |_)_ _  __| |
  //| _ \ | ' \/ _` |
  //|___/_|_||_\__,_|

  var tmp = {};
  __define("wrapThis", wrapFunction, tmp);
  return tmp;

})();
