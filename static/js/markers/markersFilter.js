'use strict';
    define('markers/markersFilter', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    
    UacanadaMap.api.removeMarker = (tid) => {
      if(tid && UacanadaMap.allPlaces[tid]?.marker){
     //   UacanadaMap.mapLayers.markers.removeLayer(UacanadaMap.allPlaces[tid].marker); TODO revise
      }
    }

    UacanadaMap.api.addMarker = (tid) => {
      if(tid && UacanadaMap.allPlaces[tid]?.marker){
      //  UacanadaMap.mapLayers.markers.addLayer(UacanadaMap.allPlaces[tid].marker); TODO revise
      }
    }


    UacanadaMap.api.filterMarkers = (criteria) => {
        if (!UacanadaMap.allPlaces) {
            return UacanadaMap.console.log(`No places`);
        }
        if (UacanadaMap.pointerMarker) {
            UacanadaMap.map.removeLayer(UacanadaMap.pointerMarker);
        }
        const anyLocation = criteria === "anyLocation";
        const onlyOnVisibleArea = criteria === "onlyVisible";
        const mustBeInCategory = $("#location-category-filter").val(); // TODO
       
        UacanadaMap.showOnlyArea = onlyOnVisibleArea ? true : false;
        UacanadaMap.currentSortedMarkers = []

        for (const tid in UacanadaMap.allPlaces) {
          if (Object.hasOwnProperty.call(UacanadaMap.allPlaces, tid)) {
            const place = UacanadaMap.allPlaces[tid];
            if(!place) continue;
            const canShow = onlyOnVisibleArea ? UacanadaMap.api.isPlaceVisibleOnMap(UacanadaMap.map, place.gps) : true
            UacanadaMap.api.removeMarker(tid)
            if (canShow && (!mustBeInCategory || mustBeInCategory === place.json.placeCategory)) {
              UacanadaMap.currentSortedMarkers.push({ tid, lat: place.marker._latlng.lat,  lng: place.marker._latlng.lng, json: place.json, html: place.marker.uaMarkerCardHTML});
              UacanadaMap.api.addMarker(tid)
            }
            
           
          }
        }

        UacanadaMap.currentSortedMarkers= [...UacanadaMap.currentSortedMarkers]
        return UacanadaMap.currentSortedMarkers;
        
        
        //UacanadaMap.api.createСategoryButtonsSwiper(mustBeInCategory);
        
        
      
    }


    // TODO
    UacanadaMap.api.rewriteTabs = (criteria) => {
           // UacanadaMap.api.rewriteTabs deprecated, new method is    UacanadaMap.api.filterMarkers(criteria)   instead')
            UacanadaMap.api.filterMarkers(criteria)
    }
  

})