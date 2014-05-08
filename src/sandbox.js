
function Configuration(params) {
  if(!(this instanceof Configuration)) return new Configuration(params);

  //                      _   _                      _    
  // _ __  __ _ _________| |_| |_  _ _ ___ _  _ __ _| |_  
  //| '_ \/ _` (_-<_-<___|  _| ' \| '_/ _ \ || / _` | ' \ 
  //| .__/\__,_/__/__/    \__|_||_|_| \___/\_,_\__, |_||_|
  //|_|                                        |___/      

  var passthrough = (params["passthrough"]) ? true : false;

  Object.defineProperty(this, "passthrough", {
    get: function () { return passthrough; },
    enumerable: true
  });
}

function Evaluation(params) {
  if(!(this instanceof Evaluation)) return new Evaluation(params);

  //    _                       _ _     
  // __| |___ __ ___ _ __  _ __(_) |___ 
  /// _` / -_) _/ _ \ '  \| '_ \ | / -_)
  //\__,_\___\__\___/_|_|_| .__/_|_\___|
  //                      |_|           

  var decompile = (params["decompile"]) ? true : false;

  Object.defineProperty(this, "decompile", {
    get: function () { return decompile; },
    enumerable: true
  });

  //                 _                      
  // _ __  ___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| '  \/ -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|_|_\___|_|_|_|_.__/_| \__,_|_||_\___|

  var membrane = (params["membrane"]) ? true : false;

  Object.defineProperty(this, "membrane", {
    get: function () { return membrane; },
    enumerable: true
  });
}

function Verbose(params) {
  if(!(this instanceof Verbose)) return new Verbose(params);

  //                 _                      
  // _ __  ___ _ __ | |__ _ _ __ _ _ _  ___ 
  //| '  \/ -_) '  \| '_ \ '_/ _` | ' \/ -_)
  //|_|_|_\___|_|_|_|_.__/_| \__,_|_||_\___|

  var membrane = (params["membrane"]) ? true : false;

  Object.defineProperty(this, "membrane", {
    get: function () { return membrane; },
    enumerable: true
  });

  // _                             _   _             
  //| |_ _ _ __ _ _ _  ___ __ _ __| |_(_)___ _ _  ___
  //|  _| '_/ _` | ' \(_-</ _` / _|  _| / _ \ ' \(_-<
  // \__|_| \__,_|_||_/__/\__,_\__|\__|_\___/_||_/__/

  var transactions = (params["transactions"]) ? true : false;

  Object.defineProperty(this, "transactions", {
    get: function () { return transactions; },
    enumerable: true
  });
}



function Out() {
  this.membrane = function(msg) {};
  this.transactions = function(msg) {};
}


function ShellOut() {
  if(!(this instanceof ShellOut)) return new ShellOut();
  else Out.call(this);

  // TODO: set verbose configutarion
  //
  var idWidth = 30;
  var fstWidth = 100;
  var sndWidth = 20;
  var seperator = ".";

  /** Standard Output
  */
  function out(string) {
    putstr(padding_right(string + " ", seperator, fstWidth));
  }

  /** Sub-Standard Output
  */
  function subout(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth));
  }

  /** BLANK Output
  */
  function blank() {
    putstr(padding_left(seperator, seperator, sndWidth));
    putstr("\n");
  }

  /** Notice Output
  */
  function notice(string) {
    putstr(padding_right("... " + string + " ", seperator, fstWidth+sndWidth));
    putstr("\n");
  }

   /** Head Output
  */
  function head(id) {
    return padding_right(id + " ", ".", idWidth)
  }





  this.membrane = function(msg) {
    if(verbose.membrane) {
      __out(head("[Membrane]") + msg);
      __blank();
    }
  };

  this.transactions = function(msg) {
    if(verbose.membrane) {
      __out(head("[Transaction]") + msg);
      __blank();
    }
  };
}
ShellOut.prototype = new Out();







function Sandbox(
    configuration, 
    verbose,
    log
    ) {

      // TODO defualt




    }



var sbx = new Sandbox({membrane:true;}, {});
