"use strict";

define("core/initialization", [
  
  "core/interactions",
  "core/configurations",
  "utils/handlers",
  "utils/mapFeatures",
  "event/mapReady",
  "core/swipersCreator",
  "core/swipeDetectors",
  "population/categoriesCreator",
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
  "events/registerableListeners",
], function (
 
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
  registerableListeners,
  // Built-in AMD modules:
  module 

) {
  
  
  
  module.exports = async (UacanadaMap) => {
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

    if (UacanadaMap.eventListenersInstance) {
      UacanadaMap.eventListenersInstance.reload();
    } else {
      UacanadaMap.eventListenersInstance = new registerableListeners(UacanadaMap);
      UacanadaMap.eventListenersInstance.register();
    }

  };




});