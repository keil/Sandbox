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

//   _                     
//  /_\  _ _ _ _ __ _ _  _ 
// / _ \| '_| '_/ _` | || |
///_/ \_\_| |_| \__,_|\_, |
//                    |__/ 
//

Object.defineProperty(Array.prototype, "foreach", {value: function( callback ) {
  for( var k=0; k<this .length; k++ ) {
    callback( k, this[ k ] );
  }
},enumerable:false});

// Array Remove - By John Resig (MIT Licensed)
Object.defineProperty(Array.prototype, "remove", {value: function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
}, enumerable:false});

Object.defineProperty(Array.prototype, "clone", {value: function() {
  return this.slice(0);
}, enumerable:false});

Object.defineProperty(Array.prototype, "clear", {value: function() {
  while (this.length > 0) {
    this.pop();
  }
}, enumerable:false});


// ___                  
//|   \ _  _ _ __  _ __ 
//| |) | || | '  \| '_ \
//|___/ \_,_|_|_|_| .__/
//                |_|   

function __dump(value) {
  if (value === Object(value)) return "[" + typeof value + "]";
  if (typeof value == "string") return "\"" + value + "\"";
  return "" + value;
}

// ___       __ _          
//|   \ ___ / _(_)_ _  ___ 
//| |) / -_)  _| | ' \/ -_)
//|___/\___|_| |_|_||_\___|

function __define(name, property, target) {
  throw new Error("__define is deprecated");
  Object.defineProperty(target, name, {
    get: function () { return property; },
  enumerable: true
  });
}

function __getter(name, getter, target) {
  throw new Error("__getter is deprecated");
  Object.defineProperty(target, name, {
    get: getter,
  enumerable: true
  });
}
