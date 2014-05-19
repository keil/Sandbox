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


function test (arg) {

  Object.preventExtensions(arg.p);
  arg.p.x = "x";

  print(Object.isExtensible(arg.p));
  print(arg.p.x);
}

//test({p:{}});
//test.apply(this, [{p:{}}]);
//quit();


load('test/testcase.js');
load('test/metahandler.js');
//load('test/test.js');

var arg={};

(function(object) {

  function Handler(target) {
    this.get = function(target, name) {
      return target[name];
    };
    this.set = function(target, name, value) {
      return (target[name]=value);
    }
    this.preventExtensions = function(target) {
      return Object.preventExtensions(target);
    }
    this.isExtensible = function(target)  {
      return Object.isExtensible(target);
    }
  }

  var proxy = new Proxy({}, new Handler(object));
  proxy.a = 4711;
  Object.preventExtensions(proxy);
  proxy.b = 4711;

  print("---");
  print("---");
  print(Object.isExtensible(proxy));
  print(Object.isExtensible(object));
  print("---");
  print(proxy.a);
  print(proxy.b);
  print("---");
  print(object.a);
  print(object.b);
  print("---");
  print("---");

})(arg);

//var arg={};

(function(object) {

  function Handler() {
    this.get = function(target, name) {
      return target[name];
    };
    this.set = function(target, name, value) {
      return (target[name]=value);
    }
    this.preventExtensions = function(target) {
      return Object.preventExtensions(target);
    }
    this.isExtensible = function(target)  {
      return Object.isExtensible(target);
    }
  }

  var proxy = new Proxy(object, new Handler());
  proxy.a = 4711;
  Object.preventExtensions(proxy);
  proxy.b = 4711;

  print("---");
  print("---");
  print(Object.isExtensible(proxy));
  print(Object.isExtensible(object));
  print("---");
  print(proxy.a);
  print(proxy.b);
  print("---");
  print(object.a);
  print(object.b);
  print("---");
  print("---");

})(arg);




















// Meta Level Funneling
(function() {
  var target = {};
  var handler = new MetaHandler({});
  var proxy = new Proxy(target, handler);

  print(proxy.a);
  print(proxy.a=1);
  print(proxy.a);

  print("---");
  print("> "+Object.freeze(proxy));
  print("---");
  print("> "+Object.isFrozen(proxy));
  print("---");
});


(function() {
  var target = {a:4711, b:4712, c:{x:4713, y:4714}};
  var scope = {};

  function Handler(base) {
    this.get = function(target, name) {
      return target[name];
    }
    this.set = function (target, name, value) {
      return target[name]=value;
    }
    this.preventExtensions = function(target) {
      return Object.preventExtensions(target);
    },
this.isExtensible = function(target) {
  return Object.isExtensible(target);
}
}

// wrap twice
var proxy = new Proxy(target, new Handler(scope));

print("---");
print(proxy.a);
print(proxy.b);
print(proxy.c.x);
print(proxy.c.y);
print(">"+(proxy.c.z=1));
print(proxy.c.z);
print(">"+(proxy.x=1));
print(proxy.x);
print(proxy.y);
print("---");

for (p in proxy) {
  print ("."+p);
}

print(">"+Object.preventExtensions(proxy));
print(Object.isExtensible(target)===Object.isExtensible(proxy));

for (p in target) {
  print ("."+p);
}


});

(function() {
  var target = {a:4711, b:4712, c:{x:4713, y:4714}};

  function Handler(base, scope) {
    for(p in base) {
      scope[p]=base[p];
    }

    this.get = function(target, name) {
      return wrap((name in target) ? target[name] : base[name]);
    }
    this.set = function (target, name, value) {
      return target[name]=value;
    }
    this.preventExtensions = function(target) {
      return Object.preventExtensions(target);
    },
  this.isExtensible = function(target) {
    return Object.isExtensible(target);
  }
  }

  var cache = new WeakMap();
  function wrap(target) {
    if(typeof target !== "object") return target;
    if(cache.has(target)) {
      var proxy = cache.get(target);
    }
    else {
      var scope = {}
      var proxy = new Proxy(scope, new Handler(target, scope));
      cache.set(target, proxy);
    }
    return proxy;
  }

  var proxy = wrap(target);

  print("---");
  print(proxy.a);
  print(proxy.b);
  print(proxy.c.x);
  print(proxy.c.y);
  print(">"+(proxy.c.z=1));
  print(proxy.c.z);
  print(">"+(proxy.x=1));
  print(proxy.x);
  print(proxy.y);
  print("---");

  for (p in proxy) {
    print ("."+p);
  }

  print(">"+Object.preventExtensions(proxy));
  print(Object.isExtensible(target)===Object.isExtensible(proxy));

  for (p in target) {
    print ("."+p);
  }


});





/*
   var o = {a:1, b:2, c:3};

   var h = new Proxy({}, {
   get: function(target, name) {
   print("#" + name);
   return target[name];
   }
   })

   var p = new Proxy(o, h);
   p.a;
   p.x=3;

   for(x in p) {
   print("!" + x);
   }
   */


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
/*
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
*/

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

/*
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


*/
