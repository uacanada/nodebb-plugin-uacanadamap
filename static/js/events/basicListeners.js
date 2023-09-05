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
  
  let clustersForReset = []
  
  'use strict';
  define('events/basicListeners', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
   
   
  

    UacanadaMap.api.registerBasicListeners = () => {
       const { L } = UacanadaMap;
       UacanadaMap.mapLayers.markers.on('spiderfied', function (a) {
        clustersForReset.push(a.cluster)
      });
    
      UacanadaMap.map.on("zoomend", () => {
        const level = UacanadaMap.map.getZoom();
        UacanadaMap.api.setClassWithFarawayZoom(level);
       
        //if(level>16)  UacanadaMap.mapLayers.markers.spiderfy()
        
      });
      
      UacanadaMap.map.on("enterFullscreen", () => {
        
        UacanadaMap.placeCardElement = $(UacanadaMap.placeCardDivFullScreen);
        UacanadaMap.isFullscreenMode = true;
      });
      
      UacanadaMap.map.on("exitFullscreen", () => {
        
        UacanadaMap.placeCardElement = $(UacanadaMap.placeCardDiv);
        UacanadaMap.isFullscreenMode = false;
      
      });
      
      UacanadaMap.map.on("contextmenu", (e) => {
       
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
      
      
    
    
      UacanadaMap.map.on("movestart", () => {
        UacanadaMap.moveIterations = 1;
        
      });
      
      UacanadaMap.map.on("move", () => {
        UacanadaMap.moveIterations++;
        if (UacanadaMap.moveIterations > 21) {
          UacanadaMap.api.hideElements(true)
         // UacanadaMap.api.expandMap();
        }
      });
      
      UacanadaMap.map.on("moveend", () => {
        UacanadaMap.moveIterations++;
        UacanadaMap.api.hideElements(false)
      
        if(UacanadaMap.api.locationSelection.isVisible){
          UacanadaMap.api.locationSelection.showLatLng()
        }
       
      });
      
    
      UacanadaMap.hiddenControls.geocoder.on("markgeocode", function (e) {
        let { lat, lng } = e.geocode.center;
        let loc = { latlng: { lat, lng } };
        UacanadaMap.api.createMarkerButton(loc, e.geocode);
      });
    
      function resizeend() {
        if (new Date() - UacanadaMap.uaResizetime < UacanadaMap.uaDelta) {
          setTimeout(resizeend, UacanadaMap.uaDelta);
        } else {
          UacanadaMap.uaResizetimeout = false;
          UacanadaMap.api.updateCSS();
        }
      }
    
      $(window).resize(function () {
        if (UacanadaMap.map) {
          UacanadaMap.api.detectMapViewport();
          UacanadaMap.uaResizetime = new Date();
          if (UacanadaMap.uaResizetimeout === false) {
            UacanadaMap.uaResizetimeout = true;
            setTimeout(resizeend, UacanadaMap.uaDelta);
          }
        }
      });
    
      $("body").classChange((el, classes) => {
        if ($("body").hasClass(UacanadaMap.mapRoomClass)) {
          UacanadaMap.api.detectMapViewport();
        }
      });
    
      $(document).on("change", "#eventSwitcher", function () {
        if ($(this).is(":checked")) {
          $("#ua-form-event-holder").html(UacanadaMap.uaEventPartFormHTML);
        } else {
          $("#ua-form-event-holder").html("");
        }
      });
      $(document).on("change", 'input[name="socialtype"]', function () {
        // var ico = $(this).next().find("i");
        // var icoFaClasses = ico.attr("class");
        // var icoStyle = ico.attr("style");
        // if (icoFaClasses)
        //   $("#socialtype-ico").attr("class", icoFaClasses).attr("style", icoStyle);
        // else $("#socialtype-ico").attr("class", "fa-solid fa-at");
        UacanadaMap.form.socialTypeIconAdjust()
      });
      $(document).on("change", "#ua-location-cover-img", function () {
        var fileReader = new FileReader();
        fileReader.onload = function () {
          var data = fileReader.result;
          $("#ua-form-img-holder").html('<img src="' + data + '"/>');
        };
        fileReader.readAsDataURL($("input#ua-location-cover-img")[0].files[0]);
      });
      $(document).on("change", "#location-category-filter", function () {
        UacanadaMap.api.setCategoryAndOpenCards($(this).val());
      });
      $(document).on("change", "#location-sort", function () {
        UacanadaMap.api.setCategoryAndOpenCards($("#location-category-filter").val());
      });




      $('#sortPlacesOffcanvas').on('hide.bs.offcanvas', function (e) {
        $('#ua-horizontal-buttons-wrapper').removeClass('movedown')
      });
      $('#sortPlacesOffcanvas').on('show.bs.offcanvas', function (e) {
        $('#ua-horizontal-buttons-wrapper').addClass('movedown').removeClass('hidden')
      });



      
            
   

    }
  
   
  
    
  
   
   
  
  
  
  
  
  
    
  
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
  
  throttle("scroll", "optimizedScroll"); // TODO change to NodeBB utils
  let lastScrollTime = 0;
  
  window.addEventListener('optimizedScroll', onOptimizedScroll);
  
    return UacanadaMap
  })
  