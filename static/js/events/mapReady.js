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


    UacanadaMap.api.afterMapReloadFirstTime = () => {
        UacanadaMap.console.log(`Start: ${UacanadaMap.firstInitTime}   Now: ${Date.now()}`)

    }

    UacanadaMap.api.afterMapReloadNotFirstTime = () => {
        UacanadaMap.console.log(`Reload: ${UacanadaMap.firstInitTime}   Now: ${Date.now()}`)
        const {map} = UacanadaMap
        
        if (map && !window.location.search && $("body").hasClass(UacanadaMap.mapRoomClass)  ) { // TODO Check
            // if back from topic page and zoom is too big - do zoom out
            if (map.getMaxZoom() === map.getZoom() ||  map.getMaxZoom() < map.getZoom() + 2) {
                map.zoomOut(4);
            }
        }

        UacanadaMap.api.disablePropagationToMap(null)
        UacanadaMap.api.rotateCards("horizontal");
        UacanadaMap.api.animateCards("close");
        UacanadaMap.api.addAtrribution("#uacamap"); 

        $('#ua-horizontal-buttons-wrapper').removeClass('movedown hidden')
        $('#geocoderSearchbox').removeClass('show')

        UacanadaMap.uaEventPartFormHTML = $("#ua-form-event-holder").html(); // TODO: move to fragments
        $('#place-tag-input').tagsinput({  maxChars: 24, maxTags: 10, tagClass: "badge bg-info", confirmKeys: [13, 44], trimValue: true}); // INIT later
        

        
    }


    UacanadaMap.api.mapReLoad = async () => {
        
        UacanadaMap.api.updateCSS();
        UacanadaMap.api.fitElementsPosition();
        UacanadaMap.api.detectUrlParam();
        UacanadaMap.api.fancyHeroText.start();
        $('body').addClass('before-map-expand').removeClass('far-away-zoom hiddenElements addPlaceMode cards-opened bottomPanelOpened');
        $('#bottomButtonsWrapper').removeClass('shown')
        $('#scrollableBottomPanel').removeClass('panel-shown')
        UacanadaMap.isFullscreenMode = false;
        
        UacanadaMap.setTimeout(() => {
          if (UacanadaMap.firstInitTime < Date.now() - 1000) {
            UacanadaMap.api.afterMapReloadNotFirstTime();
          } else {
            UacanadaMap.api.afterMapReloadFirstTime();
          }
        }, 1000);
        

            
    };
})