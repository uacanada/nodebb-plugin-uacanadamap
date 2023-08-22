'use strict';
    define('events/hooks',["core/variables" /*   Global object UacanadaMap  */], function( UacanadaMap) {




UacanadaMap.api.registerHooks = async ()=> {

    
const hooks = await app.require("hooks");
hooks.on("action:ajaxify.start", function (data) {
  UacanadaMap.console.log("~~~~start from ", data);
   UacanadaMap.api.detectMapViewport();
});


hooks.on("action:ajaxify.coldLoad", function (data) {
  UacanadaMap.console.log("~~~~~ coldLoad", data);
});





}





})