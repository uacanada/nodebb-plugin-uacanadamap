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
			screenH,
			navRealH,
			screenW,
			rightNav,
			leftNav,
			visibleMap,
			bottomButtonsH,
		} = UacanadaMap.api.getDivSizes();
		const thirdScreen = Math.floor(screenH * 0.6);
		const mapWidth = Math.floor(screenW - rightNav - leftNav);
		const bodyWithMap = "body." + UacanadaMap.mapRoomClass;
		const bodyWithMapTouched = bodyWithMap + ".map-touched";
		const forcedMapHeight = Math.floor(screenH - navRealH);
		const mapMainFrame = screenW > 990 ? forcedMapHeight : forcedMapHeight;
		const mapWrapperHeight = forcedMapHeight;
		const mapHeight = forcedMapHeight;
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
		var magicButton = $('#ua-magic-button-wrapper').outerHeight() || 0;
        var placeCardH = $(UacanadaMap.placeCardDiv).outerHeight() || 0; 
        var sidebarH = Math.floor($('.opened.folded-sidebar').outerHeight()) || 0;
        var sidebarW = Math.floor($('.sidepanel.opened').outerWidth(true)) || 0;
        var visibleMap = $('#uacamap').outerHeight() || 0;
        var sidepanelOrButtons = sidebarH>1 ? sidebarH:bottomButtonsH; 
        var bottomElementsH =  Math.floor(navRealH+placeCardH+sidepanelOrButtons);
        var mapHalf = Math.floor(visibleMap / 2);
        var visibleMapWhenCards = Math.floor(visibleMap - sidebarH - placeCardH - bottomButtonsH);
        var onePercentH = Math.floor(screenH / 100);
        var markerOffset = (visibleMapWhenCards < mapHalf) ? Math.floor(mapHalf-visibleMapWhenCards) : 0;
        var bottomMargin = sidebarH ? sidebarH :  ($('.sidepanel').hasClass('opened') ) ? bottomButtonsH: bottomButtonsH; 
        var isDesktop = (screenW > 800 || screenW > screenH)? true : false;
        var cardStackSize = Math.floor((screenW - rightNav - leftNav)/500);
        const panelDragButtonH = $('#ua-dragger .line-button').outerHeight(); 
        window.UCM_cachedElementSizes = {screenH,screenW,bottomButtonsH,navRealH,rightNav,leftNav,sidebarH,sidebarW,placeCardH,bottomMargin,bottomElementsH,visibleMap,mapHalf,markerOffset,onePercentH,isDesktop,cardStackSize,panelDragButtonH,magicButton}
        return  window.UCM_cachedElementSizes;
      };

    UacanadaMap.api.toggleFs=(force)=>{ if (UacanadaMap.isFullscreenMode || force) UacanadaMap.map.toggleFullscreen()}


    UacanadaMap.api.fitElementsPosition = (latlng) => {
		
		setTimeout(() => {
			
			const {
				bottomButtonsH,
				magicButton,
				bottomElementsH,
				sidebarH,
				sidebarW,
				screenH,
				screenW,
				rightNav,
                leftNav,
				navRealH,
				placeCardH,
				onePercentH,
			} = UacanadaMap.api.getDivSizes();

			let cardsOffset = Math.floor(bottomButtonsH + sidebarH + 5);
			let zoomControlsPosition = { bottom: `5rem`};
            let elementOffsetWhenSidebarOpened = (screenW > 500 + sidebarW) ?  sidebarW : 0;
            const leftOffset = {left:`${elementOffsetWhenSidebarOpened}px`} 

            $("#mapStatusLine").css(leftOffset);
			$(UacanadaMap.placeCardDiv).css(leftOffset);
            $('#ua-horizontal-buttons-wrapper').css(leftOffset);


			if($(UacanadaMap.placeCardDiv).hasClass('verticalCards') && screenW>700){

			} else {

				
				zoomControlsPosition = {  bottom: `${Math.floor(navRealH+placeCardH+magicButton)}px`};
			
			}

			if ($(".sidepanel").hasClass("opened")) {
				$("body").addClass("ua-sidepanel-opened");

				if (elementOffsetWhenSidebarOpened) {
					cardsOffset = bottomButtonsH;
					

				} else {
					cardsOffset = sidebarH;
				}
			} else {
				$("body").removeClass("ua-sidepanel-opened");
			}

			$(".leaflet-bottom").css(zoomControlsPosition);
			

			if (latlng) {
				const markerOffset = placeCardH > Math.floor(onePercentH * 50) ? Math.floor(onePercentH * 30) : -50
				
				
					// sidebarH > 50 && screenW < sidebarW + 500
					// 	? Math.floor(onePercentH * 30)
					// 	: screenH > 1600
					// 	? -100
					// 	: Math.floor(onePercentH * 10);

						
				UacanadaMap.api.moveMarkerToTop(latlng, markerOffset);
			}
			UacanadaMap.api.detectMapViewport();
			UacanadaMap.map.invalidateSize();
		}, 55);
	};



    UacanadaMap.api.sidebarIsOpened=()=>{ return $("#ua-sidepanel").hasClass("opened")};

      UacanadaMap.api.niceShown=()=>{
        setTimeout(() => {
          $('#ua-splash-text').remove();
          $('#ua-splash-bg').remove();
        }, 4000);
      
       if( $('#ua-splash-text').hasClass('nice-remove') ) return;
        $('#ua-splash-text').addClass('nice-shown');
        $('#ua-splash-bg').addClass('nice-shown');
      
      }


})