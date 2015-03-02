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

/*(function() {
  var o = {x:4711};
  var r = (p = o.x) ? p : "error";
  print(r);
  print(p);
})();
quit();*/

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
  verbose:false,          // Verbose Mode (default: false)
  statistic:true,        // Enable Statistic (default: false)
  decompile:true,         // Decompile (default: true)
  membrane:true,          // Membrane (default: true)
  effect:true,           // Effect (default: true)
  transparent:false,      // Transparent  (default: false)
  metahandler:false ,      // MetaHandler (default: true)
  nativepassthrough:true, // Native Function pass-through
  out:ShellOut()          // Output (default: true)
}

// ==================================================

//load('demo/sandbox.js');
load('test/default.js')
quit();

// ==================================================

(function(){})();


//(function() {
//  var o = {x:4711};
//  var r = (p = o.x) ? p : "error";
//  print(r);
//  print(p);
//});


quit();
var global = "uneffected";
var global2 = "uneffected";

function Observer(target, handler) {
  if(!target) throw new Error("Undefined target!");
  if(!handler) throw new Error("Undefined handler!");

  var sbx = new Sandbox(this, __params__); 

  var controller = { 
    get:function(target, name, receiver) {
      var result = null;
      if(handler['get']) {
        //result = handler['get'].call(this, target, name, receiver);
        //print("############"+name);
        result = sbx.call(handler['get'], this, target, name);
      } 

      //return result;
      //when using transparent proxies, the observer would also be abel
      //to implement another contract;
      return result;
     // return (result===target[name]) ? result : target[name];
    }};

  return new Proxy(target, controller);
}

// ==================================================

var target = {x:4711, y:4712, z:4713};
Object.defineProperty(target, "a", { get: function () {
  print("|||||||||||||||||||| GETTER CALLED");
  global2 = "effected";
  return this.x; 
}});

var handler = {
//  postGet:function(name) {
//  },
//  preGet:function(result) {
//  },

  get:function(target, name, receiver) {
    // side effects
    //global = "effected";
    //target.z = "effected";
    //throw new Error("Exception");
    //return "somethin else";
//    return target['adfasdf'];
//    print("$$$$$$$$$$$$" + name);

    target[name];
    target[name];
    target[name];


    return target[name];
    //return "3";
  }};

var observed = Observer(target, handler);

//print(observed['a']);

//print("x: " + observed.x);
//print("y: " + observed.y);
//print("z: " + observed.z);
//print("g: " + global);
print("a: " + observed.a);
//print("b: " + observed.b);
print("g2:" + global2);

/*
var desc = Object.getOwnPropertyDescriptor(target, 'a');
print(desc.value);
print(desc.writable);
print(desc.get);
print(desc.set);
print(desc.configurable);
print(desc.enumerable);

var desc = Object.getOwnPropertyDescriptor(target, 'x');
print(desc.value);
print(desc.writable);
print(desc.get);
print(desc.set);
print(desc.configurable);
print(desc.enumerable);
*/






















quit();

//load("demo/sandbox.js");
//load("demo/statistic.js");
//load("demo/effect.js");
//load("demo/commit.js");
//load("demo/conflict.js");
//load("demo/diff.js");
//load("demo/rollback.js");
//load("demo/transparent.js");
load("demo/reverse.js");

quit();


//load("benchmark/sbxbench/richards.js");
//runRichards();
//quit();
/*

   function getNewSandbox() {
   return new Sandbox(this, __params__);
   }

   var sbx = getNewSandbox();
//this.run = sbx.bind(run);

var sbxbench = "(function() { " + read("benchmark/octane2/base.js") + read("benchmark/octane2/richards.js") + read("benchmark/octane2/run.js") + "})";
print(sbxbench);
var sbxf = eval(sbxbench);


sbxf();
sbx.apply(sbxf);
//sbxf();

*/

/*

   function A() {
   this.x=0;
   }
   A.prototype.f = function(a) {
   this.x=a;
   }

   function g() {
   var a = new A();
   print("1) "+a.x);
   a.f(1);
//print("2) "+a.x);
}
var sbx = new Sandbox(this, __params__);



sbx.apply(g);
print('---');
g();







*/









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
