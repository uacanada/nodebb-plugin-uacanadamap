
'use strict';
define('panels/magicButton',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    UacanadaMap.api.magicButtonText = ({text,delay,to}) => {
          
        $('#text-info-button').text(text) 
        
        UacanadaMap.swipers.magicButton.slideTo(UacanadaMap.magicButton.router.text)
         setTimeout(() => {
          
                 UacanadaMap.swipers.magicButton.slideTo(to)
                
             // TODO PREVENT IF CHNAGED
             
         }, delay);

     }
   
})