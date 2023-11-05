

let tabRouteObject = {};

'use strict';
define('utils/methods', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) {

  const LOCATION_MARKER_OFFSET_X = 92;
  const LOCATION_MARKER_OFFSET_Y = 48;
  const ANIMATION_DURATION = 300;
  const FADE_OUT_DURATION = 200;
  
  UacanadaMap.api.locationSelection = {
    isVisible: false,  // Changed from 'visible' to 'isVisible' for clarity
    isAnimating: false,
  
    toggleVisibility: function(state) {
      this.isVisible = state;
    },
  
    addMarker: function() {
      if (this.isAnimating) return;
      if (this.isVisible) return this.cleanMarker();  // Exit if the marker is already visible
      this.toggleVisibility(true); 
      this.isAnimating = true;
      $('body').addClass('addPlaceMode')
      $('#geocoderSearchbox').addClass('show')
      $('#ua-horizontal-buttons-wrapper').addClass('hidden')

      if($('body').hasClass('cards-opened')){
        UacanadaMap.api.removeCards()
      }
     
      const mapContainer = $('#uacamap');
      const targetDiv = $('#targetForNewPlace');
      const wrapper =  $('#targetForNewPlaceWrapper');
      const mapCenter = {  x: mapContainer.width() / 2,  y: mapContainer.height() / 2  };
      const targetPosition = {  left: mapCenter.x - LOCATION_MARKER_OFFSET_X,  top: mapCenter.y - LOCATION_MARKER_OFFSET_Y  };
      wrapper.removeClass('d-none')
      $('#targetForNewPlace i.fa-compass').addClass('fa-spin')
      targetDiv.css({
        position: 'absolute',
        left: `${targetPosition.left}px`,
        top: '-300px',
        opacity: 0,
        'z-index': 1000
      });
      UacanadaMap.api.contextButtonText({text:'Drag map to refine spot',delay:ANIMATION_DURATION,to:UacanadaMap.contextButton.router.addplace})
     
      targetDiv.animate({
        left: `${targetPosition.left}px`,
        top: `${targetPosition.top}px`,
        opacity: 1
      }, ANIMATION_DURATION, () => {
        
        this.isAnimating = false; // Reset the state once animation is complete
      });
    },

  
    cleanMarker: function() {
      if (this.isAnimating) return; // Exit if an animation is already running
          this.isAnimating = true; // Set the state to indicate that an animation is in progress

      $('body').removeClass('addPlaceMode')
      $('#geocoderSearchbox').removeClass('show')
      $('#ua-horizontal-buttons-wrapper').removeClass('hidden')
      $('#targetForNewPlace i.fa-compass').removeClass('fa-spin')
      UacanadaMap.api.removeCards()
      UacanadaMap.api.contextButtonText({text:'',delay:0,to:UacanadaMap.contextButton.router.main})
      
      
  
      const targetDiv = $('#targetForNewPlace');
      const wrapper =  $('#targetForNewPlaceWrapper');
  
      targetDiv.animate({
        opacity: 0
      }, FADE_OUT_DURATION, () => {
       
        targetDiv.css({ left:0,top:0});
        wrapper.addClass('d-none')
        this.isAnimating = false;
      });

      if (!this.isVisible) return;  // Exit if the marker is already hidden
  
      this.toggleVisibility(false);

    },

    addPlace: function(){
      UacanadaMap.api.createMarkerAtLocation({latlng: UacanadaMap.map.getCenter()}, false); // cleanMarker also inside
    },
  

    showLatLng: function() {
      try {
        const {lat,lng} = UacanadaMap.map.getCenter();
        $('#locationSelectionLatLng').text(`${lat},${lng}`)
      } catch (error) {
        UacanadaMap.console.log(error)
      }
     
    },
  };
  
  

  // TODO REFACTOR
  UacanadaMap.api.mainFrameShow = (Y) => {
    const currentOpacity = $("#ua-mainframe").css("opacity");
    if (Y && currentOpacity !== "1") {
      $("#ua-mainframe").css("opacity", 1);
    }
    if (!Y && currentOpacity !== "0.2") {
      $("#ua-mainframe").css("opacity", 0.2);
    }
  };

  UacanadaMap.api.detectMapViewport = () => {
    const mapH = $("#uacamap").outerHeight();
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (mapH > 500) {
      if (scrollTop && scrollTop > Math.floor(mapH * 0.7)) {
        UacanadaMap.api.mainFrameShow(false);
      } else {
        UacanadaMap.api.mainFrameShow(true);
      }
    } else {
      UacanadaMap.api.mainFrameShow(true);
    }
  };

  UacanadaMap.api.smoothScroll = (target, duration) => {
    let start = window.scrollY;
    let distance = target - start;
    let startTime = null;

    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;
      let run = ease(timeElapsed, start, distance, duration);
      window.scrollTo(0, run);
      if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    // Ease function for smooth animation
    function ease(t, b, c, d) {
      t /= d / 2;
      if (t < 1) return (c / 2) * t * t + b;
      t--;
      return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
  };
  UacanadaMap.api.animateScroll = (offset, panel, duration) => {
    const currentScroll =
      document.documentElement.scrollTop || document.body.scrollTop || 0;

    console.log(offset, panel, duration);

    return new Promise((resolve, reject) => {
      if (!offset && !currentScroll) {
        resolve({ scrolled: 0 });
      } else {
        const el = panel || document.getElementById("ua-dragger");
        //  el.classList.remove('bounce-scroll');
        $("html, body").animate(
          { scrollTop: Math.min(Math.max(offset || 0, 0), 1e12) },
          duration || 300,
          "swing",
          () => {
            //   el.classList.add('bounce-scroll');
            // gestureDone = true;
            resolve({ scrolled: offset || 0 });
          }
        );
      }
    });
  };

  UacanadaMap.api.setCategory = (category) => {
    if (category) {
      $('#location-category-filter option[value="' + category + '"]').prop(
        "selected",
        true
      );
      $("#location-category-filter").val(category).addClass("filter-active");

      UacanadaMap.api.setButton(category, "active");

      if (UacanadaMap.showCtxButtonOnFilter)
        ctxButton({ show: true, reason: "resetCategory" });
    } else {
      $('#location-category-filter option[value=""]').prop("selected", true);
      $("#location-category-filter").removeClass("filter-active").val("");

      UacanadaMap.api.setButton(false);
      if (UacanadaMap.showCtxButtonOnFilter) ctxButton({ show: false });
    }
    UacanadaMap.api.shakeElements(
      ["#location-category-filter"],
      "accent-animation"
    );
  };

  

  UacanadaMap.api.tryLocate = ({ fornewplace }) => {
    const { map, L } = UacanadaMap;
    map
      .locate({ setView: true, maxZoom: 15 })
      .on("locationfound", function (ev) {
        if (fornewplace) createMarkerAtLocation(ev, false);
      })
      .on("locationerror", function (e) {
        map.setView(UacanadaMap.latestLocation.latlng, 12);
        if (UacanadaMap.currentmarker)
          map.removeLayer(UacanadaMap.currentmarker);
        UacanadaMap.currentmarker = L.marker(
          UacanadaMap.latestLocation.latlng,
          {
            icon: UacanadaMap.errorMarker,
          }
        )
          .addTo(map)
          .bindPopup(ajaxify.data.UacanadaMapSettings.locationSharingErrorAlert)
          .openPopup();

        UacanadaMap.api.showToast(
          "Location Required ",
          'You have not enabled geolocation, but <b>you can manage without it</b>, just move the map until you find the desired point. Make a long tap on the point <i class="fa-regular fa-hand-point-down"></i>',
          "location error"
        );

        UacanadaMap.api.shakeElements(
          [".leaflet-control-geocoder-icon", ".leaflet-control-locate"],
          "ua-shake-element"
        );
      });
  };

  UacanadaMap.api.addNewPlace = () => {
    UacanadaMap.api.expandMap(`addNewPlace`);
    UacanadaMap.api.removeCards();
    UacanadaMap.api.tryLocate({ fornewplace: true });
  };

  UacanadaMap.api.saveMyLocation = () => {
    if (UacanadaMap.userDeniedGeo) return;
    UacanadaMap.map
      .locate({ setView: true, maxZoom: 15 })
      .on("locationfound", function (e) {
        var { lat, lng } = e.latlng;
        localStorage.setItem("uamaplocation", JSON.stringify([lat, lng]));
      })
      .on("locationerror", function (e) {
        console.log("location error", e);
        //  $('.leaflet-control-locate').addClass('accent-animation')
        if (e.message.includes("User denied Geolocation")) {
          UacanadaMap.userDeniedGeo = true;
          //  showToast('You denied geolocation! ', 'We cannot find your location because you have blocked this option. Check your browser settings',  'location error');
        }
      });
  };







  UacanadaMap.api.createMarkerAtLocation = (event, fromAddress) => {
    const location = event.latlng;
    UacanadaMap.api.clearPreviousMarker();
    UacanadaMap.api.setNewMarker(location);
    UacanadaMap.api.updateLocationStorage(location);
    UacanadaMap.api.setViewToLocation(location);
    UacanadaMap.api.clearFormFields();
    UacanadaMap.api.updateLatLngText(location);
  
    if (UacanadaMap.userRegistered) {
      UacanadaMap.api.processRegisteredUser(location, fromAddress);
    } else {
      UacanadaMap.api.alertUnregisteredUser(location);
    }
  
    UacanadaMap.api.adjustMapUI();
  };
  
  UacanadaMap.api.clearPreviousMarker = () => {
    UacanadaMap.api.locationSelection.cleanMarker();
  };
  
  UacanadaMap.api.setNewMarker = (location) => {
    if (UacanadaMap.currentmarker) {
      UacanadaMap.currentmarker.bindPopup("Detecting address...").openPopup();
    }
  };
  
  UacanadaMap.api.updateLocationStorage = (location) => {
    const { lat, lng } = location;
    UacanadaMap.choosedLocation = [lat, lng];
    localStorage.setItem("uamaplocation", JSON.stringify(UacanadaMap.choosedLocation));
  };
  
  UacanadaMap.api.setViewToLocation = (location) => {
    UacanadaMap.map.setView(location, 14);
  };
  

  
  UacanadaMap.api.updateLatLngText = (location) => {
    const { lat, lng } = location;
    $("#ua-latlng-text").val(`${lat},${lng}`);
  };
  
  UacanadaMap.api.processRegisteredUser = (location, fromAddress) => {
    if (!fromAddress && UacanadaMap.isMapBoxKeyExist) {
      UacanadaMap.api.reverseGeocode(location);
    } else {
      const defaultAddress = UacanadaMap.api.getDefaultAddress(fromAddress);
      UacanadaMap.api.showPopupWithCreationSuggest(defaultAddress);
    }
  };
  
  UacanadaMap.api.getDefaultAddress = (fromAddress) => {
    return fromAddress || { properties: {
      address: "",
      text: "",
      neighborhood: "",
      place: "",
      postcode: "",
      district: "",
      region: "",
      country: "",
    }};
  };
  
  UacanadaMap.api.reverseGeocode = (location) => {
    UacanadaMap.hiddenControls.geocoder.options.geocoder.reverse(
      location,
      UacanadaMap.map.options.crs.scale(UacanadaMap.map.getZoom()),
      (results) => {
        UacanadaMap.api.showPopupWithCreationSuggest(results[0]);
      }
    );
  };
  
  UacanadaMap.api.alertUnregisteredUser = (location) => {
    UacanadaMap.currentmarker = UacanadaMap.L.marker(location, {
      icon: UacanadaMap.errorMarker,
    })
      .addTo(UacanadaMap.map)
      .bindPopup(ajaxify.data.UacanadaMapSettings.unregisteredUserAlert)
      .openPopup();
    window.location.assign(`${window.location.origin}/register`);
  };
  
  UacanadaMap.api.adjustMapUI = () => {
    UacanadaMap.api.hideBrandTitle(true);
    if (UacanadaMap.isFullscreenMode) {
      UacanadaMap.map.toggleFullscreen();
    }
  };
  







  UacanadaMap.api.showPopupWithCreationSuggest = (r) => {
    const { map } = UacanadaMap;
    let { lat, lng } = r.center || map.getCenter();
    let {
      address,
      text,
      neighborhood,
      place,
      postcode,
      district,
      region,
      country,
    } = r.properties;
    let popupHtml = "";
    if (country === "Canada") {
      var addressIcon = address ? "📮 " : "📍 ";
      var addressLine = r.name; // (address||'')+' '+text+', '+place+' '+postcode;
      var subAdress = (neighborhood || "") + " " + district + ", " + region;
       popupHtml = `<div class="p-1 d-flex flex-column align-items-start">
       <div class="ua-popup-codes">
         <code>${addressIcon}${addressLine}</code></br>
         <code>🗺️ ${subAdress}</code></br>
         <code>🧭 ${lat.toString().substring(0, 8)},${lng.toString().substring(0, 10)}</code>
       </div>
       <small>You can edit or remove the legal address for privacy in the next step.</small>
       <div class="d-flex mt-2">
         <button title="Confirm creating place here" type="button" class="btn btn-sm btn-primary me-2" data-bs-toggle="offcanvas" data-bs-target="#place-creator-offcanvas">Confirm</button>
       </div>
     </div>
     
    `;
    
    

      $("#uaMapAddress").val(addressLine);
      $("#subaddress").val(subAdress);
      if (place) $("#ua-newplace-city").val(place);

    if (region && UacanadaMap.provinceMapper[region])
        $('#location-province option[value="' + UacanadaMap.provinceMapper[region] +  '"' ).prop("selected", true); // TODO: refactor to more friendly aprocach
    } else {
      popupHtml = `
      <b>⁉️ Looks like the location you provided is not in Allowed region: </br>
      <code>${country} ${place} ${neighborhood} ${region}</code></br>
      Correct your choice on the map!</b></br>
    `; // TODO: Move To ACP
    }

    if (UacanadaMap.currentmarker) map.removeLayer(UacanadaMap.currentmarker);
    UacanadaMap.currentmarker = UacanadaMap.L.marker(r.center, {
      icon: UacanadaMap.newPlaceMarker,
    })
      .addTo(map)
      .bindPopup(popupHtml)
      .openPopup();
    UacanadaMap.api.removeCards();
  };

 

  UacanadaMap.api.setCategoryAndOpenCards = (category) => {
    UacanadaMap.api.rewriteTabsOnCatChange(category);
    UacanadaMap.api.openCards(null, null);
  };

  UacanadaMap.api.rewriteTabsOnCatChange = (category) => {
    $("#location-visible").removeClass("show-top-buttons");
    $("#location-category-filter").removeClass("show-top-buttons");

    UacanadaMap.api.setCategory(category);
    if (UacanadaMap.showOnlyArea) {
      UacanadaMap.api.rewriteTabs("onlyVisibleArea");
      // $('#location-visible').addClass('show-top-buttons')
      UacanadaMap.api.showToast(
        "Area filter",
        "In this mode you see a list of only those locations that are visible on the map",
        "Advisory"
      );
    } else {
      UacanadaMap.api.rewriteTabs("anyLocation");
      // $('#location-visible').removeClass('show-top-buttons')
    }
  };

  UacanadaMap.api.moveMarkerToTop = (c, markerOffset) => {
    const { map, showOnlyArea, L } = UacanadaMap;
    if (showOnlyArea) {
      return;
    }
    var latlng = c.lat ? c : { lat: c[0], lng: c[1] };
    map.setView(latlng, map.getZoom());
    var zoom = map.getZoom();
    var point = map.project(latlng, zoom);
    point.y = point.y + markerOffset;
    var newlatlng = map.unproject(point, zoom);
    map.panTo(new L.LatLng(newlatlng.lat, newlatlng.lng));
  };

  UacanadaMap.api.detectUrlParam = () => {
    const { map } = UacanadaMap;
    $("body").removeClass("post-with-map").removeClass("linked-location");
    var tid = location.search.split("place=")[1] || "";
    if (UacanadaMap.adminsUID)
      

    if (
      map &&
      tid &&
      Number(tid) > 1 &&
      UacanadaMap.allPlaces[tid] &&
      UacanadaMap.allPlaces[tid].gps &&
      UacanadaMap.allPlaces[tid].marker
    ) {
      UacanadaMap.api.expandMap(`detectUrlParam`);
      UacanadaMap.api.animateScroll();
      UacanadaMap.setTimeout(() => {
        var maxZoom = 14;
        map.setView(UacanadaMap.allPlaces[tid].gps, maxZoom);
        $("body").addClass("linked-location");
        UacanadaMap.lastPlaceMarker =
          UacanadaMap.allPlaces[tid].marker.openPopup();
        UacanadaMap.api.openCards(Number(tid), "distance");
      }, 300);
    } else if (
      !tid &&
      map &&
      UacanadaMap.api.isMainPage() &&
      !$("#ua-cards-slider-list")[0]
    ) {
      return; // openCards(null,'latest');
    } else {
      return false;
    }
  };

  UacanadaMap.api.reloadMainPage = () => {
    // TODO need refactoring

    if (!UacanadaMap.preventMultiCall && UacanadaMap.api.isMainPage()) {
      window.location.reload(true);
      location.reload(true);
    }
  };

  
  /**
 * Returns the profile image URL based on the provided place object.
 * Falls back to a default marker image if neither placethumb nor pic is provided.
 *
 * @param {Object} place - Place object containing potential image URLs.
 * @returns {string} - URL of the profile image.
 */
  UacanadaMap.api.getProfileImage = (place) => {
		const placethumb = place.placethumb || '';
		const pic = place.pic || '';
		const baseIcon = placethumb || pic;
		
		// Check if baseIcon is a non-empty string before proceeding
		if (!baseIcon) {
			return '/assets/plugins/nodebb-plugin-uacanadamap/icons/placeMarker.png';
		}

		const profileIcon = baseIcon.includes('/assets/uploads') ? baseIcon : `/assets/uploads/${baseIcon}`;
		return profileIcon;
	}


  UacanadaMap.setTimeout = function(callback, delay) {
    let start = null;
  
    function animate(timestamp) {
      if (!start) start = timestamp;
  
      const elapsed = timestamp - start;
  
      if (elapsed >= delay) {
        callback();
      } else {
        requestAnimationFrame(animate);
      }
    }
  
    requestAnimationFrame(animate);
  };


 
  return UacanadaMap;
})
