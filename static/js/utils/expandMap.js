'use strict';
define('utils/expandMap',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
 
      UacanadaMap.api.expandMap = async (id) => {
        //UacanadaMap.console.log(`  UacanadaMap.api.expandMap id ${id}`)
      
      //UacanadaMap.api.markerIterator.stop();
      UacanadaMap.api.fancyHeroText.stop();
    
     
      $('body').removeClass('before-map-expand')
  
      if ($('body').hasClass('map-touched')) {
        return false;
      } else {
  
       // const scrollOffset = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        // if (scrollOffset > 1) {
        //   UacanadaMap.api.animateScroll(0, document.getElementById('ua-dragger'), 400);
        // }
  
        UacanadaMap.mapExpanded = true;
        UacanadaMap.api.hideBrandTitle(true);
       
        UacanadaMap.map.scrollWheelZoom?.enable();
        
        
        $('body').addClass('map-touched');
        
       
       
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
    
        UacanadaMap.api.fitElementsPosition();
    
        if ($(window).innerWidth() > 2100 && !$('body').hasClass('linked-location')) {
         // TODO: removed old sidebar
        }
    
      
        UacanadaMap.api.disablePropagationToMap(null)
  
        setTimeout(() => {
          UacanadaMap.api.updateCSS();
          $('#mapHero').remove()
  
  
          UacanadaMap.api.populateAdvMarkers()
  
        }, 1000);
  
  
        return true;
      }
    };
  
  
  
    return UacanadaMap
  })
  
  