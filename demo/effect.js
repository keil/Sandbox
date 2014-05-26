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

