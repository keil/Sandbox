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

// TODO
load("src/this.js");

load("src/effect.js");
load("src/sandbox.js");

load('test/testcase.js');
load('test/metahandler.js');

// ==================================================

//load("test/membrane/Object.has.js");
//load("test/membrane/Object.hasOwn.js");

load("test/behavior/eval.js");
//load("test/behavior/decompile.js");


// Test haldler calls
//load("demo/handler.js")







// TODO, is function wrapper still required

quit();

// TODO, bis is when no this is defined
// restrict acces bu an violation if no has is avaliable

var n1=4711;
var n2=4712;
var o={p:true, q:false};

var sbx = new Sandbox({verbose:true, out:ShellOut()});

function ff() {
  n1 = "[4711]";
  n2;
  o.p;
  o.q=true;
}

function gg() {
//  print(">> " + n1);
//  print(">> " + n2);
}

//ff();
sbx.apply(ff, this);
sbx.apply(gg, this);

print("> " + n1);
print("> " + n2);

var rects = sbx.getReadEffects(this);
print(";;; Read Effects");
rects.foreach(function(i, e) {print(e)});
print("\n");

var wects = sbx.getWriteEffects(this);
print(";;; Write Effects");
wects.foreach(function(i, e) {print(e)});
print("\n");

/*
var ects = sbx.getEffects(this);
print(";;; All Effects");
ects.foreach(function(i, e) {print(e)});
print("\n");
*/

var rectso = sbx.getReadEffects(o);
print(";;; Read Effects of o");
rectso.foreach(function(i, e) {print(e)});
print("\n");

var wectso = sbx.getWriteEffects(o);
print(";;; Write Effects of o");
wectso.foreach(function(i, e) {print(e)});
print("\n");


print("? "+o.p);
print("? "+o.q);

print(wectso[0]);
wectso[0].commit();

print("? "+o.p);
print("? "+o.q);

// TODO origin, 













quit();

var M = {a:5711, x:4711, b:134};

print(Object.keys(M));
M.y=54245;
print(Object.keys(M));



var d = new Date();
print(d);
for(var i=0; i<100000000; i++) {}
print(d);
var dd = new Date();
print(dd);
print(d<dd);


function A() {
this.a = "[a]";
}
function B() {
this.b = "[b]";
}
B.prototype = new A();

for (p in (new B())) {
  print("#"+p);
}

 

var x = "4711";

var f = (function() {
  var x = "4711";
  return function() {
  print(x);
  print(this.x);
  eval("x=4712");
  eval("this.x=4712");
  print(x);
  print(this.x);
  }
})();

print(x);
print(this.x);
f();
print(x);
print(this.x);


// ==================================================

quit();

//load('test/test.js');

////load("test/membrane/Object.apply.js");
////load("test/membrane/Object.construct.js");
////load("test/membrane/Object.defineProperty.js");
////load("test/membrane/Object.deleteProperty.js");
////load("test/membrane/Object.enumerate.js");
//load("test/membrane/Object.freeze.js");
////load("test/membrane/Object.get.js"); 
//load("test/membrane/Object.getOwnPropertyDescriptor.js");
//load("test/membrane/Object.getOwnPropertyNames.js");
//load("test/membrane/Object.getPrototypeOf.js"); // TODO should not be a testcase
////load("test/membrane/Object.has.js");
////load("test/membrane/Object.hasOwn.js");
////load("test/membrane/Object.isExtensible.js");
//load("test/membrane/Object.isFrozen.js");
//load("test/membrane/Object.isSealed.js");
////load("test/membrane/Object.iterate.js");
////load("test/membrane/Object.keys.js"); 
////load("test/membrane/Object.preventExtensions.js");
//load("test/membrane/Object.seal.js");
////load("test/membrane/Object.set.js");

load("test/behavior/prototype.js");























