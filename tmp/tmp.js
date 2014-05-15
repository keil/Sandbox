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

