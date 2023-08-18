'use strict';
define('utils/mapFeatures', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

    UacanadaMap.api.debouncedShow = utils.debounce(() => { 
        setTimeout(() => { 
            if($('body').hasClass('cards-opened')){
                // TODO
            }else{
            $('body').removeClass('hiddenElements');
            }
        }, 800); 
    }, 200);

    UacanadaMap.api.hideElements = (forced) => {
        if(forced){
            if($('body').hasClass('uacanada-map-page')){
                $('body').addClass('hiddenElements');
            }else{
                UacanadaMap.api.debouncedShow()
            }
        } else {
            UacanadaMap.api.debouncedShow()
            
        }
    };

   
      
    //   const swiper = new Swiper('.swiper-container');
    //   swiper.on('slideChangeTransitionStart', hideElements);
    //   swiper.on('slideChangeTransitionEnd', showElements);
      

    UacanadaMap.api.fancyHeroText = (() => {

        if(!ajaxify.data.UacanadaMapSettings?.slogans) return;
		let intervalId = null;
		const slogans = ajaxify.data.UacanadaMapSettings.slogans.map(object => object.slogan) 
		const colors = ['#000'];
		let i = 0;
		let j = 0;
		
		// Timing values
		const charDisplayDelay = 80;  // Delay for each character to be displayed
		const fadeInTime = 300;  // Duration of fadeIn effect
		const pauseBetweenSlogans = 2000;  // Pause between displaying each slogan
		const fadeOutTime = 100;  // Duration of fadeOut effect
	
		const displaySlogan = () => {
			const slogan = slogans[i].split("");
			$('#fancy-hero').empty();
	
			slogan.forEach((char, idx) => {
				const span = $(`<span>${char}</span>`);
				span.hide().appendTo('#fancy-hero').delay(idx * charDisplayDelay).fadeIn(fadeInTime);
			});
	
			$('#fancy-hero').css('color', colors[j]);
	
			i = (i + 1) % slogans.length;
			j = (j + 1) % colors.length;
	
			return slogan.length*1.5;
		};
	
		const start = () => {
			if (intervalId !== null) {
				return;
			}
	
			const initialSloganLength = displaySlogan();
			intervalId = setInterval(() => {
				$('#fancy-hero').delay(pauseBetweenSlogans).fadeOut(fadeOutTime, function() {
					$(this).empty().show();
					const nextSloganLength = displaySlogan();
					intervalId = setTimeout(() => {}, nextSloganLength * charDisplayDelay + pauseBetweenSlogans);
				});
			}, initialSloganLength * charDisplayDelay + pauseBetweenSlogans);
		};
	
		const stop = () => {
			if (intervalId !== null) {
				clearInterval(intervalId);
				intervalId = null;
			}
		};
	
		return {
			start,
			stop
		};
	})()
	

    UacanadaMap.api.smoothPanMap = async (dx, dy, duration) => {
        const {map} = UacanadaMap
        const currentCenter = map.getCenter();
    
        const newCenter = map.containerPointToLatLng(
            map.latLngToContainerPoint(currentCenter).add([dx, dy])
        );
    
        // Create a new promise that resolves after a certain duration
        const delay = (duration) => new Promise(resolve => setTimeout(resolve, duration));
    
        // Fly to the new point
        map.flyTo(newCenter, map.getZoom(), {duration: duration});
    
        // Wait for the specified duration plus a small delay, then fly back
        await delay(duration * 1000 + 500);
        map.flyTo(currentCenter, map.getZoom(), {duration: duration});
    }

UacanadaMap.api.getMarkersInView = () => {
    const markers =UacanadaMap.currentSortedMarkers;
    if (!UacanadaMap.map || markers.length === 0) return [];

    let markersInView = [];

    let closestMarker = null;
    let closestDistance = Infinity;

    

    let bounds = UacanadaMap.map.getBounds();
    let center = UacanadaMap.map.getCenter();

    for (let i = 0; i < markers.length; i++) {
        const { lat, lng } = markers[i];
        let markerLatLng = UacanadaMap.L.latLng(lat, lng);
        if (bounds.contains(markerLatLng)) {
            markersInView.push(markers[i]);
        } else {
            // Calculate the distance from the marker to the center
            let distance = center.distanceTo(markerLatLng);
            // If this distance is less than the closest recorded distance,
            // update the closest marker and closest distance.
            if (distance < closestDistance) {
                closestMarker = markers[i];
                closestDistance = distance;
            }
        }
    }

    return { markersInView, closestMarker };
};

UacanadaMap.api.adjustCenterToSomePlace = () => {
        
        const { closestMarker } = UacanadaMap.api.getMarkersInView();
        
        if (closestMarker) {
            const { lat, lng } = closestMarker;
            const closestPlace = [lat, lng];
            UacanadaMap.map.setView(closestPlace, 11);
            return closestPlace;
        } else {

          
            
            return null; 
        }
}



UacanadaMap.api.markerIterator = {
    shouldStop: false,
    async run() {
        const { markersInView } = UacanadaMap.api.getMarkersInView();  
        for (let i = 0; i < markersInView.length; i++) {
            if (this.shouldStop) {
                this.shouldStop = false;  
                break;
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            if(markersInView[i].lat && !markersInView[i].blacklisted){

                const { lat, lng, tid } = markersInView[i];
                //UacanadaMap.map.setView(L.latLng(lat, lng), 11);
                UacanadaMap.map.flyTo(L.latLng(lat, lng), 11);
                console.log({tid})

            };
            
        }
    },
    stop() {
        this.shouldStop = true;
    },
}

})