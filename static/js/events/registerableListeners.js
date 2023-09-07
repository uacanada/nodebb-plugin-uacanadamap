'use strict';
define('events/registerableListeneres',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

const bottomPanelOffcanvasTriggers = ['hide','show']

class EventListeners {
	constructor(UacanadaMap) {
		this.UacanadaMap = UacanadaMap;
	}


	// Define your named event handlers
  handleZoomEnd() {
	const level = this.UacanadaMap.map.getZoom();
	this.UacanadaMap.api.setClassWithFarawayZoom(level);
  }
  
  handleEnterFullscreen() {
	this.UacanadaMap.placeCardElement = $(this.UacanadaMap.placeCardDivFullScreen);
	this.UacanadaMap.isFullscreenMode = true;
  }
  
  handleExitFullscreen() {
	this.UacanadaMap.placeCardElement = $(this.UacanadaMap.placeCardDiv);
	this.UacanadaMap.isFullscreenMode = false;
  }
  
  handleContextMenu(e) {
	const { UacanadaMap } = this
	const L = this.UacanadaMap.L
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
  
  handleMoveStart() {
	this.UacanadaMap.moveIterations = 1;
  }
  
  handleMove() {
	this.UacanadaMap.moveIterations++;
	if (this.UacanadaMap.moveIterations > 21) {
		this.UacanadaMap.api.hideElements(true)
	 // UacanadaMap.api.expandMap();
	}
  }
  
  handleMoveEnd() {
	this.UacanadaMap.moveIterations++;
	this.UacanadaMap.api.hideElements(false)
  
	if(this.UacanadaMap.api.locationSelection.isVisible){
		this.UacanadaMap.api.locationSelection.showLatLng()
	}
   
  }
  
  handleMarkGeocode(e) {
	let { lat, lng } = e.geocode.center;
	let loc = { latlng: { lat, lng } };
	this.UacanadaMap.api.createMarkerButton(loc, e.geocode);
  }


	bottomOffcanvasTriggers = {
		hide:  () => {
			const bottomPanelOffcanvas = $('#ua-bottom-sheet');
			this.UacanadaMap.api.setBottomSheetSize(0);
			bottomPanelOffcanvas.css('transform',`translate3d(0,100vh,0)`)
		},
		
		show:  () => {
			this.UacanadaMap.api.setBottomSheetSize(1)
			try {
				this.UacanadaMap.swipers.vertical[UacanadaMap.swipers.tabsSlider.activeIndex].slideTo(0)
			} catch (error) {
				
			}
		}
	}

	hasPointerEventSupport = () => {
		if (window.PointerEvent && "maxTouchPoints" in navigator) {
			return "pointerup.uacanadamap";
		} else {
			return "click.uacanadamap";
		}
	};

	handleMainframeClick = (e) => {
		this.UacanadaMap.api.expandMap(`mainframe on click`);
		$("#ua-mainframe").off(
			this.hasPointerEventSupport(),
			this.handleMainframeClick
		);
	};


	

	clickHandler = (e) => {
		// Use the 'click' event to prevent inadvertent triggers when using 'pointerup' event
		const target = $(e.target);
		const { UacanadaMap } = this;
	  
		const clck = (selector) => {
		  const realTarget = target.closest(selector);
		  if (realTarget.length) {
			e.preventDefault();
			return realTarget;
		  }
		  return false;
		};
	  
		const actions = {
		  '.place-with-coordinates': () => UacanadaMap.api.openCards(clck(".place-with-coordinates").attr("data-marker-id"), "distance", false),
		  'a.edit-place': () => UacanadaMap.form.editPlace(clck("a.edit-place").attr("data-topic")),
		  '.newLocationCreateButton': () => UacanadaMap.api.locationSelection.addPlace(),
		  '.newLocationCancelButton': () => UacanadaMap.api.locationSelection.cleanMarker(),
		  '.newLocationOpenMarker': () => UacanadaMap.api.locationSelection.addMarker()
		};
	  
		for (const selector in actions) {
		  if (clck(selector)) {
			actions[selector]();
			return;
		  }
		}
	  };
	  

	touchHandler = (e) => {
		const target = $(e.target);
		const { UacanadaMap } = this;
	  
		const tc = (selector) => {
		  const realTarget = target.closest(selector);
		  if (realTarget.length) {
			e.preventDefault();
			return realTarget;
		  }
		  return false;
		};
	  
		const actions = {
		  '[data-ua-tabtarget]': () => UacanadaMap.api.openCertainTab(tc('[data-ua-tabtarget]')),
		  '#leave-as-loc': () => $("#ua-form-event-holder").html("<p>Ok</p>"),
		  '#ua-conv-to-event': () => $("#ua-form-event-holder").html(UacanadaMap.uaEventPartFormHTML),
		  '.try-locate-me': () => UacanadaMap.api.tryLocate({ fornewplace: false }),
		  '#ua-locate-me': () => UacanadaMap.api.addNewPlace(),
		  '#cardsDown': () => UacanadaMap.api.rotateCards('horizontal'),
		  '.ua-reload-link': () => UacanadaMap.api.reloadMainPage(),
		  '.rotateCards': () => UacanadaMap.api.rotateCards(),
		  'a.ua-sort': () => {
			const sortBy = tc('a.ua-sort').attr('data-ua-sortby');
			if (sortBy) {
			  UacanadaMap.api.openCards(0, sortBy, false);
			  $('#sortby-label').text(sortBy);
			}
		  },
		  '.removeCards': () => {
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
		  if (tc(selector)) {
			actions[selector]();
			return;
		  }
		}
	  };
	  
	  

	register = () => {
		const { UacanadaMap } = this;
		$(document).on(this.hasPointerEventSupport(), this.touchHandler);
		$(document).on('click', this.clickHandler);
		$("#ua-mainframe").on( this.hasPointerEventSupport(), this.handleMainframeClick);
		UacanadaMap.map.on("zoomend", this.handleZoomEnd);
		UacanadaMap.map.on("enterFullscreen", this.handleEnterFullscreen);
		UacanadaMap.map.on("exitFullscreen", this.handleExitFullscreen);
		UacanadaMap.map.on("contextmenu", this.handleContextMenu);
		UacanadaMap.map.on("movestart", this.handleMoveStart);
		UacanadaMap.map.on("move", this.handleMove);
		UacanadaMap.map.on("moveend", this.handleMoveEnd);
		UacanadaMap.hiddenControls.geocoder.on("markgeocode", this.handleMarkGeocode);

		
        const bottomPanelOffcanvas = $('#ua-bottom-sheet');
		bottomPanelOffcanvasTriggers.forEach(triggerName => {
			bottomPanelOffcanvas.on(triggerName+".bs.offcanvas.uacanadamap", this.bottomOffcanvasTriggers[triggerName])
		});

		function resizeend() {
			if (new Date() - UacanadaMap.uaResizetime < UacanadaMap.uaDelta) {
			  setTimeout(resizeend, UacanadaMap.uaDelta);
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
	
	
	
	
		  $('#sortPlacesOffcanvas').on('hide.bs.offcanvas.uacanadamap', function (e) {
			$('#ua-horizontal-buttons-wrapper').removeClass('movedown')
		  });
		  $('#sortPlacesOffcanvas').on('show.bs.offcanvas.uacanadamap', function (e) {
			$('#ua-horizontal-buttons-wrapper').addClass('movedown').removeClass('hidden')
		  });
		


		
		


	};

	remove = () => {
		const { UacanadaMap } = this;
		const bottomPanelOffcanvas = $('#ua-bottom-sheet');
		$(document).off(this.hasPointerEventSupport(), this.touchHandler);
		$(document).off('click', this.clickHandler);
		$("#ua-mainframe").off( this.hasPointerEventSupport(), this.handleMainframeClick );
		
		
		bottomPanelOffcanvasTriggers.forEach(triggerName => { 
			bottomPanelOffcanvas.off(triggerName+".bs.offcanvas", this.bottomOffcanvasTriggers[triggerName])
		});

		UacanadaMap.map.off("zoomend", this.handleZoomEnd);
		UacanadaMap.map.off("enterFullscreen", this.handleEnterFullscreen);
		UacanadaMap.map.off("exitFullscreen", this.handleExitFullscreen);
		UacanadaMap.map.off("contextmenu", this.handleContextMenu);
		UacanadaMap.map.off("movestart", this.handleMoveStart);
		UacanadaMap.map.off("move", this.handleMove);
		UacanadaMap.map.off("moveend", this.handleMoveEnd);
		UacanadaMap.hiddenControls.geocoder.off("markgeocode", this.handleMarkGeocode);

		this.removeAllWithUacanadaNamespace('uacanada')

		for (const key in UacanadaMap.swipers) {
			if (UacanadaMap.swipers[key] instanceof UacanadaMap.Swiper) {
				try {
					UacanadaMap.swipers[key].destroy(true, true);
				} catch (error) {
					this.UacanadaMap.console.log(error);
				}
			 
			}
		}
  
  
	};

	reload = () => {
		this.remove();
		this.register();
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
					this.UacanadaMap.console.log(error);
				}
			  }
			});
		  }
		});
	  }
	  
	  
}
  
  
  return EventListeners;

})