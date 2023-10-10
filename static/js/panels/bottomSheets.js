'use strict';
define('panels/bottomSheets',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 



UacanadaMap.api.createBotomPanelCategoryButton = (tab, index) => {
  const { color, icon, slug } = tab;
  return `<div class="swiper-slide showBottomPanel" data-ua-content-id="tab-${slug}"><button title="Open category: ${slug}" type="button"> <i class="fa fa-solid ${icon}" style="color: ${color};"></i></button></div>`;
};


UacanadaMap.api.switchBottomTab = {
  next: function() {
      switchTab('next');
  },
  prev: function() {
      switchTab('prev');
  }
};

async function switchTab(direction) {
  let swiper = UacanadaMap.swipers.bottomPanelCategoryButtons;
  let slidesCount = swiper.slides.length;
  let prevFragmentId = $('.showBottomPanel.active-tab-button').data('ua-content-id')
  let currentIndex =  UacanadaMap.api.findSwipeIdByContentId(prevFragmentId).index;
  
  let nextIndex;
  if (direction === 'next') {
    nextIndex = currentIndex + 1;
    if (nextIndex >= slidesCount) {
        nextIndex = 0;  
    }
  } else if (direction === 'prev') {
      nextIndex = currentIndex - 1;
      if (nextIndex < 0) {
          nextIndex = slidesCount - 1; 
      }
  } else {
      UacanadaMap.console.log("Invalid direction provided. Use either 'next' or 'prev'.");
      return;
  }

  

  $('.showBottomPanel').removeClass('active-tab-button')
  const fragment_id = $(swiper.slides[nextIndex]).data('ua-content-id')
  await UacanadaMap.api.scrollableBottomPanel.slide({fragment_id})
  UacanadaMap.setTimeout(() => {
    UacanadaMap.swipers.bottomPanelCategoryButtons.slideTo(nextIndex)
    UacanadaMap.swipers.bottomPanelCategoryButtons.updateActiveIndex()
    UacanadaMap.swipers.bottomPanelCategoryButtons.updateSlidesClasses()
    $('#bottomPanelCategoryButtons .swiper-slide[data-ua-content-id='+fragment_id+']').addClass("active-tab-button");
    UacanadaMap.console.log({currentIndex,nextIndex,slidesCount,fragment_id})
  },200)

 
}



UacanadaMap.api.findSwipeIdByContentId = (attr) => {
   const slides = UacanadaMap.swipers.bottomPanelCategoryButtons?.slides;
   if(!slides) return { slide: null, index: 0 };
    let foundSlide = null;
    let foundIndex = -1;
    for (let i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute('data-ua-content-id') === attr) {
        foundSlide = slides[i];
        foundIndex = i;
        break;  
      }
    }
    return { slide: foundSlide, index: foundIndex };
};


UacanadaMap.api.loadTabToBottomPanel = async (triggerButton) => {

  function showEmtyTab(id){
    $('#sheet-content-loader').html('<div class="mt-3 p-3 text-center fs-5"><p><i class="fa-solid fa-eye-slash"></i> This tab is currently empty. ['+id+'] </p><p class="newLocationOpenMarker btn btn-primary">Would you like to add your own location to the map?</p></div>') // TODO: move to ACP
   }
  
  
  if(!triggerButton){
    return {buttonIndex:0,contentId:null}
  }

 
  const hasFragmentContent = triggerButton.fragment_id && UacanadaMap.fragment.fragments[triggerButton.fragment_id]
  const fragmentWithoutContent = triggerButton.fragment_id && !hasFragmentContent

  if(hasFragmentContent){
    UacanadaMap.fragment.loadFragmentToElement(triggerButton.fragment_id, 'sheet-content-loader',null,true);
    return {buttonIndex:0,contentId:triggerButton.fragment_id, fragment:true}
  }

 
  let contentId =  triggerButton[0]?.getAttribute("data-ua-content-id") || triggerButton.fragment_id
  if(!contentId || fragmentWithoutContent){
    showEmtyTab(0)
    return {buttonIndex:0,contentId:triggerButton.fragment_id}
  }

  $('.showBottomPanel').removeClass('active-tab-button');
  let buttons = UacanadaMap.swipers.bottomPanelCategoryButtons

  if(!buttons || buttons.destroyed || !UacanadaMap.api.scrollableBottomPanel.openedButtons){
     // Create new swiper with category buttons
    let fragmentCloneButtons = UacanadaMap.fragment.fragments.bottomPanelCategoryButtons.cloneNode(true);
    $("#bottomPanelCategoryButtons").html(fragmentCloneButtons.childNodes);
    UacanadaMap.swipers.bottomPanelCategoryButtons = new UacanadaMap.Swiper("#bottomPanelCategoryButtons", { slidesPerView: "auto",  freeMode: true })
    let hasSlides = UacanadaMap.swipers.bottomPanelCategoryButtons.slides.length > 0
    UacanadaMap.api.scrollableBottomPanel.setPanelState( { openedButtons: hasSlides, hidingButtons: hasSlides});
  }
  
  let buttonIndex = UacanadaMap.api.findSwipeIdByContentId(contentId).index;
  if(UacanadaMap.fragment.fragments[contentId]){
    UacanadaMap.fragment.loadFragmentToElement(contentId, 'sheet-content-loader',null,true);
    return {buttonIndex,contentId}
  } else {
    showEmtyTab(1)
    return {buttonIndex,contentId}
  }

}


