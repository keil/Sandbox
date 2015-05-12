/*
 * TreatJS: Sandbox 
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 *
 * Copyright (c) 2014, Proglang, University of Freiburg.
 * http://proglang.informatik.uni-freiburg.de/treatjs/
 * All rights reserved.
 *
 * Released under the MIT license
 * http://proglang.informatik.uni-freiburg.de/treatjs/license
 *
 * Author Matthias Keil
 * http://www.informatik.uni-freiburg.de/~keilr/
 */

// ==================================================

// default sandbox parameters
var __testparams__ = {
  verbose:false,          // Verbose Mode (default: false)
  statistic:false,        // Enable Statistic (default: false)
  decompile:true,         // Decompile (default: true)
  membrane:true,          // Membrane (default: true)
  effect:false,           // Effect (default: true)
  transparent:false,      // Transparent  (default: false)
  metahandler:false ,      // MetaHandler (default: true)
  nativepassthrough:true, // Native Function pass-through
  out:ShellOut()          // Output (default: true)
}

// ==================================================



function getNewSandbox() {
  return new Sandbox(this, __testparams__);
}
