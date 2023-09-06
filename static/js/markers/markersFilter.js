'use strict';
    define('markers/markersFilter', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    
    UacanadaMap.api.filterMarkers = (criteria,markers) => {

      if (!UacanadaMap.allPlaces) {
        return UacanadaMap.console.log(`No places`);
      }
      if (UacanadaMap.pointerMarker) {
          UacanadaMap.map.removeLayer(UacanadaMap.pointerMarker);
      }

      for (const category in UacanadaMap.categoryClusters) {
        const clusterGroup = UacanadaMap.categoryClusters[category];
        UacanadaMap.map.removeLayer(clusterGroup)
      }


      const mustBeInCategory = $("#location-category-filter").val();
      const markersCategory = mustBeInCategory || 'allMarkersCluster'
      UacanadaMap.map.addLayer(UacanadaMap.categoryClusters[markersCategory])
      
      UacanadaMap.currentSortedMarkers = []
      
      for (const tid in UacanadaMap.allPlaces) {
        if (Object.hasOwnProperty.call(UacanadaMap.allPlaces, tid)) {
          const place = UacanadaMap.allPlaces[tid];
          if(!place) continue;
          
          if (!mustBeInCategory || mustBeInCategory === place.json.placeCategory){
            // TODO: add more sorting options
            UacanadaMap.currentSortedMarkers.push({ tid, lat: place.marker._latlng.lat,  lng: place.marker._latlng.lng, json: place.json, html: place.marker.uaMarkerCardHTML});
            
          }
        }
      }

      UacanadaMap.currentSortedMarkers= [...UacanadaMap.currentSortedMarkers]
      return UacanadaMap.currentSortedMarkers;


      

    }

    


    // TODO refactor
    UacanadaMap.api.rewriteTabs = (criteria) => {
           // UacanadaMap.api.rewriteTabs deprecated, new method is    UacanadaMap.api.filterMarkers(criteria)   instead')
            UacanadaMap.api.filterMarkers(criteria)
    }
  

})