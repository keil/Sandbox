



function Out() {
  this.membrane = function(msg) {};
  this.transactions = function(msg) {};
}


function ShellOut() {
  if(!(this instanceof ShellOut)) return new ShellOut();
  else Out.call(this);

  var verbose = {
    membrane:false,
    transactions:false
  };

  this.configure = function(params) {
    for(arg in verbose) {
      if(params[arg]) verbose[arg]=params[arg];
    }
  }

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
    if(verbose.membrane) {
      __out(head("[Membrane]") + msg);
      __blank();
    }
  };

  // _                             _   _             
  //| |_ _ _ __ _ _ _  ___ __ _ __| |_(_)___ _ _  ___
  //|  _| '_/ _` | ' \(_-</ _` / _|  _| / _ \ ' \(_-<
  // \__|_| \__,_|_||_/__/\__,_\__|\__|_\___/_||_/__/

  this.transactions = function(msg) {
    if(verbose.transactions) {
      __out(head("[Transaction]") + msg);
      __blank();
    }
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




function Sandbox(out, verbose, configuration, evluation) {
  if(!(this instanceof Sandbox)) return new Sandbox(out, verbose, configuration, evluation);

var uid = this.getSbxId();

this.id = uid;

  // TODO, is
  //

this.bind = function() {};
      // TODO defualt


    }

Sandbox.prototype.getSbxId = (function() {
  var str = "sbx-";
  var i = 0;
  return function() {
    i = i+1;
    return (str+(padding_left(String(i), "0", 3)));
  }
})();

//(new Out()).id;

var sbx = new Sandbox();
sbx.bind();
sbx.bind();
print("###1" + sbx.id);

var sbx2 = new Sandbox();
sbx2.bind();
sbx2.bind();
print("###2" + sbx2.id);


