'use strict';
define('events/registerableListeneres',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

const bottomPanelOffcanvasTriggers = ['hide','show']

class EventListeners {
	register = () => {
		$(document).on(this.hasPointerEventSupport(), this.touchHandler);
		$(document).on('click', this.clickHandler);
		$("#ua-mainframe").on( this.hasPointerEventSupport(), this.handleMainframeClick);
		this.toggleMapEvents(true);
		UacanadaMap.hiddenControls.geocoder.on("markgeocode", this.handleMarkGeocode);
		
		

		function resizeend() {
			if (new Date() - UacanadaMap.uaResizetime < UacanadaMap.uaDelta) {
				UacanadaMap.setTimeout(resizeend, UacanadaMap.uaDelta);
			} else {
			  UacanadaMap.uaResizetimeout = false;
			  UacanadaMap.api.updateCSS();
			}
		  }
		
		  $(window).on('resize.uacanadamap', function () {
			if (UacanadaMap.map) {
			  UacanadaMap.api.detectMapViewport();
			  UacanadaMap.uaResizetime = new Date();
			  if (UacanadaMap.uaResizetimeout === false) {
				UacanadaMap.uaResizetimeout = true;
				setTimeout(resizeend, UacanadaMap.uaDelta);
			  }
			}
		  });
		
		  $("body").on('classChange.uacanadamap', (el, classes) => {
			if ($("body").hasClass(UacanadaMap.mapRoomClass)) {
			  UacanadaMap.api.detectMapViewport();
			}
		  });
		
		  $(document).on("change.uacanadamap", "#eventSwitcher", function () {
			if ($(this).is(":checked")) {
			  $("#ua-form-event-holder").html(UacanadaMap.uaEventPartFormHTML);
			} else {
			  $("#ua-form-event-holder").html("");
			}
		  });
		  $(document).on("change.uacanadamap", 'input[name="socialtype"]', function () {
			UacanadaMap.form.socialTypeIconAdjust()
		  });
		  $(document).on("change.uacanadamap", "#ua-location-cover-img", function () {
			var fileReader = new FileReader();
			fileReader.onload = function () {
			  var data = fileReader.result;
			  $("#ua-form-img-holder").html('<img src="' + data + '"/>');
			};
			fileReader.readAsDataURL($("input#ua-location-cover-img")[0].files[0]);
		  });
		  $(document).on("change.uacanadamap", "#location-category-filter", function () {
			UacanadaMap.api.setCategoryAndOpenCards($(this).val());
		  });
		  $(document).on("change.uacanadamap", "#location-sort", function () {
			UacanadaMap.api.setCategoryAndOpenCards($("#location-category-filter").val());
		  });
	
	
	
		
		  $('#sortPlacesOffcanvas').on('hide.bs.offcanvas', this.sortPlacesOffcanvasHide);
		  $('#sortPlacesOffcanvas').on('show.bs.offcanvas', this.sortPlacesOffcanvasShow);
		


		  $('#scrollableBottomPanel').on('scroll', this.bottomPanelScrollHandler);

		  UacanadaMap.api.swipeZonesRegister()
                    
		 
		


	};

	remove = () => {


		try {
			$(document).off(this.hasPointerEventSupport(), this.touchHandler);
		$(document).off('click', this.clickHandler);
		$("#ua-mainframe").off( this.hasPointerEventSupport(), this.handleMainframeClick );
		
		
		
		$('#sortPlacesOffcanvas').off('hide.bs.offcanvas', this.sortPlacesOffcanvasHide);
		$('#sortPlacesOffcanvas').off('show.bs.offcanvas', this.sortPlacesOffcanvasShow);

		this.toggleMapEvents(false);
		UacanadaMap.hiddenControls.geocoder.off("markgeocode", this.handleMarkGeocode);

		this.removeAllWithUacanadaNamespace('uacanada')

		for (const key in UacanadaMap.swipers) {
			if (UacanadaMap.swipers[key] instanceof UacanadaMap.Swiper) {
				try {
					UacanadaMap.swipers[key].destroy(true, true);
				} catch (error) {
					// UacanadaMap.console.log(error);
				}
			 
			}
		}
		} catch (error) {
			UacanadaMap.console.log(error)
		}
		$('#scrollableBottomPanel').off('scroll',this.bottomPanelScrollHandler);
		UacanadaMap.api.swipeZonesUnregister()
  
  
	};


	removeAllWithUacanadaNamespace = (nameSpace) => {
		// Select all elements, including window and document
		const allElements = $('*, window, document');
		allElements.each(function() {
		  const elem = $(this);
		  const events = $._data(this, "events");
		  if (!events) return;
		  for (const eventType in events) {
			const handlers = events[eventType];
			handlers.forEach(function(handlerObj) {
			  // Check both namespace and handlerObj.namespace for 'uacanada'
			  if(handlerObj?.namespace){
				try {
				  if (handlerObj.namespace.indexOf(nameSpace) !== -1 || eventType?.indexOf(nameSpace) !== -1) {
					const trigger = `${eventType}.${handlerObj.namespace}`;
					elem.off(trigger);
				  } 
				} catch (error) {
					UacanadaMap.console.log(error);
				}
			  }
			});
		  }
		});
	  }
	  

	  reload = () => {
		this.remove();
		this.register();
	};


	sortPlacesOffcanvasHide(){
		$('#ua-horizontal-buttons-wrapper').removeClass('movedown')
	}
	sortPlacesOffcanvasShow(){
		$('#ua-horizontal-buttons-wrapper').addClass('movedown').removeClass('hidden')
	}

	

zoomendHandler() {
	const level = UacanadaMap.map.getZoom();
	UacanadaMap.api.setClassWithFarawayZoom(level);
  }
  
  enterFullscreenHandler() {
	
	UacanadaMap.isFullscreenMode = true;
  }
  
  exitFullscreenHandler() {
	
	UacanadaMap.isFullscreenMode = false;
  }
  
  contextmenuHandler(e) {
	
	const L = UacanadaMap.L
	if (UacanadaMap.currentmarker) {
		UacanadaMap.map.removeLayer(UacanadaMap.currentmarker);
	}
	
	UacanadaMap.currentmarker = L.marker(e.latlng, { icon:L.divIcon({
		className: "ua-pin-icon",
		html: '<div class="position-relative"><span class="ua-bounce-animated-pin">📍</span></div>',
		iconSize: [25, 25],
		iconAnchor: [15, 30],
		popupAnchor: [5, -5],
	  }) }).addTo(UacanadaMap.map);
  }
  
  movestartHandler() {
	try {
		UacanadaMap.moveIterations = 1;
	} catch (error) {
		UacanadaMap.console.log(error)
	}
	
  }
  
  moveHandler() {
	
	UacanadaMap.moveIterations++;
	if (UacanadaMap.moveIterations > 21) {
		UacanadaMap.api.hideElements(true)
	 // UacanadaMap.api.expandMap();
	}
  }
  
  moveendHandler() {
	UacanadaMap.moveIterations++;
	UacanadaMap.api.hideElements(false)
  
	if(UacanadaMap.api.locationSelection.isVisible){
		UacanadaMap.api.locationSelection.showLatLng()
	}
   
  }
  
  handleMarkGeocode(e) {
	let { lat, lng } = e.geocode.center;
	let loc = { latlng: { lat, lng } };
	UacanadaMap.api.createMarkerButton(loc, e.geocode);
  }


	hasPointerEventSupport = () => {
		if (window.PointerEvent && "maxTouchPoints" in navigator) {
			return "pointerup.uacanadamap";
		} else {
			return "click.uacanadamap";
		}
	};

	handleMainframeClick = (e) => {
		UacanadaMap.api.expandMap(`mainframe on click`);
		$("#ua-mainframe").off(
			this.hasPointerEventSupport(),
			this.handleMainframeClick
		);
	};


	bottomPanelScrollHandler = utils.debounce(() => {
		const $panel = $('#innerScrollPanel');
		const currentScrollTop = $panel.scrollTop();
	
		if (currentScrollTop < 25) {
		  UacanadaMap.api.scrollableBottomPanel.close();
		  UacanadaMap.previousScrollHeight = 0;
		  return;
		}
	
		const isScrollingDown = UacanadaMap.previousScrollHeight < currentScrollTop - 10;
		const isWithinViewHeight = currentScrollTop < Math.floor(window.innerHeight / 2);
	
		if (currentScrollTop > UacanadaMap.PANEL_SCROLL_HEIGHT && isScrollingDown && isWithinViewHeight) {
		  const updatedScrollHeight = Math.floor(window.innerHeight * 0.7);
		  $panel.animate({ scrollTop: updatedScrollHeight }, 300, 'swing');
		  UacanadaMap.previousScrollHeight = updatedScrollHeight;
		} else {
			UacanadaMap.previousScrollHeight = currentScrollTop;
		}
	  }, 100);
	

	clickHandler = (e) => {
		// Use the 'click' event to prevent inadvertent triggers when using 'pointerup' event
		const target = $(e.target);
		
	  
		const findEl = (selector) => {
		  const realTarget = target.closest(selector);
		  if (realTarget.length) {
			e.preventDefault();
			return realTarget;
		  }
		  return false;
		};
	  
		const actions = {
		  '.edit-place': 				() => UacanadaMap.form.editPlace(findEl("a.edit-place").attr("data-topic")),
		  '.place-with-coordinates': 	() => UacanadaMap.api.openCards(findEl(".place-with-coordinates").attr("data-marker-id"), "distance", false),
		  '.newLocationCreateButton': 	() => UacanadaMap.api.locationSelection.addPlace(),
		  '.newLocationCancelButton': 	() => UacanadaMap.api.locationSelection.cleanMarker(),
		  '.newLocationOpenMarker': 	() => UacanadaMap.api.locationSelection.addMarker(),
		  '.showBottomPanel':			() => UacanadaMap.api.scrollableBottomPanel.open(findEl('[data-ua-content-id]')),
		 // '.leaflet-map-pane':		    () => UacanadaMap.api.scrollableBottomPanel.close() 
		};
	  
		for (const selector in actions) {
		  if (findEl(selector)) {
			actions[selector]();
			return;
		  }
		}
	  };
	  

	touchHandler = (e) => {
		const target = $(e.target);
		const findEl = (selector) => {
			const realTarget = target.closest(selector);
			if (realTarget.length) {
			  e.preventDefault();
			  return realTarget;
			}
			return false;
		  };
	  
		const actions = {
		  '#leave-as-loc': 			() => $("#ua-form-event-holder").html(""),
		  '#ua-conv-to-event': 		() => $("#ua-form-event-holder").html(UacanadaMap.uaEventPartFormHTML),
		  '.try-locate-me': 		() => UacanadaMap.api.tryLocate({ fornewplace: false }),
		  '#ua-locate-me': 			() => UacanadaMap.api.addNewPlace(),
		  '#cardsDown': 			() => UacanadaMap.api.rotateCards('horizontal'),
		  '.ua-reload-link': 		() => UacanadaMap.api.reloadMainPage(),
		  '.rotateCards': 			() => UacanadaMap.api.rotateCards(),
		  '.ua-sort': 				() => {
			const sortBy = findEl('a.ua-sort').attr('data-ua-sortby');
			if (sortBy) {
			  UacanadaMap.api.openCards(0, sortBy, false);
			  $('#sortby-label').text(sortBy);
			}
		  },
		  '.removeCards': 			() => {
			e.preventDefault();
			UacanadaMap.api.removeCards();
			UacanadaMap.api.contextButtonText({
			  text: 'Reset filters...',
			  delay: 800,
			  to: UacanadaMap.contextButton.router.main
			});
		  }
		};
	  
		for (const selector in actions) {
		  if (findEl(selector)) {
			actions[selector]();
			return;
		  }
		}
	  };

	toggleMapEvents = (enable = true) => {
		
		const eventList = [
		  "zoomend",
		  "enterFullscreen",
		  "exitFullscreen",
		  "contextmenu",
		  "movestart",
		  "move",
		  "moveend"
		];
	  
		eventList.forEach((event) => {
		try {

			
			const handler = this[event+'Handler'];
    		
		
			if (enable) {
				UacanadaMap.map.on(event,handler);
			  } else {
				UacanadaMap.map.off(event,handler);
			  }
		} catch (error) {
			UacanadaMap.console.log(error)
		}
		
		});
	  }
	  
	 

	  
	  
}
  
  
  return EventListeners;

})