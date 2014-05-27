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


//load("demo/statistic.js");
//quit();

var obj = {x:1, y:1};

function f() {
  obj.x=2;
}

function g() {
  obj.z=(obj.x*obj.y);
}

var params = {verbose:true,out:ShellOut()};
var sbx1 = new Sandbox(this,params);
var sbx2 = new Sandbox(this,params);

//f();
//g();

sbx1.apply(f,this,[]);
//sbx1.getEffects(this).foreach(function(i, eft) print(eft));
sbx1.effectsOf(obj).foreach(function(i, eft) print(eft));

sbx2.apply(g,this,[]);
sbx2.effectsOf(obj).foreach(function(i, eft) print(eft));

print("a) "+obj.x);
print("b) "+obj.y);
print("c) "+obj.z);

sbx1.effects.foreach(function(i, eft) print("--> " + eft));


//sbx2.getWriteEffects(obj)[0].commit();
//print("c) "+obj.z);

// TODO:
// get all effects
// writeeffects
// effect als getter


// TODO, conflict

// ==================================================

quit();
