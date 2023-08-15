'use strict';

window.UCM_cachedElementSizes = {}; // TODO: remove dependencies


define('uacanadamap/variables',function(module) { 


const UacanadaMap = {


  // TODO : move to ACP 
  socialMediaIcons: {
    undefined: '<i class="fa-brands fa-chrome pe-1"></i>',
    "": '<i class="fa-brands fa-chrome pe-1"></i>',
    facebook: '<i class="fa-brands fa-facebook-f pe-1" style="color:#0065ff"></i>',
    youtube: '<i class="fa-brands fa-youtube pe-1" style="color:red"></i>',
    instagram: '<i class="fa-brands fa-instagram pe-1" style="color:#f5996e"></i>',
    linkedin: '<i class="fa-brands fa-linkedin-in pe-1" style="color: #064574;"></i>',
    twitter: '<i class="fa-brands fa-twitter pe-1" style="color: #1DA1F2;"></i>',
    pinterest: '<i class="fa-brands fa-pinterest-p pe-1" style="color: #BD081C;"></i>',
    whatsapp: '<i class="fa-brands fa-whatsapp pe-1" style="color: #25D366;"></i>',
    reddit: '<i class="fa-brands fa-reddit-alien pe-1" style="color: #FF4500;"></i>',
    tumblr: '<i class="fa-brands fa-tumblr pe-1" style="color: #36465D;"></i>',
    snapchat: '<i class="fa-brands fa-snapchat-ghost pe-1" style="color: #FFFC00;"></i>',
    discord: '<i class="fa-brands fa-discord pe-1" style="color: #5865F2;"></i>',
    telegram: '<i class="fa-brands fa-telegram pe-1" style="color:#4faaca"></i>'

},


  offcanvas: {
    modes: [
      "sheet-close",
      "sheet-half",
      "sheet-big",
      "sheet-full",
      "sheet-above",
    ],
  },

  swipeZones: [
    "ua-place-modal",
    "ua-sidepanel",
    "ua-map-cards",
    "ua-map-cards-fullscreen",
    "ua-short-wrapper",
    "ua-mainframe",
    "ua-welcome-description",
    "ua-splash-bg",
    "ua-dragger",
  ],
  weekdays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],
  months: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  markersClasses: ["no-class"], // TODO: remove

  placeCardDiv: "#ua-map-cards-fullscreen",
  placeCardDivFullScreen: "#ua-map-cards-fullscreen",

  mapRoomClass: "uacanada-map-page",
  mapLayers: {},
  hiddenControls: {},
  mapControlsUnused: {},
  userDeniedGeo: false,
  latestLocation: undefined,
  currentmarker: undefined,
  addedMarker: undefined,
  placeCardElement: "",
  uaEventPartFormHTML: "",
  recoveredOldButtons: "",
  contextMenuMarker: {},
  isFullscreenMode: false,
  lastPlaceMarker: null,
  htmlBuffer: "",
  cardsCarousel: {},
  pointerMarker: {},
  previousPlacesArray: [],
  mapTabsCount: 0,
  allPlaces: {},
  allPlacesArray: [],
  currentSortedMarkers: [],
  markersIconsmapper: {},
  tabTitles: {},
  categoryMapper: {},
  eventCatMapper: {},
  provinceMapper: {},
  markerGroups: {},
  choosedLocation: [],
  tabEventsArray: [],
  tabItemsArray: [],
  recentPlaces: [],
  showCtxButtonOnFilter: false,
  previousTid: 0,
  initUaMapCount: 0,
  showOnlyArea: false,
  isSidebarFolded: false,

  blockFlood: false,
  mapExpanded: false,
  blockFloodInterval: null,

  countx: 0,
  scrolListenerExist: undefined,
  uaResizetime: undefined,
  uaResizetimeout: false,
  uaDelta: 200,
  preventMultiCall: false,
  moveIterations: 0,
  horizontalButtons: {},
  api: {},
modules:{},
  Swiper: null,
  form: {
    tags: [],
  },

  TEMP: {},
  sheetPanels: {},
  swipers: {},
  routers: {},
};

module.exports = UacanadaMap;

})