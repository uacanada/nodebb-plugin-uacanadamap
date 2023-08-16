'use strict';
define('utils/expandMap',['../uacanadamap'], function(UacanadaMap) { 
 
    const { map } = UacanadaMap;
   
   
   
   
   
   
   
    UacanadaMap.api.expandMap = async (id) => {
      console.log(`  UacanadaMap.api.expandMap id ${id}`)
      
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
       
        map.scrollWheelZoom.enable();
        
        
        $('body').addClass('map-touched');
        
       
       
        await new Promise((resolve) => setTimeout(resolve, 1000)); 
    
        UacanadaMap.api.fitElementsPosition();
    
        if ($(window).innerWidth() > 2100 && !$('body').hasClass('linked-location')) {
          UacanadaMap.api.openMapSidebar(1);
        }
    
      
        UacanadaMap.api.disablePropagationToMap(UacanadaMap.L)
  
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
  
  