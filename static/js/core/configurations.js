'use strict';
define('uacanadamap/configuration', [  'leaflet', 'swiper/bundle','uacanadamap/variables'], function(require, L,Swiper,UacanadaMap) { 
    
    require('leaflet-fullscreen');
    require('leaflet-control-geocoder');
    require('leaflet.markercluster');
    require('leaflet.locatecontrol');
    require('leaflet-contextmenu');
    require('leaflet-providers');

    const { data: { uacmp: settings } = {} } = ajaxify || {};

    if (!settings) {
      // TODO: show warning
      return;
    }
    
    const dateTime = new Date(Date.now());

   UacanadaMap.L = L
   UacanadaMap.Swiper = Swiper
  
    const { mapPageRouter, initialCoordinates, mapBoxApiKey, countryLimit } =
      settings;
  
    
    UacanadaMap.timestampNow = Math.floor(dateTime / 1000);
    UacanadaMap.weekDay = UacanadaMap.weekdays[dateTime.getDay()];
    UacanadaMap.userRegistered = app.user.uid && app.user.uid > 0;
    UacanadaMap.adminsUID = app.user.isAdmin;
    UacanadaMap.DEFAULT_ZOOM = 11; // TODO get from settings
  
    UacanadaMap.markerSettings = {
      virtZoom: 16,
      shiftX: 100,
      shiftY: 100,
      lngDistanceTtrigger: 110,
      latDistanceTtrigger: 45,
    };
  
    UacanadaMap.magicButton = {
      router: {
        text: 3,
        main: 0,
        cards: 1,
      },
    };
  
    const generateRoute = (endpoint) =>
      `/api/v3/plugins${mapPageRouter}${endpoint}`;
  
    UacanadaMap.routers = {
      mapPage: mapPageRouter,
      addplace: generateRoute("/addplace"),
      getplace: generateRoute("/getplace"),
      getplaces: generateRoute("/getplaces"),
    };
  
    UacanadaMap.defaultLatLng = initialCoordinates
      ? initialCoordinates.split(",").map(Number)
      : [49.28269013417919, -123.12086105346681]; // Fallback
  
    UacanadaMap.geocoderOptions = {
      apiKey: mapBoxApiKey,
      ...(countryLimit && { geocodingQueryParams: { country: countryLimit } }),
    };





    const MAP_SETTINGS = {
        zoomSnap: 0.15,
        wheelDebounceTime: 120,
        wheelPxPerZoomLevel: 200,
        attributionControl: true,
        zoom: UacanadaMap.DEFAULT_ZOOM,
        maxBounds: UacanadaMap.bounds,
        tap: false,
        minZoom: 3,
        zoomControl: false,
        contextmenu: true,
        contextmenuWidth: 330,
        contextmenuItems: [
            {
                text: '<div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden">Loading...</span></div> Create new place here?</br><button type="button" class="btn btn btn-link p-2">Yes</button>',
                callback: handleContextMenuClick,
            },
        ],
        center: UacanadaMap.latestLocation.latlng,
    };

  
    
    function handleContextMenuClick(e) {
        try {
            const { lat, lng } = getLatLng(e);
    
            if (!lat || !lng) {
                return alert('Location error');
            }
    
            $("#ua-form-event-holder").html(UacanadaMap.recoveredOldButtons);
            $("#ua-latlng-text").val(`${lat},${lng}`);
    
            UacanadaMap.api.expandMap(`contextmenuItems`);
            UacanadaMap.api.createMarkerButton(e, false);
            UacanadaMap.api.hideBrandTitle(true);
    
            
        } catch (error) {
            console.log(error);
        }
    }
    
    function getLatLng(e) {
        const lat = e.latlng?.lat || e.latlng[0];
        const lng = e.latlng?.lng || e.latlng[1];
    
        return { lat, lng };
    }


    function addMapLayer(layer) {
        try {
            layer.addTo(UacanadaMap.map);
        } catch (error) {
            console.log(error)
        }
        
    }
    
    function handleControlAddition(layer) {
        try {
            $("#map-controls .offcanvas-body").append(layer.onAdd(UacanadaMap.map))
        } catch (error) {
            handleControlError(layer, error);
        }
    }
    
    function handleControlError(layer, error) {
        layer.addTo(UacanadaMap.map);
        const controlDiv = layer.getContainer();
        const controlDivCopy = controlDiv.cloneNode(true);
    
        $("#map-controls .offcanvas-body").append(controlDivCopy);
        console.log(error, layer, controlDiv);
    }





    
    UacanadaMap.api.configureMapElements = () => {

        
       


        UacanadaMap.BlackWhite = L.tileLayer.provider("Stamen.TonerLite");
        UacanadaMap.Terrain = L.tileLayer.provider("Stamen.Terrain");
        UacanadaMap.MinimalMap = L.tileLayer.provider("Esri.WorldGrayCanvas");
        UacanadaMap.SatMap = L.tileLayer.provider("Esri.WorldImagery");
        UacanadaMap.Classic = L.tileLayer.provider("Esri.NatGeoWorldMap");
        UacanadaMap.StreetsMap = L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            { maxZoom: 19 }
        );
       
        UacanadaMap.mapLayers.MapBox = UacanadaMap.settings.mapBoxApiKey?.length > 30 ? L.tileLayer.provider("MapBox", {
            id: "mapbox/streets-v11",
            accessToken:UacanadaMap.settings.mapBoxApiKey,
        }):UacanadaMap.StreetsMap;

        UacanadaMap.mapProviders = {
            MapBox: UacanadaMap.mapLayers.MapBox,
            OSM: UacanadaMap.StreetsMap,
            Minimal: UacanadaMap.MinimalMap,
            BlackWhite: UacanadaMap.BlackWhite,
            Terrain: UacanadaMap.Terrain,
            Satellite: UacanadaMap.SatMap,
            Classic: UacanadaMap.Classic,
        };


        UacanadaMap.icon = L.icon({
            iconUrl: "/static_uaca/uamarker.png",
            shadowUrl: "/static_uaca/uamarkersh.png", // TODO remove to defaults
            iconSize: [30, 30],
            shadowSize: [30, 30],
            iconAnchor: [2, 30],
            shadowAnchor: [6, 30],
            popupAnchor: [20, -31],
        });
        UacanadaMap.westCoast = L.latLng(70, -150); // TODO fetch from settings
        UacanadaMap.eastCoast = L.latLng(15, -45);
        UacanadaMap.bounds = L.latLngBounds(L.latLng(70, -150), L.latLng(15, -45));
       
        UacanadaMap.newPlaceMarker = L.divIcon({
            className: "ua-locate-me-marker",
            html: '<div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden">Loading...</span> </div>', // TODO move to settings
            iconSize: [28, 28],
            iconAnchor: [6, 14],
            popupAnchor: [8, -3],
        });
        UacanadaMap.errorMarker = L.divIcon({
            className: "ua-pin-icon",
            html: '<div class="position-relative"><span class="ua-bounce-animated-pin">⛔️</span></div>',  // TODO move to settings
            iconSize: [20, 20],
            iconAnchor: [10, 0],
            popupAnchor: [5, 5],
        });
        UacanadaMap.mapLayers.markers = L.markerClusterGroup(
            //.layerSupport
            {
                disableClusteringAtZoom: 16,
                maxClusterRadius: 50,
                spiderfyDistanceMultiplier: 1,
                spiderfyOnMaxZoom: false,
                showCoverageOnHover: false,
                zoomToBoundsOnClick: true,
                // removeOutsideVisibleBounds:true, // TODO check bugs
                iconCreateFunction: function (cluster) {
                    const mrks = cluster.getAllChildMarkers();
                    const n = mrks.length;
                    const clusterIconSize = Math.floor(Number(n) * 1.1 + 60);
                    return L.divIcon({
                        html: n,
                        className: "mycluster ua-cluster-places",
                        iconSize: L.point(clusterIconSize, clusterIconSize),
                        iconAnchor: [0, 0],
                    });
                },
                spiderfyShapePositions: function (count, centerPt) {
                    var distanceFromCenter = 33,
                        markerDistance = 33,
                        lineLength = markerDistance * (count - 1),
                        lineStart = centerPt.y - lineLength / 2,
                        res = [],
                        i;

                    res.length = count;

                    for (i = count - 1; i >= 0; i--) {
                        res[i] = L.point(
                            centerPt.x + distanceFromCenter,
                            lineStart + markerDistance * i
                        );
                    }

                    return res;
                },
                spiderLegPolylineOptions: {
                    weight: 1,
                    color: "#000",
                    opacity: 0.4,
                    dashArray: "5, 5",
                },
            }
        );

        UacanadaMap.markersOverlay = { All: UacanadaMap.mapLayers.markers };
        

        // UacanadaMap.mapLayers.sidePanel = L.control.sidepanel("ua-sidepanel", {
        //     position: "bottomleft",
        //     panelPosition: "left",
        //     pushControls: false,
        //     tabsPosition: "top",
        //     startTab: "tab-" + UacanadaMap.tab_numerator.all,
        // });

        UacanadaMap.mapLayers.locateControl = L.control.locate({
            position: "bottomright",
            flyTo: true,
            maxZoom: 14,
            strings: { title: "Show me where I am, yo!" },
        });

        UacanadaMap.mapLayers.zoomControl = L.control.zoom({ position: "bottomright" });

        UacanadaMap.mapControlsUnused.layerControl = L.control.layers(
            UacanadaMap.mapProviders,
            UacanadaMap.markersOverlay,
            { position: "topright" }
        );

        UacanadaMap.hiddenControls.geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            position: "topright",
            query: "",
            placeholder: "Search here",
            geocoder: L.Control.Geocoder.mapbox(UacanadaMap.geocoderOptions),
        });
        const myFullscreen = L.Control.Fullscreen.extend({
            options: {  pseudoFullscreenClass: "fa fa-expand" }
        });
        UacanadaMap.mapLayers.fsControl = new myFullscreen({ position: "bottomright" });
    }
	

    UacanadaMap.api.mapInit = () => {
        UacanadaMap.map = L.map("uacamap", MAP_SETTINGS).fitBounds(UacanadaMap.bounds).setView(UacanadaMap.latestLocation.latlng, UacanadaMap.DEFAULT_ZOOM);
    }


    
    
    UacanadaMap.api.addMapLayers = () => {
        Object.values(UacanadaMap.mapLayers).forEach(addMapLayer);
    }
    
	
	UacanadaMap.api.addMapControls = () => {
        Object.values(UacanadaMap.hiddenControls).forEach(handleControlAddition);
        const $buttonContainer = $('#tile-chooser');
        $.each(UacanadaMap.mapProviders, (providerName) => {
            const $button = $('<button/>', {
                id: `provider-button-${providerName}`,
                class: 'provider-button',
                text: providerName,
                // css: { backgroundImage: `url('/path/to/${providerName}-image.png')`, // Replace with your own image path pattern  },
                click: () => {  UacanadaMap.switchMapProvider(providerName);  },
            });
    
            $buttonContainer.append($button);
        });
    }
    

    UacanadaMap.switchMapProvider = (newProvider) => {
		if (UacanadaMap.currentMapProvider) {
			UacanadaMap.map.removeLayer(UacanadaMap.currentMapProvider);
		}
	
		UacanadaMap.currentMapProvider = UacanadaMap.mapProviders[newProvider];
		UacanadaMap.map.addLayer(UacanadaMap.currentMapProvider);
	}
   




})



