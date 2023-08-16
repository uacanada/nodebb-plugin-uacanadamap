'use strict';
    define('events/hooks',['../uacanadamap'], function(UacanadaMap) { 

const firstInitTime = Date.now();


async function registerEvents(){

    
const hooks = await app.require("hooks");
hooks.on("action:ajaxify.start", function (data) {
  if (UacanadaMap.adminsUID) console.log("~~~~start from ", data);
   UacanadaMap.api.detectMapViewport();
});


hooks.on("action:ajaxify.coldLoad", function (data) {
  console.log("~~~~~ coldLoad", data);
});



hooks.on('action:ajaxify.end', (event, data) => {

    const initAge = event.timeStamp - firstInitTime

    UacanadaMap.console.log(`${initAge}ms`,{firstInitTime, eventTimestamp: event.timeStamp})
    if(data.tpl_url === 'map'){
        
         if(initAge>1e3 || UacanadaMap.needReinit){
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

    UacanadaMap.console.log("~~~~~end to", data.tpl_url);
  });


}


registerEvents()


})