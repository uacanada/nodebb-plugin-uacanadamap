'use strict';
define('core/configuration', function (require) {
    const L = require('leaflet');
    const Swiper = require('swiper/bundle').default;
    const UacanadaMap = require('core/variables');
    require('leaflet-fullscreen');
    require('leaflet-control-geocoder');
    require('leaflet.markercluster');
    require('leaflet.locatecontrol');
    require('leaflet-contextmenu');
    require('leaflet-providers');
    
    
    const dateTime = new Date(Date.now());
    UacanadaMap.L = L
    UacanadaMap.Swiper = Swiper
    
    const { mapPageRouter, initialCoordinates, mapBoxApiKey, countryLimit, bottomRightCorner, topLeftCorner } = ajaxify.data.UacanadaMapSettings;

    UacanadaMap.timestampNow = Math.floor(dateTime / 1000);
    UacanadaMap.weekDay = UacanadaMap.weekdays[dateTime.getDay()];
    UacanadaMap.userRegistered = app.user.uid && app.user.uid > 0;
    UacanadaMap.adminsUID = app.user.isAdmin;
    UacanadaMap.markerSettings = {
      virtZoom: 16,
      shiftX: 100,
      shiftY: 100,
      lngDistanceTtrigger: 110,
      latDistanceTtrigger: 45,
    };
  
    UacanadaMap.contextButton = {
      router: {
        text: 3,
        main: 0,
        cards: 1,
        addplace:4
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
        ...(countryLimit ? { geocodingQueryParams: { country: countryLimit } } : {}),
      };
      

    UacanadaMap.api.configureMapElements = () => {

        const {L} = UacanadaMap 

        if(UacanadaMap.map){
            try {
                UacanadaMap.map.remove()
            } catch (error) {
                UacanadaMap.console.log(error)
            }
            UacanadaMap.map = null
        }

        
        UacanadaMap.mapLayers.MapBox = ajaxify.data.UacanadaMapSettings.mapBoxApiKey?.length > 30 ? L.tileLayer.provider("MapBox", { id: "mapbox/streets-v11",  accessToken:ajaxify.data.UacanadaMapSettings.mapBoxApiKey}):UacanadaMap.StreetsMap;
        UacanadaMap.mapProviders = {
            MapBox: UacanadaMap.mapLayers.MapBox,
            OSM:  L.tileLayer( "https://tile.openstreetmap.org/{z}/{x}/{y}.png",  { maxZoom: 19 }  ),
            Minimal: L.tileLayer.provider("Esri.WorldGrayCanvas"),
            BlackWhite: L.tileLayer.provider("Stamen.TonerLite"),
            Terrain: L.tileLayer.provider("Stamen.Terrain"),
            Satellite: L.tileLayer.provider("Esri.WorldImagery"),
            Classic: L.tileLayer.provider("Esri.NatGeoWorldMap"),
        };


        UacanadaMap.icon = L.divIcon({
            className: "ua-locate-me-marker",
            html: '<div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden">Loading...</span> </div>', // TODO move to settings
            iconSize: [28, 28],
            iconAnchor: [6, 14],
            popupAnchor: [8, -3],
        });
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

            // Initialize the main marker cluster group to hold multiple categories
           // UacanadaMap.mapLayers.markers = L.layerGroup();

            // Initialize category-specific cluster groups
            UacanadaMap.categoryClusters = {};


            function createCluster(category){
                UacanadaMap.categoryClusters[category.slug] = L.markerClusterGroup(
                    {
                        disableClusteringAtZoom: 17,
                        maxClusterRadius: 90, // TODO move to ACP
                        spiderfyDistanceMultiplier: 1,
                        spiderfyOnMaxZoom: false,
                        showCoverageOnHover: false,
                        zoomToBoundsOnClick: true,
                        // removeOutsideVisibleBounds:true, // TODO check bugs
                        iconCreateFunction: function (cluster) {
                            const markers = cluster.getAllChildMarkers();
                            const count = markers.length;
                            const iconSize = Math.min(Math.max(Math.floor((count * 3) + 33), 32), 48);

                            const anchorSize = iconSize / 2;
                            return L.divIcon({
                              html:`<div class="cluster-icon">
                              <div class="badge-number">${count}</div>
                              <div class="icon-wrapper">
                                <i class="fas fa-home"></i>
                                <i class="fas fa-cut"></i>
                                <i class="fas fa-car"></i>
                                <i class="fas fa-heart"></i>
                                <i class="fas fa-hospital"></i>
                              </div>
                            </div>
                            ` , // TODO revise cluster icon and move to ACP
                              className: "ucmpcluster",
                              iconSize: L.point(iconSize, iconSize),
                              iconAnchor: [anchorSize, anchorSize]
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
            }

            createCluster({slug:'allMarkersCluster'})
            ajaxify.data.UacanadaMapSettings.subCategories.forEach((category) => {  createCluster(category) });
            UacanadaMap.markersOverlay = {};
            for (const category in UacanadaMap.categoryClusters) {
                const clusterGroup = UacanadaMap.categoryClusters[category];
                UacanadaMap.markersOverlay[category] = clusterGroup
            }
            UacanadaMap.api.addLeafletButton = ({position='bottomright', classes, title, icon, btnclasses, attributes='', extendedhtml=''}) => L.Control.extend({
                options: { position },
                onAdd() {
                const container = L.DomUtil.create('div', `leaflet-control ${classes}`);
                container.innerHTML = `<button type="button" title="${title}" class="btn circle-button ${btnclasses}" ${attributes}><i class="${icon}"></i></button>${extendedhtml}`;
                return container;
                }
            });
           
                
            UacanadaMap.mapLayers.removeCardsButton =  new (UacanadaMap.api.addLeafletButton({classes: 'removeCards mb-5', title: 'Remove Cards', icon: 'fa fa-solid fa-xmark',btnclasses:'btn-danger'}));
            UacanadaMap.mapLayers.rotateCardsButton =  new (UacanadaMap.api.addLeafletButton({classes: 'rotateCards', title: 'Rotate Cards', icon: 'fa fa-solid fa-table-list',btnclasses:'btn-primary'})); 
               
            UacanadaMap.mapLayers.filterPlacesButton = new (UacanadaMap.api.addLeafletButton({  classes: "filterPlaces btn-group dropstart",  title: "Filter Places",  icon: "fa fa-fw fa-sliders",  btnclasses: "btn btn-secondary dropdown-toggle", 
               attributes:`data-bs-toggle="dropdown" aria-expanded="false"`,
                extendedhtml:`<div class="dropdown-menu">  <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom"
                data-ua-sortby="distance" href="#">
                <i class="fas fa-road me-2"></i> Distance
            </a>
            <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom"
                data-ua-sortby="latest" href="#">
                <i class="fas fa-hourglass-start me-2"></i> Latest
            </a>
            <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom"
                data-ua-sortby="oldest" href="#">
                <i class="fas fa-hourglass-end me-2"></i> Oldest
            </a>
            <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom"
                data-ua-sortby="events" href="#">
                <i class="fas fa-calendar-alt me-2"></i> Event Date
            </a>
            <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom"
                data-ua-sortby="category" href="#">
                <i class="fas fa-folder me-2"></i> Category
            </a>
            <div class="list-group-item">
                <select id="location-category-filter" name="categoryfilter" class="form-select w-100 rounded-pill"
                    aria-label="category"></select>
            </div></div>` }));

           
            UacanadaMap.mapLayers.addPlaceButton = new (UacanadaMap.api.addLeafletButton({classes: 'leaflet-control-addplace newLocationOpenMarker', title: 'Add New Place', icon: 'fa fa-solid fa-map-pin',btnclasses:'btn-primary'})); 
           
                
                
           
                if (app.user.isAdmin) {
                   // UacanadaMap.mapLayers.menuControlButton = new (UacanadaMap.api.addLeafletButton({classes: 'expandRightButtons', title: 'Expand Menu', icon: 'fa fas fa-solid fa-ellipsis-vertical',btnclasses:'btn-warning'}));
                   //UacanadaMap.mapLayers.bottomPanelControlAll = new (UacanadaMap.api.addLeafletButton(   {classes: 'showBottomPanel', title: 'Show Bottom Panel', icon: 'fa fas fa-solid fa-people-roof',     btnclasses:'btn-info',attributes:`data-ua-content-id="tab-all"`}));
                  // UacanadaMap.mapLayers.bottomPanelControlEvents = new (UacanadaMap.api.addLeafletButton({classes: 'showBottomPanel', title: 'Show Bottom Panel', icon: 'fa far fa-regular fa-calendar-check',btnclasses:'btn-info',attributes:`data-ua-content-id="tab-events"`}));
                  
                   
                 }

                    
                






        UacanadaMap.mapLayers.locateControl = UacanadaMap.L.control.locate({
            position: "bottomright",
            flyTo: true,
            maxZoom: 14,
            strings: { title: "Show me where I am, yo!" },
        });

        UacanadaMap.mapLayers.zoomControl = UacanadaMap.L.control.zoom({ position: "bottomright" });

        UacanadaMap.mapControlsUnused.layerControl = L.control.layers(
            UacanadaMap.mapProviders,
            UacanadaMap.markersOverlay,
            { position: "topright" }
        );

        

        UacanadaMap.mapLayers.tileChooser = new (UacanadaMap.api.addLeafletButton({  classes: "tileChooser btn-group dropstart",  title: "Filter Places",  icon: "fa fa-solid fa-layer-group",  btnclasses: "btn btn-secondary dropdown-toggle", attributes:`data-bs-toggle="dropdown" aria-expanded="false"`, extendedhtml:`<div class="dropdown-menu"><div id="tile-chooser"></div></div>` }));
        
        const myFullscreen = UacanadaMap.L.Control.Fullscreen.extend({ options: {  pseudoFullscreenClass: "fa fa-expand" }  });
        UacanadaMap.mapLayers.fsControl = new myFullscreen({ position: "bottomright" });
            
          
        
        UacanadaMap.hiddenControls.geocoder = UacanadaMap.L.Control.geocoder({
            defaultMarkGeocode: false,
            position: "topright",
            query: "",
            placeholder: "Search here",
            geocoder: UacanadaMap.L.Control.Geocoder.mapbox(UacanadaMap.geocoderOptions),
        });
  
    }
	

    UacanadaMap.api.mapInit = () => {
        
        UacanadaMap.DEFAULT_ZOOM = ajaxify.data.UacanadaMapSettings.defaultZoom ? Number(ajaxify.data.UacanadaMapSettings.defaultZoom) :11; 
        const parseCoords = corner => corner ? corner.split(",").map(coord => Number(coord.trim())) : null;
    
        const bottomRight = parseCoords(bottomRightCorner);
        const topLeft = parseCoords(topLeftCorner);
    
        if (bottomRight && topLeft) {
            UacanadaMap.bounds = L.latLngBounds(L.latLng(...topLeft), L.latLng(...bottomRight));
        }


       
    
        UacanadaMap.map = UacanadaMap.L.map("uacamap", {
            zoomSnap: 1, // TODO: move to ACP
            wheelDebounceTime: 200,
            wheelPxPerZoomLevel: 200,
            attributionControl: true,
            zoom: UacanadaMap.DEFAULT_ZOOM,
            minZoom: ajaxify.data.UacanadaMapSettings.maxZoomOut? Number(ajaxify.data.UacanadaMapSettings.maxZoomOut): 2, 
            maxBounds: UacanadaMap.bounds, 
            tap: false,
            zoomControl: false,
            contextmenu: true,
            contextmenuWidth: 330,
            contextmenuItems: [{
                text: '<div class="spinner-grow spinner-grow-sm" role="status"><span class="visually-hidden">Loading...</span></div> Create new place here?</br><button type="button" class="btn btn btn-link p-2">Yes</button>', // TODO: move text to ACP
                callback: handleContextMenuClick,
            }],
            center: UacanadaMap.latestLocation.latlng,
        })
      
    
        if (UacanadaMap.bounds) {
            UacanadaMap.map.fitBounds(UacanadaMap.bounds);
        }

        UacanadaMap.map.setView(UacanadaMap.latestLocation.latlng, UacanadaMap.DEFAULT_ZOOM);
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
                class: 'provider-button d-block w-100',
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


    function handleContextMenuClick(e) {
        try {
            const { lat, lng } = getLatLng(e);
    
            if (!lat || !lng) {
                return console.warn('Location error');
            }
     $("#ua-latlng-text").val(`${lat},${lng}`);
     UacanadaMap.api.createMarkerButton(e, false);
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
            $("#geocoderSearchbox").append(layer.onAdd(UacanadaMap.map))
        } catch (error) {
            handleControlError(layer, error);
        }
    }
    
    function handleControlError(layer, error) {
        layer.addTo(UacanadaMap.map);
        const controlDiv = layer.getContainer();
        const controlDivCopy = controlDiv.cloneNode(true);
    
        $("#geocoderSearchbox").append(controlDivCopy);
      
    }

   


    return UacanadaMap;


})



