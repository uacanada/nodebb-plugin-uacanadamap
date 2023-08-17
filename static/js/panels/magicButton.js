
'use strict';
define('panels/magicButton',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

    UacanadaMap.api.oprnCertainTab = (magicButton) => { // TODO: rename open
        let tab = magicButton[0]?.getAttribute('data-ua-tabtarget')
        if(tab){

        const slides = UacanadaMap.swipers.buttonsSlider.slides
        let tabIndex = 0
        for (let i = 0; i < slides.length; i++) {
            if (slides[i].getAttribute('data-ua-butt-cat') == tab) {
                tabIndex = i;
                break; 
            }
            }
        
        UacanadaMap.swipers.buttonsSlider.slideTo(tabIndex);
        UacanadaMap.swipers.tabsSlider.slideTo(tabIndex);
    
        }

        
        
    }
})