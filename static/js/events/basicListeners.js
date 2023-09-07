
  
  let clustersForReset = []
  
  'use strict';
  define('events/basicListeners', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
   
    UacanadaMap.api.registerBasicListeners = () => {
       const { L } = UacanadaMap;
      //  UacanadaMap.mapLayers.markers.on('spiderfied', function (a) { // TODO revise
      //   clustersForReset.push(a.cluster)
      // });
    
      UacanadaMap.map.on("zoomend.uacanadamap", () => {
        const level = UacanadaMap.map.getZoom();
        UacanadaMap.api.setClassWithFarawayZoom(level);
       
        //if(level>16)  UacanadaMap.mapLayers.markers.spiderfy()
        
      });
      
      UacanadaMap.map.on("enterFullscreen.uacanadamap", () => {
        
        UacanadaMap.placeCardElement = $(UacanadaMap.placeCardDivFullScreen);
        UacanadaMap.isFullscreenMode = true;
      });
      
      UacanadaMap.map.on("exitFullscreen.uacanadamap", () => {
        
        UacanadaMap.placeCardElement = $(UacanadaMap.placeCardDiv);
        UacanadaMap.isFullscreenMode = false;
      
      });
      
      UacanadaMap.map.on("contextmenu.uacanadamap", (e) => {
       
        if (UacanadaMap.currentmarker) {
          UacanadaMap.map.removeLayer(UacanadaMap.currentmarker);
        }
        const pinMarkerIcon = L.divIcon({
          className: "ua-pin-icon",
          html: '<div class="position-relative"><span class="ua-bounce-animated-pin">📍</span></div>',
          iconSize: [25, 25],
          iconAnchor: [15, 30],
          popupAnchor: [5, -5],
        });
        UacanadaMap.currentmarker = L.marker(e.latlng, { icon: pinMarkerIcon }).addTo(UacanadaMap.map);
      });
      
      
    
    
      UacanadaMap.map.on("movestart.uacanadamap", () => {
        UacanadaMap.moveIterations = 1;
        
      });
      
      UacanadaMap.map.on("move.uacanadamap", () => {
        UacanadaMap.moveIterations++;
        if (UacanadaMap.moveIterations > 21) {
          UacanadaMap.api.hideElements(true)
         // UacanadaMap.api.expandMap();
        }
      });
      
      UacanadaMap.map.on("moveend.uacanadamap", () => {
        UacanadaMap.moveIterations++;
        UacanadaMap.api.hideElements(false)
      
        if(UacanadaMap.api.locationSelection.isVisible){
          UacanadaMap.api.locationSelection.showLatLng()
        }
       
      });
      
    
      UacanadaMap.hiddenControls.geocoder.on("markgeocode.uacanadamap", function (e) {
        let { lat, lng } = e.geocode.center;
        let loc = { latlng: { lat, lng } };
        UacanadaMap.api.createMarkerButton(loc, e.geocode);
      });



    
    



      
            
   

    }



  
   
  UacanadaMap.api.unregisterBasicListeners = () => {

  }
    
  
   
   
  
  
   // Helpers:
  
  
   $.fn.classChange = function (cb) {
    return $(this).each((_, el) => {
      new MutationObserver((mutations) => {
        mutations.forEach(
          (mutation) =>
            cb &&
            cb(mutation.target, $(mutation.target).prop(mutation.attributeName))
        );
      }).observe(el, {
        attributes: true,
        attributeFilter: ["class"], 
      });
    });
  };
    
  
  const throttle = (type, name) => {
    let running = false;
    const func = () => {
      if (running) { return; }
      running = true;
      requestAnimationFrame(() => {
          window.dispatchEvent(new CustomEvent(name));
          running = false;
      });
    };
    window.addEventListener(type, func);
  }
  
  const onOptimizedScroll = () => {
    const minScrollInterval = 33;
    if (performance.now() - lastScrollTime < minScrollInterval) {
      return;
    }
  
    UacanadaMap.api.detectMapViewport();
    lastScrollTime = performance.now();
  
  }
  
  //throttle("scroll", "optimizedScroll"); // TODO change to NodeBB utils
  let lastScrollTime = 0;
  
  //window.addEventListener('optimizedScroll', onOptimizedScroll);
  
    return UacanadaMap
  })
  