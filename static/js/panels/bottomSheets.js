'use strict';
define('panels/bottomSheets',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

const { Swiper, offcanvas: { modes } } = UacanadaMap;
const sizes = ajaxify.data.UacanadaMapSettings.bottomSheetOffset.split(',').map(Number);


// Declare a debounce block that prevents the togglePanel function from running too frequently
let isDebounceBlocked = false;


// Constants definition for thresholds
const thresholds = {
    minTime: 2,
    minDistance: 2,
    maxTime: 3000,
    maxDistance: 1800,
    factor: 700,
    debugFactor: 300
  };
  
  const calculateDistance = (distance) => distance.up + distance.down;
  
  // Verifies direction glitch
  const isDirectionGlitch = (direction, distance) => (direction.up && distance.up < distance.down) || (direction.down && distance.down < distance.up);

  // This function adjusts the state of the off-canvas panel based on a direction input
const togglePanel = (direction) => {
  const offCanvasPanel =  $('#ua-bottom-sheet');
    // Return early if the debounce block is active
    if (isDebounceBlocked) return false;
  
    // Activate the debounce block and set a timer to deactivate it after 20ms
    isDebounceBlocked = true;
    UacanadaMap.setTimeout(() => {
      isDebounceBlocked = false;
    }, 100);
  
    // Get the current panel mode from its data attribute
    const currentMode = Number(offCanvasPanel.attr("data-ua-size"));
    // Define an array of available panel modes
    
  
    // This function calculates the new mode based on the current one and a direction
  
    const downSpeed = direction.power.down > 200 ?  direction.power.down > 400? -3: -2: -1
    const upSpeed = direction.power.up>200 ? 2:1
  
    const calculateNewMode = (currentMode, direction) => {
      const adjustment = direction.up ? upSpeed:downSpeed;
      const newMode = currentMode + adjustment;
      // Ensure that the new mode is within the valid range
      return Math.min(Math.max(newMode, 0), modes.length - 1);
    }
  
    // Calculate the new mode
    let newMode = calculateNewMode(currentMode, direction);
    // TODO force full open if scroll
  
    
  
    // Update the panel's data attribute and CSS class to reflect the new mode
  
    // modes.forEach(modeClass => {
    //   offCanvasPanel.removeClass(modeClass)
    // });
  
    // offCanvasPanel
    //   .attr("data-ua-size", newMode)
    // //  .removeClass(modes[currentMode])
    //  // .addClass(modes[newMode])
    //   .css('transform',`translate3d(0,${sizes[newMode]}vh,0)`)

      UacanadaMap.api.setBottomSheetSize(newMode)
  
  
     
    if(newMode<1) offCanvasPanel.offcanvas('hide')
  
    return true
      
  };

  // Checks if the swipe behavior is normal
const isNormalSwipe = (time, distance) => time > thresholds.minTime &&
calculateDistance(distance) > thresholds.minDistance &&
time < thresholds.maxTime &&
calculateDistance(distance) < thresholds.maxDistance &&
calculateDistance(distance) * thresholds.factor > time;

// Checks for abnormal swipe behavior
const isAbnormalSwipe = (time, distance) => time >= thresholds.maxTime || calculateDistance(distance) >= thresholds.maxDistance;

// Checks for tiny swipe behavior
const isTinySwipe = (time, distance) => time <= thresholds.minTime || calculateDistance(distance) <= thresholds.minDistance;

// Checks for strange behavior
const isStrangeBehavior = (time, distance) => calculateDistance(distance) * thresholds.debugFactor <= time;

// The main function to detect swipe behavior
const detectSwipeBehavior = (values) => {

const { up, down, t, d } = values;
if (isDirectionGlitch({up, down}, d)) {
  UacanadaMap.console.log('Direction Glitch:', { up, down, t, d });
} else if (isNormalSwipe(t, d)) {
  UacanadaMap.console.log('Normal:', { up, down, t, d });
  return togglePanel({up, down, power:d});
 
} else if (isAbnormalSwipe(t, d)) {
  UacanadaMap.console.log('Abnormal!', { up, down, t, d });
} else if (isTinySwipe(t, d)) {
  UacanadaMap.console.log('Too Tiny Swipes!', { up, down, t, d });
} else if (isStrangeBehavior(t, d)) {
  UacanadaMap.console.log('Strange Behavior - Spending Too Much Time for Tiny Swipe!', { up, down, t, d });
} else {
  UacanadaMap.console.log('DEBUG:', { up, down, t, d });
}

return false

};

function addTranslate3dY(value) {


    if (isDebounceBlocked) return false;
    
    if (typeof value !== 'number') {
      return
    }
  
    const element = document.getElementById('ua-bottom-sheet'); 
    //const currentTransform = window.getComputedStyle(element).getPropertyValue('transform');
  
    const style = window.getComputedStyle(element);
    const matrix = new DOMMatrixReadOnly(style.transform);
    let currentY = matrix?.m42 || window.innerHeight
    let newY = currentY - value;
    newY = Math.round(Math.min(Math.max(newY, 0), window.innerHeight));
  
    //$('#debuger').html()
    element.style.transform = 'translate3d(0, ' + newY + 'px, 0)';
  }




    
    

// TODO make deboince native NodeBB utils
UacanadaMap.api.debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};




