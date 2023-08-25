

let tabRouteObject = {};

'use strict';
define('utils/methods', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) {

   UacanadaMap.api.locationSelection = {
    addMarker: () => {
      const { L, map } = UacanadaMap;
      UacanadaMap.api.locationSelection.cleanMarker();



      UacanadaMap.locationSelectionMarker= L.marker(map.getCenter(), { icon: L.divIcon({
        className: "ua-sekector-icon",
        html:  `<div class="ua-markers marker-selector d-flex align-items-center marker-container">
        <span id="locationSelectionLatLng"></span> 
        <button title="Add place here" class="btn btn-sm rounded-pill newlocation-create-button" type="button"><i class="fa fas fa-solid fa-check"></i> Create</button>
        <div class="circle-icon rounded-circle shadow d-flex align-items-center justify-content-center"><i class="'fa fa-fw fas fa-solid fa-compass fa-spin"></i></div>
        <button title="Add place here" class="btn rounded-pill newlocation-cancel-button" type="button"><i class="fa-solid fa-xmark"></i></button>  
      </div>
      `,
        iconSize: [150, 50],
        iconAnchor: [-89, -47],
        popupAnchor: [0, 0],
       })}).addTo(map);




      map.on('move', () => {
        UacanadaMap.locationSelectionMarker.setLatLng(map.getCenter());
      });
    },
  
    getMarker: () => {
      const { locationSelectionMarker } = UacanadaMap;
      if (!locationSelectionMarker) return;
      const coordinates = locationSelectionMarker.getLatLng();
      console.log(`Coordinates: Latitude: ${coordinates.lat}, Longitude: ${coordinates.lng}`);
    },
  
    cleanMarker: () => {
      const { map } = UacanadaMap;
      if (UacanadaMap.locationSelectionMarker) {
        map.removeLayer(UacanadaMap.locationSelectionMarker);
        UacanadaMap.locationSelectionMarker = null;
      }
    },
  };
  
// UacanadaMap.api.locationSelection.cleanMarker()
// UacanadaMap.api.locationSelection.getMarker()
// UacanadaMap.api.locationSelection.addMarker()
  

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
        if (fornewplace) createMarkerButton(ev, false);
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

  UacanadaMap.api.createMarkerButton = (e, fromAddress) => {
    if (UacanadaMap.currentmarker) {
      UacanadaMap.currentmarker.bindPopup("Detecting address... ").openPopup();
    }
    const { map, L } = UacanadaMap;

    var { lat, lng } = e.latlng;
    UacanadaMap.choosedLocation = [lat, lng];
    localStorage.setItem(
      "uamaplocation",
      JSON.stringify(UacanadaMap.choosedLocation)
    );
    map.setView(e.latlng, 14);

    UacanadaMap.api.clearFormFields();
    $("#ua-latlng-text").val(lat + "," + lng);
    if (UacanadaMap.userRegistered) {
      if (!fromAddress)
        UacanadaMap.hiddenControls.geocoder.options.geocoder.reverse(
          e.latlng,
          map.options.crs.scale(map.getZoom()),
          function (results) {
            UacanadaMap.api.showPopupWithCreationSuggest(results[0]);
          }
        );
      else UacanadaMap.api.showPopupWithCreationSuggest(fromAddress);
    } else {
      UacanadaMap.currentmarker = L.marker(e.latlng, {
        icon: UacanadaMap.errorMarker,
      })
        .addTo(map)
        .bindPopup(ajaxify.data.UacanadaMapSettings.unregisteredUserAlert)
        .openPopup();
      window.location.assign(window.location.origin + "/register");
    }

    UacanadaMap.api.hideBrandTitle(true);
    if (UacanadaMap.isFullscreenMode) map.toggleFullscreen();
  };

  UacanadaMap.api.showPopupWithCreationSuggest = (r) => {
    const { map } = UacanadaMap;
    var { lat, lng } = r.center;
    var {
      address,
      text,
      neighborhood,
      place,
      postcode,
      district,
      region,
      country,
    } = r.properties;
    var popupHtml = "";
    if (country === "Canada") {
      var addressIcon = address ? "📮 " : "📍 ";
      var addressLine = r.name; // (address||'')+' '+text+', '+place+' '+postcode;
      var subAdress = (neighborhood || "") + " " + district + ", " + region;
      popupHtml =
        '<div class="ua-popup-codes mt-3">' +
        "<code>" +
        addressIcon +
        addressLine +
        "</code></br>" +
        "<code>🗺️ " +
        subAdress +
        "</code></br>" +
        "<code>🧭 " +
        lat.toString().substring(0, 8) +
        "," +
        lng.toString().substring(0, 10) +
        "</code>" +
        "</div>" +
        '<p style="font-size:0.75rem">To create a location at different coordinates: move the map to the desired location and make a long tap or right-click. If you know the exact address, use the search box and enter the address directly there!</p> ' +
        '<button id="uaAddNewLoc" type="button" class="btn btn-link" data-bs-toggle="offcanvas" data-bs-target="#place-creator-offcanvas">Yes, here!</button>';

      $("#uaMapAddress").val(addressLine);
      $("#subaddress").val(subAdress);
      if (place) $("#ua-newplace-city").val(place);

      if (region && UacanadaMap.provinceMapper[region])
        $(
          '#location-province option[value="' +
            UacanadaMap.provinceMapper[region] +
            '"'
        ).prop("selected", true);
    } else {
      popupHtml =
        "<b>⁉️ Looks like the location you provided is not in Canada: </br><code>" +
        country +
        " " +
        place +
        " " +
        neighborhood +
        " " +
        region +
        "</code></br>Correct your choice on the map!</b></br>It must be a Canadian place";
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

  UacanadaMap.api.showOnMapOnlyChoosen = ({ category }) => {
    try {
      const mrks = UacanadaMap.mapLayers.markers.getLayers();
      UacanadaMap.mapLayers.markers.removeLayers(mrks);
      UacanadaMap.api.cleanMarkers();
    } catch (error) {
      if (adminsUID) console.log(error);
    }

    for (const m of UacanadaMap.allPlacesArray) {
      try {
        UacanadaMap.mapLayers.markers.addLayer(
          UacanadaMap.allPlaces[m.tid].marker
        );
      } catch (error) {
        if (adminsUID) console.log(`mapLayers.markers.addLayer error: `, error);
      }
    }

    UacanadaMap.mapLayers.markers.addTo(UacanadaMap.map);
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
      console.log(`Marker not move cause showOnlyArea=true`);
      // TODO
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
      console.log("detectUrlParam() :: ", location.search);

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
      setTimeout(() => {
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


 
  return UacanadaMap;
})
