'use strict';
define('events/registerableListeneres',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 


class EventListeners {
	constructor(UacanadaMap) {
		this.UacanadaMap = UacanadaMap;
		this.optimizedScrollEvent;
		this.throttledScroll;
	}

	hasPointerEventSupport = () => {
		if (window.PointerEvent && "maxTouchPoints" in navigator) {
			return "pointerup";
		} else {
			return "click";
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

		if ((c = clck(".blogger-loc"))) {

			if (!UacanadaMap.isSidebarFolded) {   UacanadaMap.api.closeMapSidebar(false);  }
			UacanadaMap.api.openCards(c.attr("data-marker-id"), "distance", false);

		} else if ((c = clck("a.edit-place"))) {

			UacanadaMap.form.editPlace(c.attr("data-topic"));

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
    } else if (tc("#ua-ctx-button")) {
        UacanadaMap.api.ctxButton({ action: target.attr("data-ua-trigger") });
   
	
 
	} else if(tc("#cardsDown")){
		UacanadaMap.api.rotateCards('horizontal');
	} else if(tc("a.ua-sort")){
		
        const sort_by = tc("a.ua-sort").attr('data-ua-sortby')
		if(sort_by){
			//UacanadaMap.api.sortMarkers(null,sort_by,null)
			UacanadaMap.api.openCards(0,sort_by,false)
			$('#sortby-label').text(sort_by) 
		}
		UacanadaMap.console.log(tc("a.ua-sort").attr('data-ua-sortby'))
		 


	} else if(tc("#rotateCards")){
		UacanadaMap.api.rotateCards();
	} else if (tc("#pull-out-button")) {
        UacanadaMap.api.expandMap("#pull-out-button on click");
    } else if (tc("#modal-place-link")) {
       // $("#ua-place-modal .dyn-content").html("...");
    } else if (tc(".ua-reload-link")) {
        UacanadaMap.api.reloadMainPage();
    } else if (tc("a.sidebar-tab-link")) {
        UacanadaMap.api.onTabChange({
            tab: Number(tc("a.sidebar-tab-link").attr("data-tab-link").replace("tab-", "")),
        });
    } else if (tc("#uaAddNewLoc")) {
        UacanadaMap.api.closeMapSidebar(true);
    } else if (tc("#close-mapsidepanel")) {
        UacanadaMap.api.closeMapSidebar(true);
    } else if (tc('#fold-mapsidepanel[data-ua-fold="fold"]')) {
        UacanadaMap.api.foldSidebar(true);
    } else if (tc('#fold-mapsidepanel[data-ua-fold="unfold"]')) {
        UacanadaMap.api.foldSidebar(false);
    } else if (tc("#chatters")) {
        openMapSidebar(6);
    } else if (tc(".removeCards")) {
        e.preventDefault();
        UacanadaMap.api.removeCards();
		UacanadaMap.api.magicButtonText({text:'Reset filters...',delay:800,to:UacanadaMap.magicButton.router.main})
    } else if (tc("#show-only-map-items")) {
        UacanadaMap.api.rewriteTabs("onlyVisibleArea");
        UacanadaMap.api.foldSidebar(true);
        UacanadaMap.api.openMapSidebar(1);
        UacanadaMap.showOnlyArea = true;
    } else if (tc("#show-all-map-items")) {
        UacanadaMap.showOnlyArea = false;
        UacanadaMap.api.rewriteTabs("anyLocation");
        UacanadaMap.api.openSidebarForCat(false);
    } else if (tc(".show-all-places")) {
        UacanadaMap.api.rewriteTabs("anyLocation");
        UacanadaMap.api.openSidebarForCat(false);
        UacanadaMap.showOnlyArea = false;
    } else if (tc(".ua-category-button")) {
        return UacanadaMap.api.openSidebarForCat(tc(".ua-category-button").attr("data-ua-cat"));
    } else if (tc(".sidepanel-toggle-button")) {
        const isNeedOpen = $("#ua-sidepanel").hasClass("opened");
        UacanadaMap.api.animateScroll();
        if (isNeedOpen) {
            UacanadaMap.api.openMapSidebar(null);
            UacanadaMap.api.fitElementsPosition();
        } else {
            UacanadaMap.api.hideBottomsAndBlockScroll(false);
            UacanadaMap.api.closeMapSidebar(false);
        }
    }
	};

	register = () => {
		$(document).on(this.hasPointerEventSupport(), this.touchHandler);
		$(document).on('click', this.clickHandler);
		$("#ua-mainframe").on(
			this.hasPointerEventSupport(),
			this.handleMainframeClick
		);

		

		this.throttledScroll = this.throttle("scroll", "optimizedScroll");
		this.optimizedScrollEvent = new Event("optimizedScroll");

		window.addEventListener("optimizedScroll", this.onOptimizedScroll);
	};

	remove = () => {
		$(document).off(this.hasPointerEventSupport(), this.touchHandler);
		$(document).off('click', this.clickHandler);
		$("#ua-mainframe").off(
			this.hasPointerEventSupport(),
			this.handleMainframeClick
		);
		

		window.removeEventListener("optimizedScroll", this.onOptimizedScroll);
		window.removeEventListener("scroll", this.throttledScroll);
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
}
  
//   const eventListenersInstance = new EventListeners(UacanadaMap, map, L);
//   eventListenersInstance.eventListeners();
  
//   // you can use the following methods to remove or re-add all event listeners
//   eventListenersInstance.removeAllListeners();
//   eventListenersInstance.eventListeners();
  
  return EventListeners;

})