UacanadaMap.api.openCertainTab = (contextButton) => {
  let tab = contextButton[0]?.getAttribute("data-ua-tabtarget")
  if(tab){

  const slides = UacanadaMap.swipers.buttonsSlider.slides
  let tabIndex = 0
  for (let i = 0; i < slides.length; i++) {
      if (slides[i].getAttribute("data-ua-butt-cat") == tab) {
          tabIndex = i;
          break; 
      }
      }
  
  UacanadaMap.swipers.buttonsSlider.slideTo(tabIndex);
  UacanadaMap.swipers.tabsSlider.slideTo(tabIndex);

  }

}


UacanadaMap.api.setBottomSheetSize = (i) => {
 
  $('#ua-bottom-sheet').attr("data-ua-size", String(i)).css('transform',`translate3d(0,${sizes[i]}vh,0)`)
  UacanadaMap.console.log(`[UCMP debug]: `,{i,modes,sizes},$('#ua-bottom-sheet').attr("data-ua-size"))

}

UacanadaMap.api.OffCanvasPanelHandler = () => {
  
    const offCanvasPanel =  $('#ua-bottom-sheet');
    const fullHeight = modes.length - 2
    const bigHeight = modes.length - 3
    let once = true
    const debouncedDetectSwipeBehavior = UacanadaMap.api.debounce(detectSwipeBehavior, 10);
    const waitContent = setInterval(() => {
    if (UacanadaMap.swipersContext.canActivateVertical) {
    clearInterval(waitContent);

   UacanadaMap.swipers.vertical = new Swiper(".vertical-places-list", {
    direction: "vertical",
    slidesPerView: "auto",
    nested: true,
    freeMode: true,
    scrollbar: {  el: ".swiper-scrollbar",  },
    allowSlideNext: false,
    autoHeight:true,
    mousewheel: {
      
        sensitivity: 0.25
      },
    })
    


   
    function handleSwiperGesture(s) {
     
      let previousProgress = 0;
      let prevClientY = null;
      let prevClientX = null;
      let startTime = 0;
      let handled = false;
      let dstnc = {up:0 ,down:0}
      let duration = {up:0 ,down:0}
      const reset = (x) => {
        handled = false;
       
        previousProgress = 0;
        dstnc.up = 0;
        dstnc.down = 0;
        duration.up = 0;
        duration.down = 0;
       
       
      };
     
     
     // s.on('reachBeginning', () => console.log('reachBeginning'))
      // s.on('reachEnd', () =>{
      
      // } )
   
      s.on('touchStart', (s,e) => { 
        
        const { clientY , clientX} = e;
        prevClientY = clientY
        prevClientX = clientX
        startTime =  new Date().getTime()
       

        return reset('touchStart');  
      
      });
      
      s.on('touchMove', (swiperEvent,event) => {

        const { clientY , clientX } = event;
        const swiper = UacanadaMap.swipers.vertical[UacanadaMap.swipers.tabsSlider.activeIndex] // TODO CHECK AND DEBUG
        if (!event.debounceHandled && !event.preventedByNestedSwiper && !handled) {
          const deltaX = Math.abs(clientX-prevClientX)
          const deltaY = Math.abs(clientY-prevClientY)
          const isDiagonal = deltaX >= deltaY * 0.8
          const currentTime = new Date().getTime();
          const elapsedTime = currentTime - startTime;
          if (prevClientY !== null && !isDiagonal && elapsedTime > 4) {
            const swipeUp = clientY < prevClientY
            const swipeDown = clientY > prevClientY
            if(!swipeDown && !swipeUp) return
            const gestureDown = swiper.progress < previousProgress
            const gestureUp = swiper.progress > previousProgress
            const hasScroll = swiper.virtualSize > swiper.size
            const isBottom = swiper.isEnd
            const isTop = swiper.isBeginning  
            const isFH = Number(offCanvasPanel.attr("data-ua-size")) >= fullHeight ? true:false
            
            swiper.allowSlideNext = isFH 
            swiper.mousewheel = isFH
           


            let log_temp = `X ${clientX}-${prevClientX} = ${deltaX}   Y ${clientY}-${prevClientY} = ${deltaY} (${deltaY * 0.8})  ${isDiagonal?'diagonal':'vertical'}  ${elapsedTime}ms  progress:: ${swiper.progress}`

            console.log(log_temp)
            
            if (swipeUp) {
              const distance = prevClientY - clientY;

             if(once && !isFH) {
              addTranslate3dY(150)
              once = false
             }  
             

                duration.up += elapsedTime;
                dstnc.up  += distance;
                const releaseScrollUp = (hasScroll && isBottom && !gestureDown ) || !hasScroll ||  !isFH
                const inTheEnd = isFH&& isBottom && !gestureDown && hasScroll && swiper.progress > 1.013
              if(inTheEnd) {
                  return offCanvasPanel.offcanvas('hide')
               }
               if(releaseScrollUp) {
               //   console.log(` ${gestureUp?'⬆️':gestureDown?'⬇️':'?'}  releaseScrollUp=${releaseScrollUp} clientY=${clientY} prevClientY=${prevClientY}  ${hasScroll?'📜':' '}  ${isBottom?'🔚':''}   ${isTop?'🔝':''}  elapsedTime=${elapsedTime} progress=${swiper.progress} velocity=${swiper.velocity} touchStartTime=${swiper.touchEventsData.touchStartTime}`)
                 handled = debouncedDetectSwipeBehavior({ up:true, down:false, t: duration.up, d: dstnc });
                } else {
                 // console.log({hasScroll, isTop,isBottom, gestureDown, gestureUp, clientY, prevClientY})
                }
      
             
            } else if (swipeDown) {
              const distance = clientY - prevClientY;
                dstnc.down += distance;
                duration.down  += elapsedTime;

                const releaseScrollDown = (hasScroll && !gestureUp && isTop ) || !hasScroll
               if(releaseScrollDown) {
                   handled = debouncedDetectSwipeBehavior({ down:true, up:false, t: duration.down , d: dstnc  });

                } else{
                 // console.log({hasScroll, isTop,isBottom, gestureDown, gestureUp, clientY, prevClientY})
                }
            }

            
          }
      
          startTime = currentTime;
          prevClientY = clientY;
          prevClientX = clientX;
          event.debounceHandled = true; // Set the event as handled to prevent double firing
        } 

        previousProgress = swiper.progress
        
      })
      
    }


    UacanadaMap.swipers.vertical.forEach(handleSwiperGesture)
    handleSwiperGesture(UacanadaMap.swipers.buttonsSlider)
    return UacanadaMap.swipers.vertical
    
  }
}, 1000);




    
    

  
}



