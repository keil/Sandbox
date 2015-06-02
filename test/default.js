var values = [{}, {}, {}];
var map = new WeakMap();
map.set(values[0],values[0]);
print(map.has(values[0]));


quit();

var array = [1, 2, "test", {a: 10}];
var set = new WeakSet(array);


print(set.has.apply(set, [array[3]]));

quit();

print(set.has(1));

for(var x in Date.prototype) print(x);

Object.getOwnPropertyNames(Array.prototype);

quit();



//quit();

// test new engine

// Indirect eval will break the encapsulation
// eval.bind ist not equals to eval, and thus not filterewd

// --> implement whitelisting
// --> eval as function call

var x = "L";

function testx (f) {
  "use strict";

  var e = eval;
  print(Function.prototype.toString.apply(f));

//f("x = 'oIo'; y=2; var z=3;");

  eval("x = 'oIo'; y=2; var z=3;");

/*
  eval("x = 'oIo'; y=2; var z=3;");
  print(y);
  print(z);
  */

}

var sbx = new Sandbox(this, Sandbox.DEBUG);
sbx.apply(testx, this, [eval.bind(this)]);


print(x);
print(y);
print(z);











quit();

var x = "L";

function test () {
  "use strict";

  var e = eval; 

  e("x = 'oIo'; /*y=2;*/ var z=3;");
  print(z);

}

test();


print(x);
//print(y);
//print(z);











/*
var x = "L";

function XTest() {
}


function f() {

  var Test = function() {
  }

    var e = eval;

  //eval("x=new Test()");
  e("x=new Test()");

};

f();

var sbx = new Sandbox(this, Sandbox.DEBUG);
//sbx.apply(f);

print("XXXXX" + x);

*/
quit();

this.objA = {};

var sbx = new Sandbox(this, Sandbox.DEBUG);

sbx.apply(function(y) {
  this.objB = objA;
}, this);


print("---");
print(sbx.readeffectsOf(this));
print(sbx.writeeffectsOf(this));
print("---");
print(sbx.readeffectsOf(objA));
print(sbx.writeeffectsOf(objA));

print('objA' in this);
print('objB' in this);

sbx.writeeffectsOf(this)[0].commit();

print('objA' in this);
print('objB' in this);

objA.x;
objB.x;

objA.y=1;
objB.y=1;

print(sbx.readeffectsOf(objA));
print(sbx.writeeffectsOf(objA));



quit();

this.obj = {};

var sbx = new Sandbox(this, Sandbox.DEBUG);

sbx.apply(function(y) {
  obj.x;
  obj.y = 1;
  obj.y;obj.y;obj.y;
  obj.y;obj.y;obj.y;
}, this);


//print("---");
//print(sbx.readeffectsOf(this));
//print(sbx.writeeffectsOf(this));
print("---");
print(sbx.readeffectsOf(obj));
print(sbx.writeeffectsOf(obj));


/*
 * BUG, is need two different sandbox handler objects,
 * one for the glo9bal, that returns always true for a has requiest, 
 * and one for notmal objects
 *
 */

quit();














/*
var x = 0;

var d = new Date();
var dd = Date.now();
for (i=0; i<10000; i++) x+=1;
var e = new Date();
var ee = Date.now();

print(d.toString());
print(e.toString());
print(d<e);

print(dd.toString());
print(ee.toString());
print(dd<ee);

//print(Date.now());
print((new Date()));

quit();
*/







var x = 4711;

var sbx = new Sandbox({x:1}, Sandbox.DEBUG);

//var obj = sbx.wrap({a:4711, b:4712});
//print(obj.x);

var fun = sbx.wrap(function(y) {
  x= x+y;
  return x;
});

print(fun(1));
print("x : " + x);


/*
 * BUG, is need two different sandbox handler objects,
 * one for the glo9bal, that returns always true for a has requiest, 
 * and one for notmal objects
 *
 */

quit();






function Node (value, left, right) {
  if(!(this instanceof Node)) return new Node (value, left, right);

  this.value = value;
  this.left = left;
  this.right = right;
}
Node.prototype.toString = function () {
//  return "(" + (this.left?this.left + "-":"") + this.value +(this.right?"-"+this.right:"") + ")";
  return (this.left?this.left + ", ":"") + this.value +(this.right?", "+this.right:"");
}

var root = Node(0, Node(0, Node(0), Node(0)), Node(0));





function sumOf (node) {
  return (node) ? node.value + sumOf(node.left) + sumOf(node.right) : 0;
}

function depthOf (node) {
  return Math.max(((node.left)?depthOf(node.left)+1:0), ((node.right)?depthOf(node.right)+1:0));
}



print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));


function setValue (node) {
  if (node) {
    node.value=depthOf(node);
    setValue(node.left);
    setValue(node.right);
  }
}
//setValue(root);

print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));


var sbx = new Sandbox(this, __params__)

sbx.call(setValue, this, root);

print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));

print("tree: " + sbx.call(root.toString, root));
print("sumOf: " + sbx.call(sumOf, this, root));
print("deptOf: " + sbx.call(depthOf, this, root));

// DIFFERENCES

