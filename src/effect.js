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

  function Effect(target) {
    if(!(this instanceof Effect)) return new Effect(target);

    if(!(target instanceof Object))
      throw new TypeError("No traget object.");

    Object.defineProperties(this, {
      "date": {
        value: new Date();
      },
      "target": {
        value: target
      }
    });
  }
  Effect.prototype = {};
  Effect.prototype.toString = function() {
    return "[[Effect]]";
  }

  // ___             _   ___  __  __        _   
  //| _ \___ __ _ __| | | __|/ _|/ _|___ __| |_ 
  //|   / -_) _` / _` | | _||  _|  _/ -_) _|  _|
  //|_|_\___\__,_\__,_| |___|_| |_| \___\__|\__|

  function Read(target) {
    if(!(this instanceof Read)) return new Read(target);
    else Effect.call(this, target);
  }
  Read.prototype = Object.create(Effect.prototype);
  Read.prototype.toString = function() {
    return "[[ReadEffect]]";
  }

  //__      __   _ _         ___  __  __        _   
  //\ \    / / _(_) |_ ___  | __|/ _|/ _|___ __| |_ 
  // \ \/\/ / '_| |  _/ -_) | _||  _|  _/ -_) _|  _|
  //  \_/\_/|_| |_|\__\___| |___|_| |_| \___\__|\__|

  function Write(target, scope) {
    if(!(this instanceof Write)) return new Write(target, scope);
    else Effect.call(this, target);

    if(!(scope instanceof Object))
      throw new TypeError("No scope object.");

    Object.defineProperties(this, {
      "scope": {
        value: scope
      }
    });
  }
  Write.prototype = Object.create(Effect.prototype);
  Write.prototype.toString = function() {
    return "[[WriteEffect]]";
  }
  Write.prototype.commit = function() {
    throw new ReferenceError("Commit not implemented");
  }
  Write.prototype.rollback = function() {
    throw new ReferenceError("Rollback not implemented");
  }
  Write.prototype.diff = function() {
    throw new ReferenceError("Diff not implemented");
  }

  //   _             _        ___  __  __        _   
  //  /_\  _ __ _ __| |_  _  | __|/ _|/ _|___ __| |_ 
  // / _ \| '_ \ '_ \ | || | | _||  _|  _/ -_) _|  _|
  ///_/ \_\ .__/ .__/_|\_, | |___|_| |_| \___\__|\__|
  //      |_|  |_|     |__/                          

  function Apply(target) {
    if(!(this instanceof Apply)) return new Apply(target);
    else Effect.call(this, target);
  }
  Apply.prototype = Object.create(Effect.prototype);
  Apply.prototype.toString = function() {
    return "[[ApplyEffect]]";
  }

  // ___             _   ___  __  __        _      
  //| _ \___ __ _ __| | | __|/ _|/ _|___ __| |_ ___
  //|   / -_) _` / _` | | _||  _|  _/ -_) _|  _(_-<
  //|_|_\___\__,_\__,_| |___|_| |_| \___\__|\__/__/

  /** target, name, receiver -> any
  */
  function Get(target, name) {
    if(!(this instanceof Get)) return new Get(target, name);
    else Read.call(this, target);

    Object.defineProperties(this, {
      "name": {
        value: name
      }
    });
  }
  Get.prototype = Object.create(Read.prototype);
  Get.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"get [name="+this.name+"]"; 
  }

  /** target, name -> PropertyDescriptor | undefined
  */
  function GetOwnPropertyDescriptor(target, name) {
    if(!(this instanceof GetOwnPropertyDescriptor)) return new GetOwnPropertyDescriptor(target, name);
    else Read.call(this, target);

    Object.defineProperties(this, {
      "name": {
        value: name
      }
    });
  }
  GetOwnPropertyDescriptor.prototype = Object.create(Read.prototype);
  GetOwnPropertyDescriptor.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"getOwnPropertyDescriptor [name="+this.name+"]"; 
  }

  /** target -> [String]
  */
  function GetOwnPropertyNames(target) {
    if(!(this instanceof GetOwnPropertyNames)) return new GetOwnPropertyNames(target);
    else Read.call(this, target);
  }
  GetOwnPropertyNames.prototype = Object.create(Read.prototype);
  GetOwnPropertyNames.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"getOwnPropertyNames"; 
  }

  /** target, name -> boolean
  */
  function Has(target, name) {
    if(!(this instanceof Has)) return new Has(target, name);
    else Read.call(this, target);

    Object.defineProperties(this, {
      "name": {
        value: name
      }
    });
  }
  Has.prototype = Object.create(Read.prototype);
  Has.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"has [name="+this.name+"]"; 
  }

  /** target, name -> boolean
  */
  function HasOwn(target, name) {
    if(!(this instanceof HasOwn)) return new HasOwn(target, name);
    else Read.call(this, target);

    Object.defineProperties(this, {
      "name": {
        value: name
      }
    });
  }
  HasOwn.prototype = Object.create(Read.prototype);
  HasOwn.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"hasOwn [name="+this.name+"]"; 
  }

  /** target -> [String]
  */
  function Enumerate(target) {
    if(!(this instanceof Enumerate)) return new Enumerate(target);
    else Read.call(this, target);
  }
  Enumerate.prototype = Object.create(Read.prototype);
  Enumerate.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"enumerate"; 
  }

  /** target -> iterator
  */
  function Iterate(target) {
    if(!(this instanceof Iterate)) return new Iterate(target);
    else Read.call(this, target);
  }
  Iterate.prototype = Object.create(Read.prototype);
  Iterate.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"iterate"; 
  }

  /** target -> [String]
  */
  function Keys(target) {
    if(!(this instanceof Keys)) return new Keys(target);
    else Read.call(this, target);
  }
  Keys.prototype = Object.create(Read.prototype);
  Keys.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"keys"; 
  }

  /** target -> boolean
   * (not documented)
   */
  function IsExtensible(target) {
    if(!(this instanceof IsExtensible)) return new IsExtensible(target);
    else Read.call(this, target);
  }
  IsExtensible.prototype = Object.create(Read.prototype);
  IsExtensible.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"isExtensible";
  }

  //   _             _        ___  __  __        _      
  //  /_\  _ __ _ __| |_  _  | __|/ _|/ _|___ __| |_ ___
  // / _ \| '_ \ '_ \ | || | | _||  _|  _/ -_) _|  _(_-<
  ///_/ \_\ .__/ .__/_|\_, | |___|_| |_| \___\__|\__/__/
  //      |_|  |_|     |__/                             

  /** target, thisArg, argsArray -> any
  */
  function Apply(target, thisArg, argsArray) {
    if(!(this instanceof Apply)) return new Apply(target, thisArg, argsArray);
    else Apply.call(this, target);

    Object.defineProperties(this, {
      "thisArg": {
        value: thisArg
      },
      "argsArray": {
        value: argsArray
      }
    });
  }
  Apply.prototype = Object.create(Apply.prototype);
  Apply.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"apply"; 
  }

  /** target, thisArg, argsArray -> obejct
  */
  function Construct(target, thisArg, argsArray) {
    if(!(this instanceof Construct)) return new Construct(target, thisArg, argsArray);
    else Apply.call(this, target);

    Object.defineProperties(this, {
      "thisArg": {
        value: thisArg
      },
      "argsArray": {
        value: argsArray
      }
    });
  }
  Construct.prototype = Object.create(Apply.prototype);
  Construct.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"construct"; 
  }

  //__      __   _ _         ___  __  __        _      
  //\ \    / / _(_) |_ ___  | __|/ _|/ _|___ __| |_ ___
  // \ \/\/ / '_| |  _/ -_) | _||  _|  _/ -_) _|  _(_-<
  //  \_/\_/|_| |_|\__\___| |___|_| |_| \___\__|\__/__/

  function Set(target, scope, name, value) {
    if(!(this instanceof Set)) return new Set(target, scope, name, value);
    else Write.call(this, target, scope);

    Object.defineProperties(this, {
      "name": {
        value: name
      },
      "value": {
        value: value
      },
      "origin": {
        value: target[name]
      },
      "snapshot": {
        value: scope[name]
      }  
    });

    // define commit
    __define("commit", function() {
      return target[name]=value;
    }, this);

    __define("rollback", function() {
      return scope[name]=this.snapshot;
    }, this);

    // define diff
    __getter("diff", function() {
      return (target[name]===this.origin);
    }, this);
  }
  Set.prototype = Object.create(Write.prototype);
  Set.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+"set [name="+this.name+"]";
  }

  /** target, name, propertyDescriptor -> any
  */
  function DefineProperty(target, scope, name, desc) {
    if(!(this instanceof DefineProperty)) return new DefineProperty(target, scope, name, desc);
    else Write.call(this, "defineProperty [name="+name+"]", target, scope);

    Object.defineProperties(this, {
      "name": {
        value: name
      },
      "desc": {
        value: desc
      },
      "origin": {
        value: Object.getOwnPropertyDescriptor(target, name)
      },
      "snapshot": {
        value: Object.getOwnPropertyDescriptor(scope, name)
      }  
    });


    // define name
    //__define("name", name, this);
    // define desc
    __define("desc", desc, this);

    // define origin
    //__define("origin", Object.getOwnPropertyDescriptor(target, name), this);
    // define commit
    __define("commit", function() {
      return Object.defineProperty(target, name, desc);
    }, this);

    // define snapshot
    // __define("snapshot", Object.getOwnPropertyDescriptor(scope, name), this);
    // define rollback
    __define("rollback", function() {
      return Object.defineProperty(target, name, this.snapshot);
    }
    , this);

    // define diff
    __getter("diff", function() {
      return (target[name]===this.origin);
    }, this);
  }
  DefineProperty.prototype = Object.create(Write.prototype);
  DefineProperty.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+this.cmd;
  }

  /** target, name -> boolean
  */
  function DeleteProperty(target, scope, name) {
    if(!(this instanceof DeleteProperty)) return new DeleteProperty(target, scope, name);
    else Write.call(this, "deleteProperty [name="+name+"]", target, scope);


    Object.defineProperties(this, {
      "name": {
        value: name
      },
      "origin": {
        value: (Object.prototype.hasOwnProperty.call(target, name) ? target[name] : undefined)
      },
      "snapshot": {
        value: (Object.prototype.hasOwnProperty.call(scope, name) ? scope[name] : undefined)
      }  
    });



    // define name
    __define("name", name, this);

    // define origin
    //__define("origin", (Object.prototype.hasOwnProperty.call(target, name) ? target[name] : undefined), this);
    // define commit
    __define("commit", function() {
      return (delete target[name]);
    }, this);

    // define snapshot
    //__define("snapshot", (Object.prototype.hasOwnProperty.call(scope, name) ? scope[name] : undefined), this);
    // define rollback
    __define("rollback", function() {
      return (target[name]=this.snapshot);
    }
    , this);

    // define diff
    __getter("diff", function() {
      return (Object.prototype.hasOwnProperty.call(target, name) ? target[name] : undefined)===this.origin;
    }, this);
  }
  DeleteProperty.prototype = Object.create(Write.prototype);
  DeleteProperty.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+this.cmd;
  }

  /** target -> boolean
  */
  function Freeze(target, scope) {
    if(!(this instanceof Freeze)) return new Freeze(target, scope);
    else Write.call(this, "freeze", target, scope);

    Object.defineProperties(this, {
      "origin": {
        value: Object.isFrozen(target)
      },
      "snapshot": {
        value: Object.isFrozen(scope)
      }  
    });



    // define origin
    //__define("origin", Object.isFrozen(target), this);
    // define commit
    __define("commit", function() {
      return Object.freeze(target);
    }, this);

    // define snapshot
    //__define("snapshot", Object.isFrozen(scope), this);
    // define rollback
    __define("rollback", function() {
      throw new Error("Rollback not possible");
    }
    , this);

    // define diff
    __getter("diff", function() {
      return (Object.isFrozen(target)===this.origin);
    }, this);
  }
  Freeze.prototype = Object.create(Write.prototype);
  Freeze.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+this.cmd;
  }

  /** target -> boolean
  */
  function Seal(target, scope) {
    if(!(this instanceof Seal)) return new Seal(target, scope);
    else Write.call(this, "seal", target, scope);

    Object.defineProperties(this, {
      "origin": {
        value: Object.isSealed(target)
      },
      "snapshot": {
        value: Object.isSealed(scope)
      }  
    });



    // define origin
    //__define("origin", Object.isSealed(target), this);
    // define commit
    __define("commit", function() {
      return Object.seal(target);
    }, this);

    // define snapshot
    //__define("snapshot", Object.isSealed(scope), this);
    // define rollback
    __define("rollback", function() {
      throw new Error("Rollback not possible");
    }, this);

    // define diff
    __getter("diff", function() {
      return (Object.isSealed(target)===this.origin);
    }, this);
  }
  Seal.prototype = Object.create(Write.prototype);
  Seal.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+this.cmd;
  }

  /** target -> boolean
  */
  function PreventExtensions(target, scope) {
    if(!(this instanceof PreventExtensions)) return new PreventExtensions(target, scope);
    else Write.call(this, "preventExtensions", target, scope);

    Object.defineProperties(this, {
      "origin": {
        value: Object.isExtensible(target)
      },
      "snapshot": {
        value: Object.isExtensible(scope)
      }  
    });


    // define origin
    //__define("origin", Object.isExtensible(target), this);
    // define commit
    __define("commit", function() {
      return Object.preventExtensions(target);
    }, this);

    // define snapshot
    //__define("snapshot", Object.isExtensible(scope), this);
    // define rollback
    __define("rollback", function() {
      throw new Error("Rollback not possible");
    }, this);

    // define diff
    __getter("diff", function() {
      return (Object.isExtensible(target)===this.origin);
    }, this);
  }
  PreventExtensions.prototype = Object.create(Write.prototype);
  PreventExtensions.prototype.toString = function() {
    return "(" + this.date.getTime() + ")"+" "+this.cmd;
  }

  //  ___           __ _ _    _   
  // / __|___ _ _  / _| (_)__| |_ 
  //| (__/ _ \ ' \|  _| | / _|  _|
  // \___\___/_||_|_| |_|_\__|\__|

  function Conflict(sbxA, effectA, sbxB, effectB) {

    if(!(sbxA instanceof Sandbox))
      throw new TypeError("No sandbox object.");
    if(!(sbxB instanceof Sandbox))
      throw new TypeError("No sandbox object.");

    if(!(effectA instanceof Effect))
      throw new TypeError("No effect object.");
    if(!(effectB instanceof Effect))
      throw new TypeError("No effect object.");

    // define sbxA
    __define("sbxA", sbxA, this);
    // define sbxB
    __define("sbxB", sbxB, this);
    // define effectA
    __define("effectA", effectA, this);
    // define effectB
    __define("effectB", effectB, this);

    // define toString
    __define("toString", function() {
      return "Confict: "
      + effectA.toString() + "@" + sbxA.id
      + " - "
      + effectB.toString() + "@" + sbxB.id;
    }, this);
  }

  // ___  _  __  __                         
  //|   \(_)/ _|/ _|___ _ _ ___ _ _  __ ___ 
  //| |) | |  _|  _/ -_) '_/ -_) ' \/ _/ -_)
  //|___/|_|_| |_| \___|_| \___|_||_\__\___|

  function Difference(sbx, effect) {


    if(!(sbx instanceof Sandbox))
      throw new TypeError("No sandbox object.");

    if(!(effect instanceof Effect))
      throw new TypeError("No effect object.");

    // define sbx
    __define("sbx", sbx, this);
    // define effect
    __define("effect", effect, this);

    // define toString
    __define("toString", function() {
      return "Difference: "
      + effect.toString() + "@" + sbx.id;
    }, this);
  }

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
  __define("Apply", Apply, Effects);

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

  // Core Effects
  __define("Conflict", Conflict, Effects);
  __define("Difference", Difference, Effects);

  return Effects;

})();
