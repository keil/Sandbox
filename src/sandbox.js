



function Out() {
  this.membrane = function(msg) {};
  this.transactions = function(msg) {};
}


function ShellOut() {
  if(!(this instanceof ShellOut)) return new ShellOut();
  else Out.call(this);

  /** Padding Information
  */
  var idWidth = 30;
  var fstWidth = 100;
  var sndWidth = 20;
  var seperator = ".";

  /** Standard Output (Head + Message)
  */
  function out(string) {
    putstr(padding_right(string + " ", seperator, fstWidth));
  }

  /** Sub-Standard Output (Message)
  */
  function subout(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth));
  }

  /** Blank Output (End Of Line)
  */
  function blank() {
    putstr(padding_left(seperator, seperator, sndWidth));
    putstr("\n");
  }

  /** Notice Output (Sub-Output including Blank)
  */
  function notice(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth+sndWidth));
    putstr("\n");
  }

  /** Head Output
  */
  function head(id) {
    return padding_right(id + " ", ".", idWidth);
  }
  //                 _                      
  // _ __  ___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| '  \/ -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|_|_\___|_|_|_|_.__/_| \__,_|_||_\___|

  this.membrane = function(msg) {
    __out(head("[Membrane]") + msg);
    __blank();
  };

  // _                             _   _             
  //| |_ _ _ __ _ _ _  ___ __ _ __| |_(_)___ _ _  ___
  //|  _| '_/ _` | ' \(_-</ _` / _|  _| / _ \ ' \(_-<
  // \__|_| \__,_|_||_/__/\__,_\__|\__|_\___/_||_/__/

  this.transactions = function(msg) {
    __out(head("[Transaction]") + msg);
    __blank();
  };
}
ShellOut.prototype = new Out();


/*
 * out
 *
 * verbose
 * - membrane
 * - transactions
 *
 * configuration
 * - nativepassthrough
 *
 * evaluation
 * - decompile
 * - membrane
 *
 *
 *
 *
 */

/*
   var sbx = new Sandbox({
   verbose={
   membrabe:true
   },
   decompile=true
   });
   */


function Sandbox(params) {
  if(!(this instanceof Sandbox)) return new Sandbox(params);

  /** 
   * Verbose Mode
   * (default: false)
   */
  var verbose = configure("verbose", false);

  /*
   * Decompile
   * (default: true)
   */
  var decompile = configure("decompile", true);

  /*
   * Membrane
   * (default: true)
   */
  var membrane = configure("membrane", true);

  /*
   * Output
   * (default:null);
   */
  var out = configure("out", new Out());

  //              __ _                   
  // __ ___ _ _  / _(_)__ _ _  _ _ _ ___ 
  /// _/ _ \ ' \|  _| / _` | || | '_/ -_)
  //\__\___/_||_|_| |_\__, |\_,_|_| \___|
  //                  |___/              
  function configure(param, value) {
    return (param in (params===undefined ? {} : params)) ? params[param] : value;
  };




  this.bind = function() {};
}
// ___               _ _               ___ ___  
/// __| __ _ _ _  __| | |__  _____ __ |_ _|   \ 
//\__ \/ _` | ' \/ _` | '_ \/ _ \ \ /  | || |) |
//|___/\__,_|_||_\__,_|_.__/\___/_\_\ |___|___/ 
Object.defineProperty(Sandbox.prototype, "id", {
  get: (function() {
    var str = "sbx-";
    var i = 0;
    return function() {
      i = i+1;
      return (str+(padding_left(String(i), "0", 3)));
    }
  })(),
  enumerable: false
});
// _       ___ _       _           
//| |_ ___/ __| |_ _ _(_)_ _  __ _ 
//|  _/ _ \__ \  _| '_| | ' \/ _` |
// \__\___/___/\__|_| |_|_||_\__, |
//                           |___/ 
Sandbox.prototype.toString = function() {
  return "[[Sandbox#" + this.id + "]]";
}




//(new Out()).id;

var sbx = new Sandbox();
sbx.bind();
sbx.bind();
print("###1" + sbx.id);
print(sbx);

var sbx2 = new Sandbox({});
sbx2.bind();
sbx2.bind();
print("###2" + sbx2.id);
print(sbx2);


