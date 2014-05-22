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

var Effect = (function() {

  // ___  __  __        _   
  //| __|/ _|/ _|___ __| |_ 
  //| _||  _|  _/ -_) _|  _|
  //|___|_| |_| \___\__|\__|  

  function Effect(cmd, target) {
    if(!(this instanceof Effect)) return new Get(cmd, target);

    if(!(target instanceof Object))
      throw new TypeError("No traget object.");

    // define timestamp
    __define("date", new Date(), this);
    // define command
    __define("cmd", cmd, this);
    // define target    
    __define("target", target, this);
  };
  Effect.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+this.cmd;
  }

  // ___             _   ___  __  __        _   
  //| _ \___ __ _ __| | | __|/ _|/ _|___ __| |_ 
  //|   / -_) _` / _` | | _||  _|  _/ -_) _|  _|
  //|_|_\___\__,_\__,_| |___|_| |_| \___\__|\__|

  function Read(cmd, target) {
    if(!(this instanceof Read)) return new Read(cmd, target);
    else Effect.call(this, cmd, target);
  }
  Read.prototype = new Effect("", {});

  //__      __   _ _         ___  __  __        _   
  //\ \    / / _(_) |_ ___  | __|/ _|/ _|___ __| |_ 
  // \ \/\/ / '_| |  _/ -_) | _||  _|  _/ -_) _|  _|
  //  \_/\_/|_| |_|\__\___| |___|_| |_| \___\__|\__|

  function Write(cmd, target, name) {
    if(!(this instanceof Write)) return new Write(cmd, target);
    else Effect.call(this, cmd, target);
  }
  Write.prototype = new Effect("", {});

  // TODO
  // * conflict?
  // ** compare with a set of transactions?
  // ** compare with origin

  // ___             _   ___  __  __        _      
  //| _ \___ __ _ __| | | __|/ _|/ _|___ __| |_ ___
  //|   / -_) _` / _` | | _||  _|  _/ -_) _|  _(_-<
  //|_|_\___\__,_\__,_| |___|_| |_| \___\__|\__/__/

  /** target, name, receiver -> any
  */
  function Get(target, name, receiver) {
    if(!(this instanceof Get)) return new Get(target, name, receiver);
    else Read.call(this, "get [name="+name+"]", target);

    // define name
    __define("name", name, this);
    // define receiver    
    __define("receiver", receiver, this);
  }
  Get.prototype = new Read("", {});

  /** target, name -> PropertyDescriptor | undefined
  */
  function GetOwnPropertyDescriptor(target, name) {
    if(!(this instanceof GetOwnPropertyDescriptor)) return new GetOwnPropertyDescriptor(target, name);
    else Read.call(this, "getOwnPropertyDescriptor [name="+name+"]", target);

    // define name
    __define("name", name, this);
  }
  GetOwnPropertyDescriptor.prototype = new Read("", {});

  /** target -> [String]
  */
  function GetOwnPropertyNames(target) {
    if(!(this instanceof GetOwnPropertyNames)) return new GetOwnPropertyNames(target);
    else Read.call(this, "getOwnPropertyNames", target);
  }
  GetOwnPropertyNames.prototype = new Read("", {});

  /** target, name -> boolean
  */
  function Has(target) {
    if(!(this instanceof Has)) return new Has(target);
    else Read.call(this, "has [name="+name+"]", target);

    // define name
    __define("name", name, this);
  }
  Has.prototype = new Read("", {});

  /** target, name -> boolean
  */
  function HasOwn(target, name) {
    if(!(this instanceof HasOwn)) return new HasOwn(target, name);
    else Read.call(this, "hasOwn [name="+name+"]", target);

    // define name
    __define("name", name, this);
  }
  HasOwn.prototype = new Read("", {});

  /** target -> [String]
  */
  function Enumerate(target) {
    if(!(this instanceof Enumerate)) return new Enumerate(target);
    else Read.call(this, "enumerate", target);
  }
  Enumerate.prototype = new Read("", {});

  /** target -> iterator
  */
  function Iterate(target) {
    if(!(this instanceof Iterate)) return new Iterate(target);
    else Read.call(this, "iterate", target);
  }
  Iterate.prototype = new Read("", {});

  /** target -> [String]
  */
  function Keys(target) {
    if(!(this instanceof Keys)) return new Keys(target);
    else Read.call(this, "keys", target);
  }
  Keys.prototype = new Read("", {});

  /** target, thisArg, argsArray -> any
  */
  function Apply(target, thisArg, argsArray) {
    if(!(this instanceof Apply)) return new Apply(target, thisArg, argsArray);
    else Read.call(this, "apply", target);

    // define name
    __define("thisArg", thisArg, this);
    // define name
    __define("argsArray", argsArray, this);
  }
  Apply.prototype = new Read("", {});

  /** target, thisArg, argsArray -> obejct
  */
  function Construct(target, thisArg, argsArray) {
    if(!(this instanceof Construct)) return new Construct(target, thisArg, argsArray);
    else Read.call(this, "construct", target);

    // define name
    __define("thisArg", thisArg, this);
    // define name
    __define("argsArray", argsArray, this);
  }
  Construct.prototype = new Read("", {});

  /** target -> boolean
   * (not documented)
   */
  function IsExtensible(target) {
    if(!(this instanceof IsExtensible)) return new IsExtensible(target);
    else Read.call(this, "isExtensible", target);
  }
  IsExtensible.prototype = new Read("", {});

  //__      __   _ _         ___  __  __        _      
  //\ \    / / _(_) |_ ___  | __|/ _|/ _|___ __| |_ ___
  // \ \/\/ / '_| |  _/ -_) | _||  _|  _/ -_) _|  _(_-<
  //  \_/\_/|_| |_|\__\___| |___|_| |_| \___\__|\__/__/


  function Set(target, name, value, receiver) {
    if(!(this instanceof Set)) return new Set(target, name, value, receiver);
    else Write.call(this, "set [name="+name+"]", target, name, value, receiver);

    function commit() {
      return target[name]=value;
    }
    // define name
    __define("name", name, this);
    // define value
    __define("value", value, this);
    // define receiver
    __define("receiver", receiver, this);
    // define commit
    __define("commit", commit, this);
  }
  Set.prototype = new Write("", {});

  /** target, name, propertyDescriptor -> any
  */
  function DefineProperty(target, name, desc) {
    if(!(this instanceof DefineProperty)) return new DefineProperty(target, name, desc);
    else Write.call(this, "defineProperty [name="+name+"]", target, name);

    /** commit
    */
    function commit() {
      return Object.defineProperty(target, name, desc);
    }

    // define name
    __define("name", name, this);
    // define desc
    __define("desc", desc, this);
    // define commit
    __define("commit", commit, this);
  }
  DefineProperty.prototype = new Write("", {});


  /** target, name -> boolean
  */
  function DeleteProperty(target, name) {
    if(!(this instanceof DeleteProperty)) return new DeleteProperty(target, name);
    else Write.call(this, "deleteProperty [name="+name+"]", target, name);

    /** commit
    */
    function commit() {
      return (delete target[name]);
    }

    // define name
    __define("name", name, this);
    // define commit
    __define("commit", commit, this);
  }
  DeleteProperty.prototype = new Write("", {});

  /** target -> boolean
  */
  function Freeze(target) {
    if(!(this instanceof Freeze)) return new Freeze(target);
    else Write.call(this, "freeze", target);

    /** commit
    */
    function commit() {
      return Object.freeze(target);
    }

    // define commit
    __define("commit", commit, this);
  }
  Freeze.prototype = new Write("", {});

  /** target -> boolean
  */
  function Seal(target) {
    if(!(this instanceof Seal)) return new Seal(target);
    else Write.call(this, "seal", target);

    /** commit
    */
    function commit() {
      return Object.seal(target);
    }

    // define commit
    __define("commit", commit, this);
  }
  Seal.prototype = new Write("", {});

  /** target -> boolean
  */
  function PreventExtensions(target) {
    if(!(this instanceof PreventExtensions)) return new PreventExtensions(target);
    else Write.call(this, "preventExtensions", target);

    /** commit
    */
    function commit() {
      return Object.preventExtensions(target);
    }

    // define commit
    __define("commit", commit, this);
  }
  PreventExtensions.prototype = new Write("", {});

  // ___  __  __        _      
  //| __|/ _|/ _|___ __| |_ ___
  //| _||  _|  _/ -_) _|  _(_-<
  //|___|_| |_| \___\__|\__/__/

  var Effects = {};

  // Core Prototype
  __define("Effect", Effect, Effects);

  // Core Effects
  __define("Read", Read, Effects);
  __define("Write", Write, Effects);

  // Read Effects
  __define("Get", Get, Effects);
  __define("GetOwnPropertyDescriptor", GetOwnPropertyDescriptor, Effects);
  __define("GetOwnPropertyNames", GetOwnPropertyNames, Effects);
  __define("Has", Has, Effects);
  __define("HasOwn", HasOwn, Effects);
  __define("Enumerate", Enumerate, Effects);
  __define("Iterate", Iterate, Effects);
  __define("Keys", Keys, Effects);
  __define("Apply", Apply, Effects);
  __define("Construct", Construct, Effects);
  __define("IsExtensible", IsExtensible, Effects);

  // Write Effects
  __define("Set", Set, Effects);
  __define("DefineProperty", DefineProperty, Effects);
  __define("DeleteProperty", DeleteProperty, Effects);
  __define("Freeze", Freeze, Effects);
  __define("Seal", Seal, Effects);
  __define("PreventExtensions", PreventExtensions, Effects);

  return Effects;

})();
