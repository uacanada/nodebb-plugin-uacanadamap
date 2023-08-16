'use strict';
define('events/mapReady',['core/uacanadamap'], function(UacanadaMap) { 
    const { map } = UacanadaMap;
    UacanadaMap.isFullscreenMode = false;
    UacanadaMap.uaEventPartFormHTML = $("#ua-form-event-holder").html();
    $('#place-tag-input').tagsinput({  maxChars: 24, maxTags: 10, tagClass: "badge bg-info", confirmKeys: [13, 44], trimValue: true});
  
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
        //UacanadaMap.api.adjustCenterToSomePlace()
        UacanadaMap.api.fancyHeroText.start();
        $('body').addClass('before-map-expand')

        setTimeout(() => {
                $("main#panel").addClass("ua-map-loaded");
                UacanadaMap.preventMultiCall = false; // TODO check 
                UacanadaMap.api.listenSwipes(UacanadaMap.swipeZones);
                UacanadaMap.api.addAtrribution("#uacamap");
                
        }, 100);
        
        setTimeout(() => {
                $("#mapStatusLine").addClass("show");
              
              if (mapLoadCount > 1) {
                
                    UacanadaMap.api.disablePropagationToMap(UacanadaMap.L)
                    
                    if (UacanadaMap.map && !window.location.search && $("body").hasClass(UacanadaMap.mapRoomClass)  ) { // TODO Check
                        // if back from topic page and zoom is too big - do zoom out
                        if (
                            UacanadaMap.map.getMaxZoom() === map.getZoom() ||
                            UacanadaMap.map.getMaxZoom() < map.getZoom() + 2
                        ) {
                            setTimeout(() => {
                                UacanadaMap.map.zoomOut(4);
                                console.log(` map.zoomOut(4)`);
                            }, 1000);
                        }
                    }
               
                } else {
                    UacanadaMap.api.shakeElements(["#pull-out-button .line-button"],'ua-shake-vert');
                }
            
        }, 1200);
        

        $("body").addClass("ua-markers-loaded")      
    };
    
    UacanadaMap.api.refreshMap = (x) => {
        UacanadaMap.countx++;
        // UacanadaMap.preventMultiCall = true; TODO
        if (!$("#ua-home-button").html())  $('<div id="ua-home-button" class="w-100 m-0 p-2"><a href="/" role="button" class="ua-reload-link position-relative"> <i class="fa-solid fa-house-chimney ms-2"></i> </a></div>' ).insertAfter(".bottombar-nav>div:first-child");
    };
    


})