UacanadaMap.api.createBotomPanelCategoryButton = (tab, index) => {
  const { color, icon, slug } = tab;
  return `<div class="swiper-slide showBottomPanel" data-ua-content-id="tab-${slug}"><button title="Open category: ${slug}" type="button"> <i class="fa fa-solid ${icon}" style="color: ${color};"></i></button></div>`;
};


UacanadaMap.swipersContext.createButtonSlide = (tab, index) => {
  const { color, icon, slug } = tab;
  const isActive = index === 0 ? "swiper-slide-active" : "";
  return `<div class="swiper-slide ${isActive}" data-ua-butt-cat="${slug}">
          <button type="button">
              <i class="fa fa-solid ${icon}" style="color: ${color};"></i>
          </button>
      </div>`;
};


UacanadaMap.swipersContext.createContentSlide = (tab, index) => {
  const { color, description, footer, icon, slug, title } = tab;
  const isActive = index === 0 ? "swiper-slide-active" : "";
  return `<div class="swiper-slide p-0 ${isActive}" data-parent-category="${slug}" style="height:${window.innerHeight}px">
          <div class="places-inner-tab p-0 w-100">
          <div class="swiper vertical-places-list" style="height:${window.innerHeight}px">
              <ul data-ua-tab-cat="${slug}" class="list-group list-group-flush swiper-wrapper">
                  <li class="swiper-slide list-group-item slide-tab-header">
                  <div class="p-3">
                      <h2 style="color: ${color};">${title}</h2>
                      <p>${description}</p>
                      <h3>You can add own place here!</h3>
                  </div>
                  </li>
              </ul>
              <div class="swiper-scrollbar"></div>
         
              <div class="places-tab-footer">${footer}</div>
          </div>
          </div>
      </div>`;
};

