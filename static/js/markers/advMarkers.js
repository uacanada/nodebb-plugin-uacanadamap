'use strict';
    define('markers/advMarkers', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

   
   
    UacanadaMap.api.reserveClusterForAdvMarkers = () => {
        if(UacanadaMap.mapLayers?.advMarkers?._leaflet_id){
            //  UacanadaMap.mapLayers.advMarkers.remove()
              
          } else {
      
              UacanadaMap.mapLayers.advMarkers = UacanadaMap.L.markerClusterGroup(
                          
                  {
                    iconCreateFunction: function (cluster) { // TODO cluster for ads
                        const markers = cluster.getAllChildMarkers();
                        const count = markers.length;
                        const iconSize = Math.floor(count * 1.1 + 48);
                        const anchorSize = iconSize / 2;
                      
                        return L.divIcon({
                          html: count,
                          className: "mycluster",
                          iconSize: L.point(iconSize, iconSize),
                          iconAnchor: [anchorSize, anchorSize]
                        });
                    },
                      
                  }
              );
          }
    }
    

    UacanadaMap.api.populateAdvMarkers = (tags) => {
        if(ajaxify.data.UacanadaMapSettings?.advMarkers?.length>0){

           
            ajaxify.data.UacanadaMapSettings.advMarkers.forEach((m, index) => {
                 try {

                    // TODO add filter logic for TAGS
                    const marker = UacanadaMap.L.marker(m.latlng.split(','), { icon: UacanadaMap.L.divIcon({
                        className: 'advMarker',
                        html: `<div class="d-flex align-items-center" data-adv-marker="${m.id}">
                                <div class="circle-icon rounded-circle shadow d-flex align-items-center justify-content-center" style="color:${m.color}"> <i class="fa fas ${m.icon}"></i> </div>
                                <span class="ms-2 badge-text" style=" line-height: 1; font-size:0.7rem; bold; color: ${m.color}; ">${m.title}</span> 
                              </div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12],
                        popupAnchor: [0, -20],
                      }) })
                        .bindPopup('<div class="p-2">'+m.popup+'</div>')
                        .on("popupopen", (e) => {
                     
                      }).on("click", (e) => {
                        e.sourceTarget.openPopup();
                       
                      });

                      
                        UacanadaMap.mapLayers.advMarkers.addLayer(marker);
                        ajaxify.data.UacanadaMapSettings.advMarkers[index].marker = marker
                } catch (error) {
                    UacanadaMap.console.log(error)
                }

                
            
            })


            if(UacanadaMap.mapLayers?.advMarkers?._leaflet_id){
                try {
                    UacanadaMap.mapLayers.advMarkers.addTo(UacanadaMap.map);
                } catch (error) {
                    UacanadaMap.console.log(error)
                }
                
            }
            

        }

      

        
    }





    UacanadaMap.api.findMatchedAdv=(category,tags)=>{

        const advCards = []
        
        
        for (const m of ajaxify.data.UacanadaMapSettings.advMarkers) {
            try {

               const triggers = m.advMarkerTags.split(',')
               const meta = [...[category],...tags]
               let matchingValues = triggers.filter(value => meta.includes(value));
               if(matchingValues.length>0){
                advCards.push(m)
               }


            } catch (error) {
                UacanadaMap.console.log(error)
            }
        }
        return advCards;
    }


    UacanadaMap.api.openAdvMarker=(id,latlng) =>{

        UacanadaMap.map.setView(latlng.split(','))
        ajaxify.data.UacanadaMapSettings.advMarkers.find(m => m.id == id).marker.openPopup()

    }


})