'use strict';
define('ui/swipeDetectors',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

    UacanadaMap.api.swipeDetectorZones = {
        '#cardsSwiperPlaceholder': cardCarousel,
        '#ua-place-modal .offcanvas-body': postOffcanvas,
        '[component="bottombar"]': bottomNav
      };

  UacanadaMap.api.swipeZonesRegister = () => {
        UacanadaMap.api.swipeDetectorListeners = [];
    
        // Register
        Object.entries(UacanadaMap.api.swipeDetectorZones).forEach(([selector, handle]) => {
          const registration = UacanadaMap.api.listenSwipes(selector, handle);
          registration.register();
          UacanadaMap.api.swipeDetectorListeners.push(registration);
        });
  }

    UacanadaMap.api.swipeZonesUnregister = () => {
    // Unregister
            UacanadaMap.api.swipeDetectorListeners.forEach((registration) => {
            registration.unregister();
        });
    }



  function cardCarousel(direction, element) {

    let isVertical = UacanadaMap.swipers.cardsCarousel.isVertical()
    let verticalInBeginning = isVertical && UacanadaMap.swipers.cardsCarousel.isBeginning

    if (direction==='up' && !isVertical) {
        UacanadaMap.api.openPlaceModal()
    }  

    
   if (direction==='down' && !isVertical) {
        $("body").removeClass("ua-noscroll");
        $("#ua-place-modal").offcanvas("hide");
        UacanadaMap.api.removeCards()
    } 


    if (direction==='down' && verticalInBeginning) {
      UacanadaMap.api.rotateCards("horizontal");
    } 

  }
  
  function postOffcanvas(direction, element) {
    if(direction==='down'){
        $("#ua-place-modal").offcanvas("hide");
    }
    
  }

  function bottomNav (direction, element) {
    if(direction==='up'){
        UacanadaMap.api.scrollableBottomPanel.open()
    }
    
  }
 
  

  
UacanadaMap.api.listenSwipes = (querySelector, callback, swipeResistance = Number(ajaxify.data.UacanadaMapSettings.swipeResistance), diagonalThreshold = 50) => {
    const elements = document.querySelectorAll(querySelector);
    
  
    if (!swipeResistance) return console.warn("Need set swipeResistance");
  
    const handleGesture = (startX, startY, endX, endY) => {
      const deltaX = endX - startX;
      const deltaY = endY - startY;
  
      if (Math.abs(deltaX) < swipeResistance && Math.abs(deltaY) < swipeResistance) {
        return null; // Ignore accidental swipes
      }
  
      if (Math.abs(deltaX - deltaY) <= diagonalThreshold) {
        return null; // Ignore diagonal swipes
      }
  
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX > swipeResistance ? 'right' : 'left';
      } else {
        return deltaY > swipeResistance ? 'down' : 'up';
      }
    };
  
    const eventListeners = [];
  
    elements.forEach(element => {
      const touchStart = function(event) {
        this.startX = event.changedTouches[0].screenX;
        this.startY = event.changedTouches[0].screenY;
      };


      const touchEnd = function(event) {
        const endX = event.changedTouches[0].screenX;
        const endY = event.changedTouches[0].screenY;
        const direction = handleGesture(this.startX, this.startY, endX, endY);
        
        const isScrollable = element.scrollHeight > element.clientHeight;
        
        if (isScrollable) {
          // Ignore swipe down if not fully scrolled to the top
          if (element.scrollTop > 0 && direction === 'down') {
            return;
          }
          
          // Ignore swipe up if not fully scrolled to the bottom
          if (element.scrollTop < element.scrollHeight - element.clientHeight && direction === 'up') {
            return;
          }
        }
        
        if (direction) {
          callback(direction, element);
        }
      };
      

  
      element.addEventListener('touchstart', touchStart);
      element.addEventListener('touchend', touchEnd);
      eventListeners.push({element, touchStart, touchEnd});
    });
  
    return {
      register() {
        eventListeners.forEach(({element, touchStart, touchEnd}) => {
          element.addEventListener('touchstart', touchStart);
          element.addEventListener('touchend', touchEnd);
        });
      },
      unregister() {
        eventListeners.forEach(({element, touchStart, touchEnd}) => {
          element.removeEventListener('touchstart', touchStart);
          element.removeEventListener('touchend', touchEnd);
        });
      }
    };
};
  


})