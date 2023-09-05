'use strict';
define('events/mapReady',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    UacanadaMap.api.disablePropagationToMap = (L,className) => {
        const querySelector = className||'.no-propagation';
        const elements = document.querySelectorAll(querySelector);
        const events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'contextmenu','touchstart'];
        elements.forEach(function(element) {
            L.DomEvent.disableClickPropagation(element);
            L.DomEvent.disableScrollPropagation(element);
        });
    };

    UacanadaMap.api.mapReLoad = async (mapLoadCount) => {
        
        UacanadaMap.api.updateCSS();
        UacanadaMap.api.fitElementsPosition();
        UacanadaMap.api.detectUrlParam();
        UacanadaMap.api.fancyHeroText.start();
        $('body').addClass('before-map-expand').removeClass('addPlaceMode')
        UacanadaMap.isFullscreenMode = false;
        UacanadaMap.uaEventPartFormHTML = $("#ua-form-event-holder").html();
        $('#place-tag-input').tagsinput({  maxChars: 24, maxTags: 10, tagClass: "badge bg-info", confirmKeys: [13, 44], trimValue: true});
        
        setTimeout(() => {
               
                UacanadaMap.preventMultiCall = false; // TODO check 
                UacanadaMap.api.listenSwipes(UacanadaMap.swipeZones);
                UacanadaMap.api.addAtrribution("#uacamap");
                
        }, 100);
        
        setTimeout(() => {
               UacanadaMap.api.disablePropagationToMap(UacanadaMap.L,null)
              
              if (mapLoadCount > 1) {
                    if (UacanadaMap.map && !window.location.search && $("body").hasClass(UacanadaMap.mapRoomClass)  ) { // TODO Check
                        // if back from topic page and zoom is too big - do zoom out
                        if (
                            UacanadaMap.map.getMaxZoom() === map.getZoom() ||
                            UacanadaMap.map.getMaxZoom() < map.getZoom() + 2
                        ) {
                            setTimeout(() => {
                                UacanadaMap.map.zoomOut(4);
                               
                            }, 500);
                        }
                    }
               
                } else {
                   
                }
            
        }, 1200);
        

            
    };
})