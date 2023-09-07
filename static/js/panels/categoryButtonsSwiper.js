"use strict";
define("panels/categoryButtonsSwiper", [
  "core/variables" /*   Global object UacanadaMap  */,
], function (UacanadaMap) {
  const setupDomEvents = (btnDiv) => {
    UacanadaMap.L.DomEvent.disableScrollPropagation(btnDiv);
    UacanadaMap.L.DomEvent.disableClickPropagation(btnDiv);
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

  const initializeСategoryButtonsSwiper = (buttonsHtml) => {
    const { L, Swiper } = UacanadaMap;
    try {
      const btnDiv = L.DomUtil.get("ua-horizontal-buttons-wrapper");
      setupDomEvents(btnDiv);

      if ($("#ua-place-buttons").hasClass("filled") || !UacanadaMap.swipers.horizontalButtons?.destroyed) { return UacanadaMap.swipers.horizontalButtons.update();  }

      appendButtonsHtml(buttonsHtml);

      UacanadaMap.swipers.horizontalButtons = new Swiper("#ua-place-buttons", {
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

  UacanadaMap.api.createСategoryButtonsSwiper = (selected) => {
    let options = "";
    let total = 0;
    let buttonsHtml = "";
    for (const [slug, value] of Object.entries(
      UacanadaMap.subCategoryRouterObject
    )) {
      if (value.total > 0) {
        const s = selected === slug ? " selected" : "";
        total += value.total;
        options += `<option value="${slug}"${s}>${value.name}: ${value.total}</option>`;
        buttonsHtml += `<li class="swiper-slide"><button data-cat-trigger="${slug}" title="Select category: ${value.name}" class="btn btn btn-light btn-sm rounded-pill me-2 position-relative" type="button">${value.name} <span class="badge rounded-pill bg-secondary">${value.total}</span> </button> </li>`;
      }
    }
    var catFields =
      '<option value="">All places: ' + total + "</option>" + options;
    $("#location-category-filter").html(catFields);
    
    initializeСategoryButtonsSwiper(buttonsHtml);
  };
});
