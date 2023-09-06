'use strict';
define('ui/swipeDetectors',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

UacanadaMap.api.listenSwipes = (elements) => {
    let touchstartX = 0;
    let touchstartY = 0;
    let touchendX = 0;
    let touchendY = 0;
    const swipeResistance = Number(ajaxify.data.UacanadaMapSettings.swipeResistance)

    if (!swipeResistance) return console.warn("Need set swipeResistance");

    const handleGesture = (touchstartX, touchstartY, touchendX, touchendY) => {
        const delx = touchendX - touchstartX;
        const dely = touchendY - touchstartY;
        if (Math.abs(delx) > Math.abs(dely)) {
            if (delx > swipeResistance) return "right";
            else if (delx < -swipeResistance) return "left";
            else return "notenough x " + delx;
        } else if (Math.abs(delx) < Math.abs(dely)) {
            if (dely > swipeResistance) return "down";
            else if (dely < -swipeResistance) return "up";
            else return "notenough y " + dely;
        } else return "tap";
    };


    for (let element of elements) {
        const gestureZone = document.getElementById(element);
        if (!gestureZone) return;
        gestureZone.addEventListener(
            "touchstart",
            function (event) {
                touchstartX = event.changedTouches[0].screenX;
                touchstartY = event.changedTouches[0].screenY;
            },
            false
        );

        gestureZone.addEventListener(
            "touchend",
            function (event) {
                touchendX = event.changedTouches[0].screenX;
                touchendY = event.changedTouches[0].screenY;
                const direction = handleGesture(
                    touchstartX,
                    touchstartY,
                    touchendX,
                    touchendY
                );
                const U = direction === "up" ? true : false;
                const R = direction === "right" ? true : false;
                const L = direction === "left" ? true : false;
                const D = direction === "down" ? true : false;

                if ((L || R) && element === "ua-sidepanel") {
                    let activeTabName = $(".sidepanel-tab-content.active").attr( "data-tab-content" );
                    let activeTabNum =
                        activeTabName &&
                        activeTabName.includes("tab-") &&
                        Number(activeTabName.replace("tab-", "")) > 0
                            ? Number(activeTabName.replace("tab-", ""))
                            : 0;
                   
                   
                }

              

                if (D && element === "ua-place-modal" && !$('#ua-place-modal .modal-body').scrollTop()) {
                    $("#ua-place-modal").offcanvas("hide");
                  
                }

                if (element === "cardsSwiperPlaceholder") {
                    

                    if (U) {
                        
                        
                        UacanadaMap.api.openPlaceModal()

                        
                    } else if (D) {
                        
                        $("body").removeClass("ua-noscroll");
                        $("#ua-place-modal").offcanvas("hide");
                        UacanadaMap.api.removeCards()
                    } else {
                        
                    }
                    UacanadaMap.api.animateScroll();
                }

               

                if (element === "ua-dragger" && !UacanadaMap.mapExpanded && D) {
                    UacanadaMap.api.expandMap(`swipe dragger`);
                }
            },
            false
        );
    }
};

})