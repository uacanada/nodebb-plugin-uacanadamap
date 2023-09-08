'use strict';
define('markers/markerPopulator',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    
  
    function calculateDegreesFromPixels(pixelX, pixelY, zoom) {
      const vancouverLatLng = UacanadaMap.L.latLng(49.2827, -123.1207);
      const startPoint = UacanadaMap.map.project(vancouverLatLng, zoom);
      const endPoint = startPoint.add(L.point(pixelX, pixelY));
      const endPointLatLng = UacanadaMap.map.unproject(endPoint, zoom);
      const lng = Math.abs(endPointLatLng.lng - vancouverLatLng.lng);
      const lat = Math.abs(endPointLatLng.lat - vancouverLatLng.lat);
      return { lng, lat, endPointLatLng };
    }
  
    function getRandomNumber() {
      return (Math.random() * (0.6 - 0.1) + 0.1).toFixed(2);
    }
  
    function findGroup(groups, marker) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].includes(marker)) {
          return i;
        }
      }
      return -1;
    }
  
    function mergeGroups(groups, group1, group2) {
      if (group1 === group2) {
        return;
      }
  
      for (const marker of groups[group2]) {
        groups[group1].push(marker);
      }
  
      groups[group2] = [];
    }
  
    function shiftMarkersWithCloseNeighbors(markers, forceShift) {
       const {
        virtZoom,
        shiftX,
        shiftY,
        latDistanceTtrigger,
        lngDistanceTtrigger,
      } = UacanadaMap.markerSettings;
      const { L } = UacanadaMap;

      const smallerShift = calculateDegreesFromPixels(shiftX / 4, shiftY / 4, virtZoom);
      const smallerTreshold = calculateDegreesFromPixels(lngDistanceTtrigger / 4, latDistanceTtrigger / 4, virtZoom);

      let groups = [];
  
      for (let i = 0; i < markers.length; i++) {
        groups[i] = [markers[i].marker];
      }
      for (let i = 0; i < markers.length; i++) {
        const currentMarker = markers[i].marker;
  
        let hasNeighbors = false;
  
        for (let j = i + 1; j < markers.length; j++) {
          const otherMarker = markers[j].marker;
          if (
            Math.abs(
              currentMarker.getLatLng().lat - otherMarker.getLatLng().lat
            ) < smallerTreshold.lat &&
            Math.abs(
              currentMarker.getLatLng().lng - otherMarker.getLatLng().lng
            ) < smallerTreshold.lng
          ) {
            hasNeighbors = true;
  
            const currentGroup = findGroup(groups, currentMarker);
            const otherGroup = findGroup(groups, otherMarker);
            if (currentGroup !== otherGroup) {
              mergeGroups(groups, currentGroup, otherGroup);
            }
          }
        }
      }

     
      
  
      const markerGroups = groups.filter((group) => group.length > 1);
      if (forceShift) {
        markerGroups.forEach((group) => {
          const groupSize = group.length;
           group.forEach((marker, index) => {
            if(index>0){
              const m = UacanadaMap.allPlaces[marker.tid];
              m.neighborIndex = index;
              m.neighborsCount = groupSize;
              m.neighbors = group;
              m.shifted = true;
              const SHIFT_STEP_PX = 50
              const shiftDistance = SHIFT_STEP_PX*index
              const currentIcon = m.marker.getIcon();
              const currentHtml = currentIcon.options.html;
              m.marker.setIcon(L.divIcon({
                className: currentIcon.options.className+' shifted-marker',
                html: `<div class="shifted-marker-wrapper" style="margin-top: -${shiftDistance}px;">
                  ${currentHtml}
                  <div class="shifted-marker-leg" style="height: ${shiftDistance+22}px;"></div>
                </div>`,
                iconSize: currentIcon.options.iconSize,
                iconAnchor: currentIcon.options.iconAnchor
              }));
            }
          });
        });
      }
      return markerGroups;
    }
  
    UacanadaMap.api.populatePlaces = async (array) => {
  
      if(UacanadaMap.categoryClusters?.allMarkersCluster?.getLayers()?.length > 0) return UacanadaMap.console.log('Already Populated')
  
      UacanadaMap.api.cleanUp();
      //UacanadaMap.allMarkersMixed = [];

      
      
      
     
          for (const [index, item] of array.entries()) {
            if (!item.placeCategory || !item.latlng[0]) continue;

            const newMarker = UacanadaMap.api.createMarker(index,item);// Replace with your custom marker creation code
            const { visibleOnlyWhenChosen } = ajaxify.data.UacanadaMapSettings.subCategories.find(({ slug }) => slug === item.placeCategory) || {};

            
            if(!visibleOnlyWhenChosen || visibleOnlyWhenChosen !== 'on'){
              UacanadaMap.categoryClusters['allMarkersCluster'].addLayer(newMarker);
            }

            
            
            // Add marker to the respective category cluster
            if (UacanadaMap.categoryClusters[item.placeCategory]) {
                UacanadaMap.categoryClusters[item.placeCategory].addLayer(newMarker);

               // UacanadaMap.allMarkersMixed = UacanadaMap.allMarkersMixed.concat(UacanadaMap.categoryClusters[item.placeCategory].getLayers());
            }
        }

       
       

        try {
         // shiftMarkersWithCloseNeighbors(UacanadaMap.allMarkersMixed, true);
          UacanadaMap.allPlacesArray = Object.values(UacanadaMap.allPlaces);
          shiftMarkersWithCloseNeighbors(UacanadaMap.allPlacesArray, true);

        } catch (error) {
          UacanadaMap.console.log(error)
        }
       
        
  
      
  
     // UacanadaMap.api.mapReLoaded(UacanadaMap.initUaMapCount);
      return UacanadaMap.initUaMapCount;
    };
  });
  