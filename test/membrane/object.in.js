(new Testcase(function(object) {
  var outcome = "";
  for(var property in object) outcome = outcome + property;
  return outcome;
}, {}, {}, [{a:4711, b:4712, c:4713}], "Object.in")).run();
