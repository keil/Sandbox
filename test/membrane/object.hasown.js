/*

(new Testcase(function() {
  var object = {a:4711, b:4712, c:4713};
  object.a = "L";
  return ('a' in object);
}, {}, "Object.hasOwn"));




var object = {a:4711, b:4712, c:4713};

(new Testcase(function() {
  
  object['x'] = 4715;
  object.a = null;
  delete object.a;

  var outcome = "";
  for(var property in object) outcome = outcome + property;
  return outcome;
}, this, "Object.enumerate"));

*/
print("***");






function XTestcase(func, globalArg, thisArg, args, name) {

  function run() {
    var sbx = new SandboxEnvironment(globalArg);
//    var sbxFun = sbx.bind(func);

    var outcomeA = sbx.eval(func, globalArg, thisArg, args)
    var outcomeB = func.apply(thisArg, args);

    var result = (outcomeA===outcomeB);

    print("# " + name + " - " + result);
    if(true || !result) {
      print("A) " + outcomeA);
      print("B) " + outcomeB);
    } 
  }

  this.run = run; 
}

//var object = {a:4711, b:4712, c:4713};

(new XTestcase(function(object) {
  object['x'] = 4715;
  object.a = null;
  delete object.a;

  var outcome = "";
  for(var property in object) outcome = outcome + property;
  return outcome;
}, {}, {}, [{a:4711, b:4712, c:4713}], "Object.enumerateX")).run();


(new XTestcase(function(object) {
  //object['x'] = 4715;
  //object.a = null;
  //delete object.a;

  var outcome = "";
  for(var property in object) outcome = outcome + property;
  return outcome;
}, {}, {}, [{a:4711, b:4712, c:4713}], "Object.enumerateXX")).run();

