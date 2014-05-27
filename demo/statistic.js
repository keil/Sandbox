
/*
var s = new Statistic();
print(s);
s.increment("BUH");
s.increment("BUH");
s.increment("BUH");
s.increment("Lala");
s.increment("L");
s.increment("BUH");
print(s);

print(s.keys());
print(s.get("L"));
*/

var sbxS = new Sandbox(this, {verbose:false, statistic:true, out:ShellOut()});

var o = {};
var of = function() {
  print(".");
}
o.f=of;
o.g=of;

sbxS.apply(function() { 
  o.f;o.f; o.f;o.f; o.f;o.f; o.f;o.f; o.f;o.f; o.f;o.f;o.g;
  o.f();
  o.g();
}, {}, []);

sbxS.statistic.keys.foreach(function(i, op) {
  print(op+": "+sbxS.statistic.get(op));
});
