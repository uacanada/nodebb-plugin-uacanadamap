"use strict";
define('uacanadamap', [
 "core/variables",
"core/initialization", 
], function (
  UacanadaMap,  // This is uacanadamap/variables: Importing module to populate global UacanadaMap Obj with essential variables
  initialization, // Handles map initialization, loads dependencies, and augments the UacanadaMap with functions and listeners.
  // Built-in AMD modules:
  module 
  ) {


console.log('is ok')


UacanadaMap.needReinit = false
initialization(UacanadaMap)



  return UacanadaMap;
});
