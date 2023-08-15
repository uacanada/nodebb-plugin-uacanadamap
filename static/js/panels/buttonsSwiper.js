 'use strict';
define('uacanadamap/buttonsSwiper', [ 'uacanadamap'], function(UacanadaMap) { 

    const { L, Swiper } = UacanadaMap;

    const setupDomEvents = (btnDiv) => {
        L.DomEvent.disableScrollPropagation(btnDiv);
        L.DomEvent.disableClickPropagation(btnDiv);
    };

    const appendButtonsHtml = (buttonsHtml) => {
        if (buttonsHtml) $("#ua-place-buttons").addClass("filled");
        $("#ua-place-buttons ul.swiper-wrapper").append(buttonsHtml);
    };

    const handleSwiperClick = (c) => {
        const slideButton = $(c.clickedSlide).find("button");
        const tabNum = slideButton.attr("data-tab-trigger");
        const catName = slideButton.attr("data-cat-trigger");
        const isActive = slideButton.hasClass("active");

       

        if (catName) {
            if (isActive) {
                UacanadaMap.api.removeCards();
           
            } else {
                
                UacanadaMap.api.setCategoryAndOpenCards(catName);
            }
        }
    };


        UacanadaMap.api.initBtnSlider = (buttonsHtml) => {
            try {
                const btnDiv = L.DomUtil.get('ua-horizontal-buttons-wrapper');
                setupDomEvents(btnDiv);
            
                if ($('#ua-place-buttons').hasClass('filled')) {
                    console.log('Swiper only update');
                    return UacanadaMap.horizontalButtons.update();
                }

                appendButtonsHtml(buttonsHtml);
            
                UacanadaMap.horizontalButtons = new Swiper("#ua-place-buttons", {
                    slidesPerView: "auto",
                    observer: true,
                    direction: "horizontal",
                    touchStartForcePreventDefault: true,
                    freeMode: true,
                    height: "20px",
                    grabCursor: true,
                    mousewheel: { invert: false, sensitivity: 1 },
                }).on("click", handleSwiperClick);
            } catch (error) {
                if (UacanadaMap.adminsUID) console.log(error);
            }  
        };


        UacanadaMap.api.showCatSelector = (selected) => {
            let options = "";
            let total = 0;
            let buttonsHtml = "";
            for (const [slug, value] of Object.entries(UacanadaMap.subCategoryRouterObject)) {
                if(value.total>0){
                    const s = selected === slug ? " selected" : "";
                    total += value.total;
                    options += `<option value="${slug}"${s}>${value.name}: ${value.total}</option>`;
                    buttonsHtml += `<li class="swiper-slide"><button data-cat-trigger="${slug}" title="Select category: ${value.name}" class="btn btn btn-light btn-sm rounded-pill me-2 position-relative" type="button">${value.name} <span class="badge rounded-pill bg-secondary">${value.total}</span> </button> </li>`;
                }
            }
            var catFields = '<option value="">All places: ' + total + "</option>" + options;
            $("#ua-filter-places").html(catFields); // Delete if sidepanel deleted
            $("#location-category-filter").html(catFields);
            if (selected) $("#mapStatusLine").addClass("show");
            UacanadaMap.api.initBtnSlider(buttonsHtml);
        };





        UacanadaMap.api.magicButtonText = ({text,delay,to}) => {
          
           $('#text-info-button').text(text) 
           UacanadaMap.swipers.magicButton.slideTo(UacanadaMap.magicButton.router.text)
            setTimeout(() => {
             
                    UacanadaMap.swipers.magicButton.slideTo(to)
                   
                // TODO PREVENT IF CHNAGED
                
            }, delay);

        }




})
