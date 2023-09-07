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
  "panels/categoryButtonsSwiper",
  "panels/cardSwiper",
  "panels/bottomSheets",
  'panels/contextButton',
  "population/tabsPopulator",
  "markers/markersFilter",
  "markers/advMarkers",
  "markers/markersConfigurator",
  "events/basicListeners",
  "events/hooks",
  "utils/expandMap",
  "forms/submitPlace",
  "forms/editPlace",
  "topics/topicPost",
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
  categoryButtonsSwiper,
  cardSwiper,
  bottomSheets,
  contextButton,
  tabsPopulator,
  markersFilter,
  advMarkers,
  markersConfigurator,
  basicListeners,
  hooks,
  expandMap,
  submitPlace,
  editPlace,
  topicPost,
  registerableListeners,
  // Built-in AMD modules:
  module 
) {
  
return async (UacanadaMap) => {
     UacanadaMap.firstInitTime = Date.now();
    const hooks = await app.require("hooks");
    
    const reload = async (UacanadaMap) => {
      let allowLoadOldfromCache = (UacanadaMap.map?._leaflet_id && UacanadaMap?.allPlaces && Object.keys(UacanadaMap.allPlaces).length > 0)  ? true  : false;
      UacanadaMap.latestLocation = UacanadaMap.api.getLatestLocation();
      
      if (!UacanadaMap.eventListenersInstance) { 
        UacanadaMap.eventListenersInstance = new registerableListeners(UacanadaMap);
      } 
      
    
      UacanadaMap.api.configureMapElements();
      UacanadaMap.api.initializeSwipers();

      UacanadaMap.api.mapInit();
      UacanadaMap.api.addMapLayers();
      UacanadaMap.api.addMapControls();

      UacanadaMap.api.createCategories();
      UacanadaMap.api.populatePlaces(await UacanadaMap.api.fetchMarkers(allowLoadOldfromCache));
      UacanadaMap.api.populateTabs();

      
      UacanadaMap.api.createCategoryButtonsSwiper($("#location-category-filter").val() ?? "");
      UacanadaMap.api.OffCanvasPanelHandler();

      UacanadaMap.api.hideElements(false);
      UacanadaMap.api.cleanMarkers(true);
      UacanadaMap.api.cardsOpened(false);
      UacanadaMap.api.setCategory("");
      UacanadaMap.api.filterMarkers(false);
      UacanadaMap.api.registerHooks()
      UacanadaMap.api.reserveClusterForAdvMarkers()
      UacanadaMap.run.submitPlace()
      UacanadaMap.api.mapReLoad();
      UacanadaMap.api.mainFrameShow();
      UacanadaMap.eventListenersInstance.register();
      


      

      

      if(app.user.isAdmin){
        // Make accessible globally for debugging purposes
          window.UacanadaMap = UacanadaMap;
      }

      return UacanadaMap

    }

    await reload(UacanadaMap)

    hooks.on("action:ajaxify.start", function (data) {
      UacanadaMap.console.log("🔜",data);
      UacanadaMap.api.detectMapViewport();
    
      const mapRouter = ajaxify.data.UacanadaMapSettings?.mapPageRouter
      if(!mapRouter) return 

      const isPreviousMap = app.previousUrl.includes(mapRouter)
      const isNextMapOrMain = !data.url || '/'+data.url === mapRouter // TODO if user decided not using main page?

      

      if(isNextMapOrMain){
     
        UacanadaMap.console.log("User comebacks to the map page");
      }else if(isPreviousMap){
       
        
        UacanadaMap.console.log("User leaves map page",data,app);
        UacanadaMap.eventListenersInstance.remove();
        try {
          UacanadaMap.map.remove()
          UacanadaMap.map = null   
        } catch (error) {
          UacanadaMap.console.log(error)
        }

           UacanadaMap.needReinit = true
           document.body.style.overflow = '';
           document.body.removeAttribute('data-bs-overflow');
           $('body')
           .removeClass('far-away-zoom')
           .removeClass('hiddenElements')
           .removeClass('addPlaceMode')
           .removeClass('cards-opened');

      } else {
        UacanadaMap.console.log("User walks between pages",data,app);
      }
    
    
    });
    
    
    

    hooks.on('action:ajaxify.end', (data) => {
      if(data.tpl_url === 'map'){
           
            if(UacanadaMap.firstInitTime < Date.now()-1000 || UacanadaMap.needReinit){
              if(app.user.isAdmin){
                   console.log('ADMIN MODE ajaxify')
                   reload(UacanadaMap)
               }else{
                  reload(UacanadaMap)
               }
   
   
            } 
   
   
       }else{
           
           


           if(data.tpl_url === 'post'){
             
           }



       }
   
      
       UacanadaMap.console.log("🔚", data);
     });

     hooks.on("action:ajaxify.coldLoad", function (data) {
      UacanadaMap.console.log("~ coldLoad", data);
    });

  };



  




});