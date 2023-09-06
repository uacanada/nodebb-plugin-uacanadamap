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
      const shift = calculateDegreesFromPixels(shiftX, shiftY, virtZoom);
      const treshold = calculateDegreesFromPixels(
        lngDistanceTtrigger,
        latDistanceTtrigger,
        virtZoom
      );
      let groups = [];
  
      for (let i = 0; i < markers.length; i++) {
        groups[i] = [markers[i]];
      }
      for (let i = 0; i < markers.length; i++) {
        const currentMarker = markers[i];
  
        let hasNeighbors = false;
  
        for (let j = i + 1; j < markers.length; j++) {
          const otherMarker = markers[j];
          if (
            Math.abs(
              currentMarker.getLatLng().lat - otherMarker.getLatLng().lat
            ) < treshold.lat &&
            Math.abs(
              currentMarker.getLatLng().lng - otherMarker.getLatLng().lng
            ) < treshold.lng
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
            const m = UacanadaMap.allPlaces[marker.tid];
            const realGps = m.marker._latlng || [
              Number(m.gps[0]),
              Number(m.gps[1]),
            ];
            const idx = index + 1;
  
            m.neighborIndex = index;
            m.neighborsCount = groupSize;
            m.neighbors = group;
  
            const currentLatLng = marker.getLatLng();
            const randomMul = getRandomNumber();
            const shiftedLatLng = L.latLng(
              currentLatLng.lat - shift.lat * idx * 0.3,
              currentLatLng.lng + shift.lng * idx * randomMul
            );
  
            m.shifted = true;
            marker.setLatLng(shiftedLatLng);
            L.polyline([realGps, shiftedLatLng], {
              weight: 1,
              color: "#ff2424",
              opacity: 0.6,
              dashArray: "5, 5",
            }).addTo(UacanadaMap.map);
            const markerDot = L.divIcon({
              className: "ua-marker-dot",
              html: `📍`,
              iconSize: [15, 15],
              iconAnchor: [7, 7],
            });
            L.marker(realGps, { icon: markerDot }).addTo(UacanadaMap.map);
          });
        });
      }
  
      return markerGroups;
    }
  
    UacanadaMap.api.populatePlaces = async (array) => {
  
      
  
      UacanadaMap.api.cleanUp();
      
      // for (const [index, item] of array.entries()) {
      //   if (!item.placeCategory || !item.latlng[0]) continue;
      //   const newMarker = UacanadaMap.api.createMarker(index,item)
      //   UacanadaMap.mapLayers.markers.addLayer(newMarker);
      // }
  
      // UacanadaMap.mapLayers.markers.addTo(UacanadaMap.map);


       // Populate category-specific clusters with markers
          for (const [index, item] of array.entries()) {
            if (!item.placeCategory || !item.latlng[0]) continue;

            const newMarker = UacanadaMap.api.createMarker(index,item);// Replace with your custom marker creation code

            
            UacanadaMap.categoryClusters['allMarkersCluster'].addLayer(newMarker);
            // Add marker to the respective category cluster
            if (UacanadaMap.categoryClusters[item.placeCategory]) {
                UacanadaMap.categoryClusters[item.placeCategory].addLayer(newMarker);
            }
        }

       
        // Add category clusters to main cluster group
        let allMarkersMixed = [];
        for (const category in UacanadaMap.categoryClusters) {
          UacanadaMap.mapLayers.markers.addLayer(UacanadaMap.categoryClusters[category]);
         allMarkersMixed = allMarkersMixed.concat(UacanadaMap.categoryClusters[category].getLayers());
          

          // try {
          //   shiftMarkersWithCloseNeighbors(
          //     UacanadaMap.categoryClusters[category].getLayers(),
          //     true
          //   );
          // } catch (error) {
          //   console.log(error);
          // }
          


        }

        try {
          shiftMarkersWithCloseNeighbors(allMarkersMixed, true);
        } catch (error) {
          UacanadaMap.console.log(error)
        }
       


       

  
      
  
     // UacanadaMap.api.mapReLoaded(UacanadaMap.initUaMapCount);
      return UacanadaMap.initUaMapCount;
    };
  });
  