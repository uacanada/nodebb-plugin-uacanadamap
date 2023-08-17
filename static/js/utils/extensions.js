'use strict';
define('utils/extensions', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

const extensions = (UacanadaMap) => {
    UacanadaMap.console = {
        log: (...args) => {
          if (app.user.isAdmin) {
            console.log(...args);
          }
        },
      };
  };
  module.exports = { extensions };
  
  return UacanadaMap;
})