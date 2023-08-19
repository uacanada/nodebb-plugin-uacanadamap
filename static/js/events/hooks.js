'use strict';
    define('events/hooks',[ "core/initialization", "core/variables" /*   Global object UacanadaMap  */], function(initialization, UacanadaMap) { // TODO check initialization (must impact only once)

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



hooks.on('action:ajaxify.end', (data) => {

 
  
    if(data.tpl_url === 'map'){
        
         if( UacanadaMap.needReinit){
            console.log(` reinit `, event, data)
            
            
            if(app.user.isAdmin){
                console.log('ADMIN MODE ajaxify')
                initialization(UacanadaMap)
            }else{
               // initializeEnvironment(UacanadaMap);
               initialization(UacanadaMap)
            }


         } 


    }else{
        UacanadaMap.needReinit = true
        document.body.style.overflow = '';
        document.body.removeAttribute('data-bs-overflow');
    }

    UacanadaMap.console.log("~~~~~end to", data);
  });


}





})