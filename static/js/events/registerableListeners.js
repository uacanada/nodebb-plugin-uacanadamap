'use strict';
define('events/registerableListeneres',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

const bottomPanelOffcanvasTriggers = ['hide','show']

class EventListeners {
	constructor(UacanadaMap) {
		this.UacanadaMap = UacanadaMap;
		this.optimizedScrollEvent;
		this.throttledScroll;
	}

	bottomOffcanvasTriggers = {
		hide:  () => {
			const bottomPanelOffcanvas = $('#ua-bottom-sheet');
			UacanadaMap.api.setBottomSheetSize(0);
			bottomPanelOffcanvas.css('transform',`translate3d(0,100vh,0)`)
		},
		
		show:  () => {
			UacanadaMap.api.setBottomSheetSize(1)
			try {
				UacanadaMap.swipers.vertical[UacanadaMap.swipers.tabsSlider.activeIndex].slideTo(0)
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
		/* In this context, we employ the old 'click' event to prevent inadvertent triggers that can occur when we utilize the 'pointerup' event. */
		const target = $(e.target);
		const UacanadaMap = this.UacanadaMap;
		let c;
		const clck = (selector) => {
			const realtarget =  target.closest(selector);
			if(realtarget.length){
				e.preventDefault(); 
				return realtarget
			}else{
				return false
			}
			
		}

		if ((c = clck(".place-with-coordinates"))) {
			UacanadaMap.api.openCards(c.attr("data-marker-id"), "distance", false);

		} else if ((c = clck("a.edit-place"))) {

			UacanadaMap.form.editPlace(c.attr("data-topic"));

		} else if ((c = clck(".newLocationCreateButton"))) {
			UacanadaMap.api.locationSelection.addPlace()
		} else if ((c = clck(".newLocationCancelButton"))) {
			UacanadaMap.api.locationSelection.cleanMarker()
		} else if ((c = clck(".newLocationOpenMarker"))) {
			UacanadaMap.api.locationSelection.addMarker()
		}
      
	};

	touchHandler = (e) => {
		const target = $(e.target);
		const UacanadaMap = this.UacanadaMap;
		let t;

      const tc = (selector) => {
		const realtarget =  target.closest(selector);
		if(realtarget.length){
			e.preventDefault(); 
			return realtarget
		} else{
			return false
		}
         
      
      }


	  if((t= tc('[data-ua-tabtarget]'))){
		
		UacanadaMap.api.openCertainTab(t)
		

	} else
	if (tc("#leave-as-loc")) {
        $("#ua-form-event-holder").html("<p>Ok</p>");
    } else if (tc("#ua-conv-to-event")) {
        $("#ua-form-event-holder").html(UacanadaMap.uaEventPartFormHTML);
    } else if (tc(".try-locate-me")) {
        UacanadaMap.api.tryLocate({ fornewplace: false });
    } else if (tc("#ua-locate-me")) {
        UacanadaMap.api.addNewPlace();
	} else if(tc("#cardsDown")){
		UacanadaMap.api.rotateCards('horizontal');
	} else if(tc("a.ua-sort")){
		
        const sort_by = tc("a.ua-sort").attr('data-ua-sortby')
		if(sort_by){
			//UacanadaMap.api.sortMarkers(null,sort_by,null)
			UacanadaMap.api.openCards(0,sort_by,false)
			$('#sortby-label').text(sort_by) 
		}
		 


	} else if(tc(".rotateCards")){
		UacanadaMap.api.rotateCards();
	} else if (tc("#modal-place-link")) {
       // $("#ua-place-modal .dyn-content").html("...");
    } else if (tc(".ua-reload-link")) {
        UacanadaMap.api.reloadMainPage();
    
    } else if (tc(".removeCards")) {
        e.preventDefault();
        UacanadaMap.api.removeCards();
		UacanadaMap.api.contextButtonText({text:'Reset filters...',delay:800,to:UacanadaMap.contextButton.router.main})
    } 
	};

	register = () => {
		$(document).on(this.hasPointerEventSupport(), this.touchHandler);
		$(document).on('click.uacanadamap', this.clickHandler);
		$("#ua-mainframe").on( this.hasPointerEventSupport(), this.handleMainframeClick);

		

		// this.throttledScroll = this.throttle("scroll", "optimizedScroll");
		// this.optimizedScrollEvent = new Event("optimizedScroll");
        //window.addEventListener("optimizedScroll", this.onOptimizedScroll);
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
		const bottomPanelOffcanvas = $('#ua-bottom-sheet');
		$(document).off(this.hasPointerEventSupport(), this.touchHandler);
		$(document).off('click', this.clickHandler);

		$("#ua-mainframe").off(
			this.hasPointerEventSupport(),
			this.handleMainframeClick
		);
		

		// window.removeEventListener("optimizedScroll", this.onOptimizedScroll);
		// window.removeEventListener("scroll", this.throttledScroll);
		
		bottomPanelOffcanvasTriggers.forEach(triggerName => {
			bottomPanelOffcanvas.off(triggerName+".bs.offcanvas", this.bottomOffcanvasTriggers[triggerName])
		});

		$('#sortPlacesOffcanvas').on('hide.bs.offcanvas.uacanadamap')
	};

	reload = () => {
	
		this.remove();
		this.register();
	};

	throttle = (type, name, obj) => {
		obj = obj || window;
		let running = false;
		const func = () => {
			if (running) {
				return;
			}
			running = true;
			requestAnimationFrame(() => {
				obj.dispatchEvent(this.optimizedScrollEvent);
				running = false;
			});
		};
		obj.addEventListener(type, func);
		return func;
	};

	onOptimizedScroll = () => {
		const minScrollInterval = 33;
		if (performance.now() - this.lastScrollTime < minScrollInterval) {
			return;
		}

		this.UacanadaMap.api.detectMapViewport();
		this.lastScrollTime = performance.now();
	};

	removeEventListenersWithUacanadaNamespace = () => {
		const allElements = $('*');
		allElements.each(function() {
		  const elem = $(this);
		  const events = $._data(this, "events");
		  if (!events) return;
	  
		  for (const eventType in events) {
			const handlers = events[eventType];
			handlers.forEach(function(handlerObj) {
			  // Check both namespace and handlerObj.namespace for 'uacanada'
			  if (handlerObj.namespace.indexOf('uacanada') !== -1 || eventType.indexOf('uacanada') !== -1) {
				elem.off(`${eventType}.${handlerObj.namespace}`);
			  }
			});
		  }
		});
	  }
	  
}
  
  
  return EventListeners;

})