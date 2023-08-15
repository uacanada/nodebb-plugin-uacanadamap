'use strict';
define('uacanadamap/swipersCreator', [ 'uacanadamap'], function(UacanadaMap) { 

    const {Swiper} = UacanadaMap

   

    UacanadaMap.api.initializeSwipers = () =>{
        
        
        UacanadaMap.swipers.magicButton = new Swiper("#magic-button-swiper", {
            slidesPerView: 1,
            setWrapperSize: true,
            centeredSlides: true,
            allowTouchMove: false,
            // effect: "cube",
            // grabCursor: true,
            // cubeEffect: {
            //   shadow: true,
            //   slideShadows: true,
            //   shadowOffset: 20,
            //   shadowScale: 0.94,
            // },
           
            // autoplay: {
            //     delay: 10000,
            //     disableOnInteraction: true,
            // },
          effect: "fade",
         //  effect: "flip",
           
        }).on("click", (swiper, event) => {
           

            // console.log({swiper,event}, 
            //    swiper.clickedSlide
            //     //event.target.getAttribute('data-ua-tabtarget')
            //     )

           


        });


        
        
        
        UacanadaMap.swipers.buttonsSlider = new Swiper("#ua-sheet-swiper-buttons", {
            slidesPerView: "auto",
            freeMode: true,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            nested: false,
        }).on("click", (swiper, event) => {
            UacanadaMap.swipers.tabsSlider.slideTo(swiper.clickedIndex);
        });

        UacanadaMap.swipers.tabsSlider = new Swiper("#ua-sheet-swiper-tabs", {
            slidesPerView: 1,
            setWrapperSize: true,
        }).on("init", (swiper) => {
                console.log("init", swiper);
        }).on("slideChange", (swiper, event) => {
                const activeIndex = UacanadaMap.swipers.tabsSlider.activeIndex;
                UacanadaMap.swipers.vertical[activeIndex].slideTo(0);
                UacanadaMap.swipers.buttonsSlider.slideTo(activeIndex);
                UacanadaMap.swipers.buttonsSlider.slides.forEach((slide) => {
                    slide.classList.remove("active-tab");
                });
                UacanadaMap.swipers.buttonsSlider.slides[activeIndex].classList.add(
                    "active-tab"
                );
        });

    }


  


    



    

    






})