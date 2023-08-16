'use strict';
define('markers/markerFetcher', ['core/uacanadamap'], function(UacanadaMap) { 

    UacanadaMap.TEMP.eventsArray = []
    UacanadaMap.TEMP.placesArray = []
  
      const apiRequest = async () => {
        try {
          const responseRaw = await fetch(UacanadaMap.routers.getplaces);
          const response = await responseRaw.json();
          if (response.status.code === 'ok' &&  response.response?.placesArray?.length) {
            UacanadaMap.previousPlacesArray = response.response.placesArray;
            return response.response.placesArray
          } else if (UacanadaMap.previousPlacesArray) {
            return UacanadaMap.previousPlacesArray
          } else {
            console.warn('Trouble with API');
            return [];
          }
        } catch (error) {
          console.warn(error);
          return [];
        }
      }
  
      
  
      UacanadaMap.api.fetchMarkers = async (fromCache) => {
         
        try {
          if(fromCache && UacanadaMap.previousPlacesArray){
           
            return UacanadaMap.previousPlacesArray
          } else {
           const markers = await apiRequest()
           return markers;
          }
        } catch (error) {
          return []
        }
         
  
  
  
  
  
  
         // TODO  await UacanadaMap.api.populatePlaces( UacanadaMap.previousPlacesArray )
  
  
      }
  
  
  
  
  
  
  
  
  
  
  
  })
  
  
  
  