//////////////////////////////////////////////////
// ARRAY FOREACH
//////////////////////////////////////////////////

Array.prototype.foreach = function( callback ) {
  for( var k=0; k<this .length; k++ ) {
    callback( k, this[ k ] );
  }
}

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.clone = function() {
  return this.slice(0);
};

Array.prototype.clear = function() {
  while (this.length > 0) {
    this.pop();
  }
};

//////////////////////////////////////////////////
// DUMP
//////////////////////////////////////////////////

/* Dump Values to String Output
*/
function __dump(value) {
  if (value === Object(value)) return "[" + typeof value + "]";
  if (typeof value == "string") return "\"" + value + "\"";
  return "" + value;
}


function __define(name, property, target) {
  Object.defineProperty(target, name, {
    get: function () { return property; }
  });

