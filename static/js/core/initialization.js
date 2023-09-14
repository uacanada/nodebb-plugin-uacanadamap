"use strict";

define("core/initialization", [
  "utils/extensions",
  "core/interactions",
  "core/configurations",
  "core/fragmentManager",
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
  fragmentManager,
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

      if(!UacanadaMap.fragment){
        UacanadaMap.fragment = new fragmentManager()
      }
      
    
      UacanadaMap.api.configureMapElements();
      UacanadaMap.api.initializeSwipers();

      UacanadaMap.api.mapInit();
      UacanadaMap.api.addMapLayers();
      UacanadaMap.api.addMapControls();

      UacanadaMap.api.createCategories();
      
      try {
        if (UacanadaMap && UacanadaMap.categoryClusters && UacanadaMap.categoryClusters.allMarkersCluster) {
          const layers = UacanadaMap.categoryClusters.allMarkersCluster.getLayers();
          if (layers && layers.length > 0 ) {
            UacanadaMap.console.log('Already Populated');
          } else {
            const markers = await UacanadaMap.api.fetchMarkers(allowLoadOldfromCache);
            if (markers) {
              UacanadaMap.console.log(markers);
              UacanadaMap.api.populatePlaces(markers);
              UacanadaMap.api.populateTabs();
    
            } else {
              UacanadaMap.console.log('No markers returned from API');
            }
          }
        } else {
          UacanadaMap.console.log('UacanadaMap or its properties are not defined');
        }
      } catch (error) {
        UacanadaMap.console.log('An error occurred:', error);
      }
      
    

      
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
      // Improved logging by destructuring the data object
      const { url } = data;
      UacanadaMap.console.log("🔜 Starting AJAX request for URL:", url);
    
     
     // UacanadaMap.api.detectMapViewport();
    
      // Use optional chaining to safely access nested properties
      const mapRouter = ajaxify.data.UacanadaMapSettings?.mapPageRouter;
      if (!mapRouter) return;
    
      // Improved variable naming for clarity
      const isPreviousPageMapOrMain = app.previousUrl.includes(mapRouter) || app.previousUrl === '/'; // TODO: determine if map template not in map page in nodebb settings
      const isNextPageMapOrMain = !url || '/' + url === mapRouter; // TODO: determine if map template not in map page in nodebb settings
    
      if (isNextPageMapOrMain) {
        UacanadaMap.console.log("User is navigating back to the map page");
      } else if (isPreviousPageMapOrMain) {
        UacanadaMap.console.log("User is leaving the map page", data, app);
    
        // Encapsulate removal logic into a separate function
        cleanUpMapAndUI();
    
      } else {
        UacanadaMap.console.log("User is navigating between pages", data, app);
      }
    });
    
    // A separate function to handle map and UI removal
    function cleanUpMapAndUI() {
      UacanadaMap.eventListenersInstance.remove();
    
      try {
        UacanadaMap.map.remove();
        UacanadaMap.map = null;
      } catch (error) {
        UacanadaMap.console.log(error);
      }
    
      UacanadaMap.needReinit = true;
      document.body.style.overflow = '';
      document.body.removeAttribute('data-bs-overflow');
    
      // Chained multiple removeClass calls
      $('body').removeClass('far-away-zoom hiddenElements addPlaceMode cards-opened bottomPanelOpened');
    }
    
    
    
    

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