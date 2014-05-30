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

load("lib/padding.js")

load("src/misc.js");
load("src/out.js");
load("src/shell.js");
load("src/statistic.js");

load("src/effect.js");
load("src/sandbox.js");

load('test/testcase.js');
load('test/metahandler.js');

// ==================================================

// default sandbox parameters
var __params__ = {
  verbose:true,           // Verbose Mode
  statistic:true,         // Enable Statistic
  decompile:true,         // Decompile
  membrane:true,          // Membrane
  effect:true,            // Effect
  metahandler:true,       // MetaHandler
  nativepassthrough:true, // Native Function pass-through
  out:ShellOut()          // Output
}

// ==================================================

var params = {
  verbose:true,
  out:ShellOut(),
//  metahandler:false
}



function A() {
  this.x=0;
}
A.prototype.f = function(a) {
  this.x=a;
}

function g() {
  var a = new A();
  print("1) "+a.x);
  //a.f(1);
  //print("2) "+a.x);
}
var sbx = new Sandbox(this, params);



sbx.apply(g);
print('---');
g();



(function() {

  function makeMetaHandler(handler) {
    var metahandler = {
      get: function(target, name, receiver) {
        print("call trap: " + name);
        return target[name];
      }
    };
    return new Proxy(handler, metahandler)
  }

  var object = {};
  var handler = makeMetaHandler({});
  var proxy = new Proxy(object, handler);

  // call:
  Object.freeze(proxy);
  
  // output:
  // call trap: isExtensible
  // call trap: preventExtensions
  // call trap: getOwnPropertyNames   

});

(function() {

  function makeMetaHandler(handler) {
    var metahandler = {
      get: function(target, name, receiver) {
        print("call trap: " + name);
        return target[name];
      }
    };
    return new Proxy(handler, metahandler)
  }

  var object = {};
  var handler = makeMetaHandler({});
  var proxy = new Proxy(object, handler);

  // call:
  Object.seal(proxy);
  
  // output:
  // call trap: isExtensible
  // call trap: preventExtensions
  // call trap: getOwnPropertyNames   

})();


(function() {

  function dump(pd) {
    if(pd===undefined) return "undefined";
    else return " value:" + pd.value + " writeable:" + pd.writeable + " enumerable: " + pd.enumerable + " configurable:" + pd.configurable + " get:"+pd.get + " set:"+pd.set;
  }

  function makeMetaHandler(handler) {
    var metahandler = {
      get: function(target, name, receiver) {
        print("call trap: " + name);
        return target[name];
      }
    };
    return new Proxy(handler, metahandler)
  }

  var object = {bo:0,bp:0};
  var handler = makeMetaHandler({
    defineProperty:function(target,name,pd) {
      print("pd inside: "+dump(pd));
      Object.defineProperty(target,name,pd);
    }
  });
  var proxy = new Proxy(object, handler);
  var pd = {value:1};

  // #1

  // call:
  print("pd outside: "+dump(pd));
  // outcome:
  // pd outside:  value:1 writeable:undefined enumerable: undefined configurable:undefined get:undefined set:undefined
  Object.defineProperty(object,"ao",pd); // define pd directly
  Object.defineProperty(proxy,"ap",pd); // define pd indirectly
  // outcome:
  // pd inside:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined
  // Note: pd differs, 
  // but because ao and ap are still undefined, the result is the same
  print("pd of ao: "+dump(Object.getOwnPropertyDescriptor(object, "ao")));
  print("pd of ap: "+dump(Object.getOwnPropertyDescriptor(object, "ap")));
  print("pd of ap: "+dump(Object.getOwnPropertyDescriptor(proxy, "ap")));
  // outcome:
  // pd of ao:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined
  // pd of ap:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined
  // pd of ap:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined

  // #2

  // call:
  print("pd outside: "+dump(pd));
  // outcome:
  // pd outside:  value:1 writeable:undefined enumerable: undefined configurable:undefined get:undefined set:undefined
  Object.defineProperty(object,"bo",pd); // define pd directly
  Object.defineProperty(proxy,"bp",pd); // define pd indirectly
  // outcome:
  // pd inside:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined
  // Note: pd differs
  // Not, bo and bp are defined
  print("pd of ao: "+dump(Object.getOwnPropertyDescriptor(object, "bo")));
  print("pd of ap: "+dump(Object.getOwnPropertyDescriptor(object, "bp")));
  print("pd of ap: "+dump(Object.getOwnPropertyDescriptor(proxy, "bp")));
  // pd of ao:  value:1 writeable:undefined enumerable: true configurable:true get:undefined set:undefined
  // pd of ap:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined
  // pd of ap:  value:1 writeable:undefined enumerable: false configurable:false get:undefined set:undefined   

  // Note:
  // Object.defineProperty updates the fields defined in pd.
  // But, the proxy trap does not get the pd object directly, 
  // undefined fields are (e.g.  enumerable and configurable) are set to false
  // When forwarding pd to the proxy target those fields get also be updated 

});














quit();



/*
//load("demo/statistic.js");
//quit();

var obj = {x:1, y:1};

function f() {
  obj.z=2;
}

function g() {
  obj.z=(obj.x*obj.y);
}

var params = {verbose:false,out:ShellOut()};
var sbx1 = new Sandbox(this,params);
var sbx2 = new Sandbox(this,params);

//f();
//g();

sbx1.apply(f,this,[]);
//sbx1.getEffects(this).foreach(function(i, eft) print(eft));
sbx1.effectsOf(obj).foreach(function(i, eft) print("SBX1: "+eft));

sbx2.apply(g,this,[]);
sbx2.effectsOf(obj).foreach(function(i, eft) print("SBX2: "+eft));

print("a) "+obj.x);
print("b) "+obj.y);
print("c) "+obj.z);

sbx1.effects.foreach(function(i, eft) print("--> " + eft));

//sbx2.commitOf(obj);
sbx2.commit();
//print(sbx2.writeOf(obj)[0]);
//sbx2.writeOf(obj)[0].commit();
print("c) "+obj.z);

print("C? " + (sbx1.conflictOf(sbx2, obj)));


// TODO:
// get all effects
// writeeffects
// effect als getter


// TODO, conflict
*/

// ==================================================

quit();