print("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

print("InDifference(root): " + (sbx.hasDifferenceWith(root)));

var difso = sbx.differencesOf(root);
print(";;; Differences of root");
difso.foreach(function(i, e) {print(e)});
print("\n");


print("InDifference: " + (sbx.hasDifference()));

var difs = sbx.differences();
print(";;; All Differences");
difs.foreach(function(i, e) {print(e)});
print("\n");


// effects

/*
var rects = sbx.readeffectsOf(this);
print(";;; Read Effects");
rects.foreach(function(i, e) {print(e)});
print("\n");
*/

/*
var wects = sbx.writeeffectsOf(this);
print(";;; Write Effects");
wects.foreach(function(i, e) {print(e)});
print("\n");
*/

/*
var ects = sbx.effectsOf(this);
print(";;; All Effects");
ects.foreach(function(i, e) {print(e)});
print("\n");
*/

/*
var rectso = sbx.readeffectsOf(root);
print(";;; Read Effects of root");
rectso.foreach(function(i, e) {print(e)});
print("\n");
*/

/*
var wectso = sbx.writeeffectsOf(root);
print(";;; Write Effects of root");
wectso.foreach(function(i, e) {print(e)});
print("\n");
*/

/*
var ects = sbx.effectsOf(root);
print(";;; All Effects of root");
ects.foreach(function(i, e) {print(e)});
print("\n");
*/



// Note:
// - sbx.readeffects
// - sbx.readeffects
// - sbx.effets
// returns a list og all effects

/*
var ects = sbx.writeeffects;
print(";;; All Effects of root");
ects.foreach(function(i, e) {print(e)});
print("\n");
*/


// COMMIT


/*
var wects = sbx.writeeffects;
print(";;; Read Effects");
wects.foreach(function(i, e) {print(e)});
print("\n");


print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));

wects[0].commit();


print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));

*/




// rollback

/*
var effects = sbx.writeeffects;
print(";;; Read Effects");
effects.foreach(function(i, e) {print(e)});
print("\n");

print("tree: " + sbx.call(Node.prototype.toString, root));
print("sumOf: " + sbx.call(sumOf, this, root));
print("deptOf: " + sbx.call(depthOf, this, root));
*/
/*
sbx.writeeffectsOf(root).foreach(function(i, e) {
  print("Rollback: " + e + "/" + e.origin);
  e.rollback()
});
*/

/*
sbx.rollbackOf(root);

print("tree: " + sbx.call(Node.prototype.toString, root));
print("sumOf: " + sbx.call(sumOf, this, root));
print("deptOf: " + sbx.call(depthOf, this, root));


sbx.rollback();

*/
/*
sbx.apply(show);

sbx.rollback(o)
sbx.apply(show);

//quit();

sbx.apply(f);
sbx.apply(show);
sbx.rollback();
sbx.apply(show);

*/



print('+++++++++++++++++++++++++++++++++++');

/*
print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));


print("tree: " + sbx.call(Node.prototype.toString, root));
print("sumOf: " + sbx.call(sumOf, this, root));
print("deptOf: " + sbx.call(depthOf, this, root));*/
/*
var sbx2 = new Sandbox(this, __params__);

function appendRight (node) {
  var subtree = Node('a', Node('b'), Node('c'));
  node.right = subtree;
}

//appendRight(root);

sbx2.call(appendRight, this, root);
*/
/*
print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));

print("tree: " + sbx.call(Node.prototype.toString, root));
print("sumOf: " + sbx.call(sumOf, this, root));
print("deptOf: " + sbx.call(depthOf, this, root));

print("tree: " + sbx2.call(Node.prototype.toString, root));
print("sumOf: " + sbx2.call(sumOf, this, root));
print("deptOf: " + sbx2.call(depthOf, this, root));
*/
/*
print("InClonflict: " + (sbx.inConflict(sbx2)));
//print("InClonflict: " + (sbxB.inCconflict(sbxA)));

var cofts = sbx.conflicts(sbx2);
print(";;; All Conflicts");
cofts.foreach(function(i, e) {print(e)});
print("\n");
*/

/*
print("InClonflict(o): " + (sbx.inConflictWith(sbx2, root)));
//print("InClonflict(o): " + (sbxB.inConflictWith(sbxA, o)));

var coftso = sbx.conflictsOf(sbx2, root);
print(";;; Conflicts of root");
coftso.foreach(function(i, e) {print(e)});
print("\n");
*/


// transparent
print("@@@@@@@@@@@@@@@@@@@@@@@@@@@@");

/*
(function () {
  var __params2__ = __params__;
  __params2__.transparent = true;
  var tsbx = new Sandbox(this, __params2__);

tsbx.call(setValue, this, root);

print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));


print("tree: " + sbx.call(Node.prototype.toString, root));
print("sumOf: " + sbx.call(sumOf, this, root));
print("deptOf: " + sbx.call(depthOf, this, root));

tsbx.rollback();
print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));


})();
*/













// reverse

/*
var sbx3 = new Sandbox(this, __params__);
var sbxroot = sbx3.wrap(root);

print("============================")

print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));

print("tree: " + sbxroot);
print("sumOf: " + sumOf(sbxroot));
print("deptOf: " + depthOf(sbxroot));

setValue(sbxroot);

print("tree: " + root);
print("sumOf: " + sumOf(root));
print("deptOf: " + depthOf(root));

print("tree: " + sbxroot);
print("sumOf: " + sumOf(sbxroot));
print("deptOf: " + depthOf(sbxroot));

print(sbx3.writeeffects);

//inc(root);
//

//print(root);
//print(sumOf(root));


*/


/*
print(sum(root));
inc(root.right);
print(sum(root));
*/

/*
var sbx = new Sandbox(this, __params__);

print(sbx.apply(sum, this, [root]));
sbx.apply(inc, this, [root.right])
print(sbx.apply(sum, this, [root]));

print(sum(root));

*/
