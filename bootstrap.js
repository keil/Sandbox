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
load("src/sandbox.js");


load('test/testcase.js');
load('test/test.js');


//quit();


/*


  if(print) {
    print("  _____             _      _ ___ ");
    print(" |_   _| _ ___ __ _| |_ _ | / __|");
    print("   | || '_/ -_) _` |  _| || \\__ \\");
    print("   |_||_| \\___\\__,_|\\__|\\__/|___/");
    print("                                 ");

    print(" * TreatJS: Sandbox");
    print(" * http://proglang.informatik.uni-freiburg.de/treatjs/");
    print("");
    print(" * Copyright (c) 2014, Proglang, University of Freiburg.");
    print(" * http://proglang.informatik.uni-freiburg.de/");
    print(" * All rights reserved.");
    print("");
    print(" * Author Matthias Keil");
    print(" * http://www.informatik.uni-freiburg.de/~keilr/");
    print("");
  }


*/



//(new Out()).id;

var sbx = new Sandbox();
sbx.id;
//sbx.bind();
//sbx.bind();
print("###1" + sbx.id);
print("###1" + sbx.id);
print("###1" + sbx.id);
print(sbx);
print(sbx);
print(sbx);

var sbx2 = new Sandbox({});
//sbx2.bind();
//sbx2.bind();
print("###2" + sbx2.id);
print(sbx2);




var a = 1;
function f(b, c, d) {
  print("----");
  print(this.a);
  print(b);
  print(c);
  print(d);
}

f(4711,1);

g = f.bind({a:2}, 1).bind(null, 1).bind(null, 1);
g(4711, 1);


/**
var x = 0;
var y = 0;
var z = 0;

function f (i) {
  x=x+1;
  y=y+1;
  out(i);
}

function g (i) {
  y=y+1;
  z=z+1;
  out(i);
}

function out(i) {
  print("x@" + i + ": " + x);
  print("y@" + i + ": " + y);
  print("z@" + i + ": " +  z);
}

var a = new SandboxEnvironment(this);
var b = new SandboxEnvironment(this);

// TODO
// 1) a.x sollte mir das x in a ausgeben
// 2) a.flush(x)/ a.commit .. 
// zu 1) this muss als proxy uebergeben werden
// zu 2) gemeinesames global object mit read and wtire scope
//

// Plan:
// 
// Classe out 
// * log
//
// Class Configure
// decomile
// native function pass throught
//
// Class Verbose
// sandbox
// 
//


//var f = function() {}

//f();
//g();
**/
/*

ff = a.bind(f);
ff("a");
ff("a");
ff("a");
outa = a.bind(out);

gg = b.bind(g);
gg("b");
gg("b");
gg("b");
outb = b.bind(out, this);

print("\n--\n");
out("global");
outa("a");
outb("b");

*/



//quit();
//
//
//


print(":'(");

Object.defineProperty(Object.prototype, "id", {
  get: (function() {
    var i = 0;

    function makeID() {
      i = i+1;
      return (new String(i));
    }

    return function() {
      var id = makeID();

      Object.defineProperty(this, "id", {
        get: function() { return id; }});

      return id;
    };
  })()
});

var o = new Object();
print(o.id);
print(o.id);
print(o.id);
print(o.id);
var a = new Array();
print(o.id);
print(a.id);
print(a.id);
var oo = new Object();
print(oo.id);
print(o.id);
print(a.id);
print(oo.id);



