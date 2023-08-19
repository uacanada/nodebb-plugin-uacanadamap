'use strict';
    define('events/hooks',["core/variables" /*   Global object UacanadaMap  */], function( UacanadaMap) {

const firstInitTime = Date.now();


UacanadaMap.api.registerHooks = async ()=> {

    
const hooks = await app.require("hooks");
hooks.on("action:ajaxify.start", function (data) {
  if (UacanadaMap.adminsUID) console.log("~~~~start from ", data);
   UacanadaMap.api.detectMapViewport();
});


hooks.on("action:ajaxify.coldLoad", function (data) {
  console.log("~~~~~ coldLoad", data);
});





}





})