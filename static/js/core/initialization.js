"use strict";

define("core/initialization", [
  "utils/extensions",
  "core/interactions",
  "core/configurations",
  "utils/handlers",
  "utils/mapFeatures",

  "core/swipersCreator",

  "population/categoriesCreator",
  
  "events/mapReady",
  "ui/swipeDetectors",
  
  
  "forms/regionCreator",
  "markers/markersFetcher",
  "markers/markersPopulator",
  "ui/elementPositions",
  "utils/methods",
  "panels/buttonsSwiper",
  "panels/cardSwiper",
  "panels/bottomSheets",
  "population/tabsPopulator",
  "markers/markersFilter",
  "markers/advMarkers",
  "events/basicListeners",
  "events/hooks",
  "utils/expandMap",
  
  "forms/submitPlace",
  "forms/editPlace",
  "topics/topicPost",
  "topics/topicClient",
  "events/registerableListeners",
], function (
  extensions,
  interactions,
  configurations,
  handlers,
  mapFeatures,
  mapReady,
  swipersCreator,
  swipeDetectors,
  categoriesCreator,
  regionCreator,
  markersFetcher,
  markersPopulator,
  elementPositions,
  methods,
  buttonsSwiper,
  cardSwiper,
  bottomSheets,
  tabsPopulator,
  markersFilter,
  advMarkers,
  basicListeners,
  hooks,
  expandMap,

  submitPlace,
  editPlace,
  topicPost,
  topicClient,
  registerableListeners,
  // Built-in AMD modules:
  module 

) {
  
  

 

  return async (UacanadaMap) => {
    
    const firstInitTime = Date.now();
    const reload = async (UacanadaMap) => {
      let fromCache = (UacanadaMap.map?._leaflet_id && UacanadaMap?.allPlaces && Object.keys(UacanadaMap.allPlaces).length > 0)  ? true  : false;
   
   
      UacanadaMap.api.configureMapElements();
      UacanadaMap.api.mapInit();
      UacanadaMap.api.addMapLayers();
      UacanadaMap.api.addMapControls();
      UacanadaMap.api.initializeSwipers();
      UacanadaMap.api.createCategories();
  
      const markersArray = await UacanadaMap.api.fetchMarkers(fromCache);
      UacanadaMap.api.populatePlaces(markersArray);
  
      UacanadaMap.api.populateTabs();
      UacanadaMap.api.mapReLoad();
      UacanadaMap.api.showCatSelector($("#ua-filter-places").val() ?? "");
      UacanadaMap.api.mainFrameShow();
      UacanadaMap.api.OffCanvasPanelHandler();
      UacanadaMap.api.rotateCards("horizontal");
      UacanadaMap.api.animateCards("close");
      UacanadaMap.api.fitElementsPosition();
      UacanadaMap.api.hideElements(false);
      UacanadaMap.api.cleanMarkers(true);
      UacanadaMap.api.cardsOpened(false);
      UacanadaMap.api.setCategory("");
      UacanadaMap.api.filterMarkers(false);
      UacanadaMap.api.registerHooks()
      UacanadaMap.api.registerBasicListeners()
      if (UacanadaMap.eventListenersInstance) {
        UacanadaMap.eventListenersInstance.reload();
      } else {
        UacanadaMap.eventListenersInstance = new registerableListeners(UacanadaMap);
        UacanadaMap.eventListenersInstance.register();
      }
    }

    reload(UacanadaMap)
    
    const hooks = await app.require("hooks");
    hooks.on('action:ajaxify.end', (data) => {
      if(data.tpl_url === 'map'){
           
            if( UacanadaMap.needReinit){
               console.log(` reinit `, data)
               
               
               if(app.user.isAdmin){
                   console.log('ADMIN MODE ajaxify')
                   reload(UacanadaMap)
               }else{
                  // initializeEnvironment(UacanadaMap);
                  reload(UacanadaMap)
               }
   
   
            } 
   
   
       }else{
           UacanadaMap.needReinit = true
           document.body.style.overflow = '';
           document.body.removeAttribute('data-bs-overflow');
       }
   
       UacanadaMap.console.log("~~~~~end to", data);
     });

  };



  




});