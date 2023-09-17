'use strict';
define('events/mapReady',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    
    UacanadaMap.api.disablePropagationToMap = (className) => {
        const {L} = UacanadaMap
        const querySelector = className||'.no-propagation';
        const elements = document.querySelectorAll(querySelector);
        const events = ['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout', 'mousemove', 'contextmenu','touchstart'];
        elements.forEach(function(element) {
            L.DomEvent.disableClickPropagation(element);
            L.DomEvent.disableScrollPropagation(element);
        });
    };

    UacanadaMap.api.mapReLoad = async () => {
        
        UacanadaMap.api.updateCSS();
        UacanadaMap.api.fitElementsPosition();
        UacanadaMap.api.detectUrlParam();
        UacanadaMap.api.fancyHeroText.start();
        $('body').addClass('before-map-expand').removeClass('far-away-zoom hiddenElements addPlaceMode cards-opened bottomPanelOpened');
        $('#bottomPanelCategoryButtons').removeClass('shown')
        $('#scrollableBottomPanel').removeClass('panel-shown')
        UacanadaMap.isFullscreenMode = false;
        UacanadaMap.uaEventPartFormHTML = $("#ua-form-event-holder").html();
        $('#place-tag-input').tagsinput({  maxChars: 24, maxTags: 10, tagClass: "badge bg-info", confirmKeys: [13, 44], trimValue: true});
        
        UacanadaMap.setTimeout(() => {
               
                UacanadaMap.preventMultiCall = false; // TODO check 
                UacanadaMap.api.addAtrribution("#uacamap");
                
        }, 100);
        
        UacanadaMap.setTimeout(() => {
               UacanadaMap.api.disablePropagationToMap(null)
               const {map} = UacanadaMap

              
              if (UacanadaMap.firstInitTime < Date.now() - 2000) {
                    if (map && !window.location.search && $("body").hasClass(UacanadaMap.mapRoomClass)  ) { // TODO Check
                        // if back from topic page and zoom is too big - do zoom out
                        if (
                            map.getMaxZoom() === map.getZoom() ||
                            map.getMaxZoom() < map.getZoom() + 2
                        ) {
                            UacanadaMap.setTimeout(() => {
                                map.zoomOut(4);
                               
                            }, 500);
                        }
                    }

                    UacanadaMap.api.rotateCards("horizontal");
                    UacanadaMap.api.animateCards("close");
                    $('#ua-horizontal-buttons-wrapper').removeClass('movedown').removeClass('hidden')
                    $('#geocoderSearchbox').removeClass('show')

                    UacanadaMap.console.log(`Reload: ${UacanadaMap.firstInitTime}   Now: ${Date.now()}`)
               
                } else {

                    
                    UacanadaMap.console.log(`Start: ${UacanadaMap.firstInitTime}   Now: ${Date.now()}`)
                    
                }
            
        }, 1200);
        

            
    };
})