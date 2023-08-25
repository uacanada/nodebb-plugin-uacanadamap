"use strict";
define("core/swipersCreator", [
  "core/variables" /*   Global object UacanadaMap  */,
], function (UacanadaMap) {
  UacanadaMap.api.initializeSwipers = () => {
    const { Swiper } = UacanadaMap;

    UacanadaMap.swipers.contextButton = new Swiper("#context-buttons-swiper .swiper", {
      // slidesPerView: 1,
      // setWrapperSize: true,
      // centeredSlides: true,
      allowTouchMove: false,
     
      effect: "creative",
      creativeEffect: {
     prev: {
       shadow: true,
           translate: [0, 0, -2000],
           rotate: [180, 0, 5],
           opacity:0
     },
     next: {
      shadow: true,
           translate: [0, 0, -2000],
           rotate: [180, 0, 15],
       opacity: 1, // Fade in
     }
   }
    }).on("click", (swiper, event) => {
      
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
    })
      .on("init", (swiper) => {
    
      })
      .on("slideChange", (swiper, event) => {
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
  };
});
