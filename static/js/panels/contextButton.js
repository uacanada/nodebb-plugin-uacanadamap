
'use strict';
define('panels/contextButton',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    UacanadaMap.api.contextButtonText = ({text,delay,to}) => {
          
        $('#text-info-button').text(text) 
        
        UacanadaMap.swipers.contextButton.slideTo(UacanadaMap.contextButton.router.text)
         setTimeout(() => {
          
                 UacanadaMap.swipers.contextButton.slideTo(to)
                
             // TODO PREVENT IF CHNAGED
             
         }, delay);

     }
   
})