UacanadaMap.api.addCategoryButtons = async (buttonIndex,contentId) => {

  let buttonsVisibleBefore = UacanadaMap.api.scrollableBottomPanel.openedButtons || !UacanadaMap.api.scrollableBottomPanel.hidingButtons 
  $("#bottomPanelCategoryButtons").addClass("shown");
  if(!buttonsVisibleBefore) UacanadaMap.swipers.bottomPanelCategoryButtons.slideTo(buttonIndex);
  $('#bottomPanelCategoryButtons .swiper-slide[data-ua-content-id='+contentId+']').addClass("active-tab-button");
  UacanadaMap.swipers.bottomPanelCategoryButtons.updateActiveIndex(buttonIndex)
  UacanadaMap.swipers.bottomPanelCategoryButtons.updateSlidesClasses()


}


UacanadaMap.api.saveWidgetsToFragment = ()=> {
  let widgetsHtml = '';
  ajaxify.data.widgets['ucm-pull-up-panel'].forEach((widget)=> {
        widgetsHtml+=widget.html
   })
  UacanadaMap.fragment.createFragment('tab-widgets',widgetsHtml)
  widgetsHtml = null
}

/**
 * @function UacanadaMap.api.scrollableBottomPanel.open
 * @description Opens a scrollable bottom panel with the given content.
 *
 * @param {HTMLElement|Object} input - The content to be displayed in the panel. 
 *                                    It can either be an HTML element or an object containing the `fragment_id`.
 * 
 * ## Examples:
 * 
 * ### Using an HTML Element
 * To open the panel with a specific HTML element (e.g., a div with `data-ua-content-id="tab-all"`), 
 * you can pass the element directly to the function.
 * ```javascript
 * UacanadaMap.api.scrollableBottomPanel.open(htmlElement);
 * ```
 * 
 * ### Using a Fragment ID
 * Alternatively, you can open the panel using a pre-declared fragment ID.
 * ```javascript
 * UacanadaMap.api.scrollableBottomPanel.open({fragment_id: 'nameOfFragment'});
 * ```
 * 
 * ### Declaring a Fragment
 * To declare a fragment, you can use `UacanadaMap.fragment.createFragment()`.
 * ```javascript
 * UacanadaMap.fragment.createFragment('fragment_id', '<div>Html String</div>');
 * ```
 *   let widgetsHtml = '';
 *   ajaxify.data.widgets['ucm-pull-up-panel'].forEach((widget)=> {
 *        widgetsHtml+=widget.html
 *   })
 *   UacanadaMap.fragment.createFragment('widgetsHtml',widgetsHtml)
 * 
 */

const PANEL_SCROLL_HEIGHT = Math.floor(window.innerHeight / 2); // TODO: move magic numbers to ACP
UacanadaMap.api.scrollableBottomPanel = {

  setPanelState: function(state) {
    for (const [key, value] of Object.entries(state)) {
      UacanadaMap.api.scrollableBottomPanel[key] = value;
    }
  },

  toggleBodyClass: function(isOpened) {
    $("body").toggleClass("bottomPanelOpened", isOpened);
  },

  getPanel: function() {
    return $('#scrollableBottomPanel');
  },

  open: async function(reason) {
      let {buttonIndex,contentId} = await UacanadaMap.api.loadTabToBottomPanel(reason)
      const panel = this.getPanel();
      panel.show().attr('aria-hidden', 'false');
      this.toggleBodyClass(true);
      this.setPanelState( { opened: true, hiding: false });
      UacanadaMap.setTimeout(() => {
        UacanadaMap.api.addCategoryButtons(buttonIndex,contentId) 
        this.setPanelState( { openedButtons: true, hiding: false, hidingButtons: false });
        UacanadaMap.api.shakeElements(["#sheet-content-loader"], "ua-shake-vert");
        panel.removeClass('panel-hidden').addClass('panel-shown');
        $("#innerScrollPanel").animate({ scrollTop: PANEL_SCROLL_HEIGHT }, 300, "swing");
      }, 100);   
  },

  slide: function (fragment){
    UacanadaMap.api.shakeElements(["#sheet-content-loader"], "ua-shake-vert"); // TODO: make horizontal
    UacanadaMap.api.loadTabToBottomPanel(fragment)

  },

  close: function() {
    
    if(!UacanadaMap.api.scrollableBottomPanel.opened || !UacanadaMap.api.scrollableBottomPanel.openedButtons ) return;

    const panel = this.getPanel();
    $("#innerScrollPanel").animate({ scrollTop: 0 }, 300);
    panel.removeClass('panel-shown').addClass('panel-hidden').attr('aria-hidden', 'true');
    this.toggleBodyClass(false);
    this.setPanelState( { openedButtons: false, opened: false, hiding: true, hidingButtons: true });
    $("#bottomPanelCategoryButtons").removeClass("shown");

    UacanadaMap.setTimeout(() => {
      if (!UacanadaMap.api.scrollableBottomPanel.hiding) return;
        
      panel.hide();
      try {
        UacanadaMap.swipers.bottomPanelCategoryButtons.destroy(true,true)
      } catch (error) {
        UacanadaMap.console.log(error)
      }
     $('#sheet-content-loader').html('')
     $("#bottomPanelCategoryButtons").html('');

     this.setPanelState( { openedButtons: false, opened: false, hiding: false, hidingButtons: false });
     
     UacanadaMap.swipers.bottomPanelCategoryButtons = null
    }, 1500);
  }
};

})
