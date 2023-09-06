'use strict';
define('ui/elementPositions', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
	
	UacanadaMap.api.setContextCss=(css)=>{
		if($('#context-styles')[0]){
		  $('#context-styles').text(css||'');
		  }else{
		  $('head').append('<style id="context-styles" type="text/css">'+css||''+'</style>');
		 }
	  }
	
	UacanadaMap.api.shakeElements=(elems,animationClass)=>{
		for (const elem of elems) {
			$(elem).removeClass(animationClass);  
			setTimeout(() => { $(elem).addClass(animationClass) }, 10)
		}
	}
    
	UacanadaMap.api.updateCSS = () => {
		const {
		
			rightNav,
			leftNav,
			
		} = UacanadaMap.api.getDivSizes();
		
		const bodyWithMap = "body." + UacanadaMap.mapRoomClass;
		
		
	
		const styles = ` #uacamap-wrapper {
			  	padding-right: ${rightNav}px !important;
				padding-left: ${leftNav}px !important;
			 }

				@media screen and (min-width: 1899px) and (min-height: 1000px) {
					html.ua-noscroll ${bodyWithMap} {
					overflow-y: inherit !important;
					}
				}`;

				
				

		if ($("#manipulativestyle")[0]) {
			$("#manipulativestyle").text(styles);
		} else {
			$("head").append(
				'<style id="manipulativestyle" type="text/css">' + styles + "</style>"
			);
		}

		if (UacanadaMap.map && UacanadaMap.map.invalidateSize) {
			setTimeout(() => {
				UacanadaMap.map.invalidateSize();
				UacanadaMap.api.fitElementsPosition();
			}, 120);
		}
	};


    UacanadaMap.api.getDivSizes=()=>{
        var screenH = $(window).innerHeight();
        var screenW = $(window).innerWidth();
        var rightNav = $('nav.sidebar.sidebar-right').outerWidth();
        var leftNav = $('nav.sidebar.sidebar-left').outerWidth();
        var navRealH = $( '.bottombar-nav' ).outerHeight() || 0;
        var bottomButtonsH = $('#ua-horizontal-buttons-wrapper').outerHeight() || 0;
		var contextButton = $('#ua-context-buttons-wrapper').outerHeight() || 0;
        var placeCardH = $(UacanadaMap.placeCardDiv).outerHeight() || 0; 
		var visibleMap = $('#uacamap').outerHeight() || 0;
     	var bottomElementsH =  Math.floor(navRealH+placeCardH);
        var mapHalf = Math.floor(visibleMap / 2);
        var visibleMapWhenCards = Math.floor(visibleMap - placeCardH - bottomButtonsH);
        var onePercentH = Math.floor(screenH / 100);
        var markerOffset = (visibleMapWhenCards < mapHalf) ? Math.floor(mapHalf-visibleMapWhenCards) : 0;
        var isDesktop = (screenW > 800 || screenW > screenH)? true : false;
        var cardStackSize = Math.floor((screenW - rightNav - leftNav)/500);
        window.UCM_cachedElementSizes = {screenH,screenW,bottomButtonsH,navRealH,rightNav,leftNav,placeCardH,bottomElementsH,visibleMap,mapHalf,markerOffset,onePercentH,isDesktop,cardStackSize,contextButton}
        return  window.UCM_cachedElementSizes;
      };

    UacanadaMap.api.toggleFs=(force)=>{ if (UacanadaMap.isFullscreenMode || force) UacanadaMap.map.toggleFullscreen()}


    UacanadaMap.api.fitElementsPosition = (latlng) => {
		
		setTimeout(() => {
			
			const {
				
				contextButton,
				
				screenW,
				
				
				placeCardH,
				onePercentH,
			} = UacanadaMap.api.getDivSizes();

			let zoomControlsPosition = { bottom: `5rem`};
           


			if($(UacanadaMap.placeCardDiv).hasClass('verticalCards') && screenW>700){

			} else {

				
				zoomControlsPosition = {  bottom: `${Math.floor(placeCardH+contextButton)}px`};
			
			}

			

			$(".leaflet-bottom").css(zoomControlsPosition);
			

			if (latlng) {
				const markerOffset = placeCardH > Math.floor(onePercentH * 50) ? Math.floor(onePercentH * 30) : -50
				
				

						
				UacanadaMap.api.moveMarkerToTop(latlng, markerOffset);
			}
			UacanadaMap.api.detectMapViewport();
			UacanadaMap.map.invalidateSize();
		}, 55);
	};



     


})