UacanadaMap.previousScrollHeight = 0
const PANEL_SCROLL_HEIGHT = 250

$('#scrollableBottomPanel').on('scroll', utils.debounce(function () {
  const $this = $(this);
  let current = $this.scrollTop()

  UacanadaMap.console.log(`Scrolled: ${current}px`)
 
  if (current < 10) {
    $this.animate({ scrollTop: 0 }, 500, "swing");
    UacanadaMap.api.scrollableBottomPanel.close()
  }


  if(current > PANEL_SCROLL_HEIGHT && UacanadaMap.previousScrollHeight < current && current < window.innerHeight / 2){
    $this.animate({ scrollTop:  Math.floor(window.innerHeight * 0.8) }, 300, "swing");
  }


  UacanadaMap.previousScrollHeight = current
}, 120));



UacanadaMap.api.loadTabToBottomPanel = (triggerButton) => {
  let contentId = triggerButton[0]?.getAttribute("data-ua-content-id")
 
   if(!contentId){
    $('#sheet-content-loader').html(' <h3><i class="fa-solid fa-eye-slash"></i></h3>')
    return false
   }

   if(UacanadaMap.fragment.fragments[contentId]){
    UacanadaMap.fragment.loadFragmentToElement(contentId, 'sheet-content-loader', () => {
      UacanadaMap.swipers.bottomPanelCategoryButtons = new Swiper("#sheet-content-loader #bottomPanelCategoryButtons", { slidesPerView: "auto",  freeMode: true,  watchSlidesVisibility: true,  watchSlidesProgress: true, nested: false, }).on("click", (swiper, event) => {
        UacanadaMap.console.log({swiper, event})
      });
     }, true);
     return true
   } else {
   


      let newDiv = $('<div id="bottomPanelCategoryButtons" class="swiper position-sticky bottom-0 start-0 w-100"></div>');
      let fragmentClone = UacanadaMap.fragment.fragments.bottomPanelCategoryButtons.cloneNode(true);
      newDiv.append(fragmentClone.childNodes);
      let htmlString = newDiv.prop('outerHTML');

    $('#sheet-content-loader').html('<div class="mt-3 p-3 text-center fs-5"><p><i class="fa-solid fa-eye-slash"></i> This tab is currently empty.</p><p class="newLocationOpenMarker btn btn-primary">Would you like to add your own location to the map?</p></div>'+htmlString)
    return false
   }


   
}




UacanadaMap.api.scrollableBottomPanel = {
  toggleBodyClass: function(isOpened) {
    $("body").toggleClass("bottomPanelOpened", isOpened);
  },

  getPanel: function() {
    return $('#scrollableBottomPanel');
  },

  open: function(triggerButton) {
      UacanadaMap.api.loadTabToBottomPanel(triggerButton)
      this.toggleBodyClass(true);
      const panel = this.getPanel();
      panel.show().attr('aria-hidden', 'false');


      UacanadaMap.setTimeout(() => {
        //let wasOpenedBefore = panel.hasClass('panel-shown')
        UacanadaMap.api.shakeElements(["#sheet-content-loader"], "ua-shake-vert");
        panel.removeClass('panel-hidden').addClass('panel-shown');
        panel.animate({ scrollTop: PANEL_SCROLL_HEIGHT }, 300, "swing");
        $("#bottomPanelCategoryButtons .swiper-wrapper").removeClass("visually-hidden");
        
        // if(wasOpenedBefore){
          
        // } else{
         
        // } 
       
      }, 120);

   
    
   
  },

  close: function() {
    const panel = this.getPanel();
    panel.animate({ scrollTop: 0 }, 100);
    this.toggleBodyClass(false);
    panel.removeClass('panel-shown').addClass('panel-hidden').attr('aria-hidden', 'true');
    UacanadaMap.setTimeout(() => {
      if (panel.hasClass('panel-shown')) return;
      panel.hide();
      try {
        UacanadaMap.swipers.bottomPanelCategoryButtons.destroy(true,true)
      } catch (error) {
        UacanadaMap.console.log(error)
      }
      
      
      
      $('#sheet-content-loader').html('')
      UacanadaMap.swipers.bottomPanelCategoryButtons = null
    }, 2000);
  }
};



})
