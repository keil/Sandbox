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


var sbx = new Sandbox(this, __params__);

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
