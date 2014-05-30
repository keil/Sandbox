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
  transparent:false,      // Transparent
  metahandler:true,       // MetaHandler
  nativepassthrough:true, // Native Function pass-through
  out:ShellOut()          // Output
}

// ==================================================


//load("demo/sandbox.js");
//load("demo/statistic.js");
//load("demo/effect.js");
//load("demo/commit.js");
//load("demo/conflict.js");
//load("demo/diff.js");
//load("demo/rollback.js");
load("demo/transparent.js");


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
  //a.f(1);
  //print("2) "+a.x);
}
var sbx = new Sandbox(this, params);



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
