<div id="ua-context-buttons-wrapper" class="position-fixed start-0 end-0 w-100 no-propagation">
  <div id="context-buttons-swiper" class="swiper-container">
    <div class="swiper">
      <div class="swiper-wrapper">

                <div class="swiper-slide rounded-pill">
                        <div class="btn-group w-100" role="group" aria-label="Buttons when cards is opened">
                        {UacanadaMapSettings.contextButtonSlide}
                        
                        
                        <div class="d-flex align-items-center justify-content-center text-bg-primary fs-3" style="width: 4rem;" type="button"  data-bs-toggle="offcanvas"  data-bs-target="#map-controls" aria-controls="map-controls">
                        <i class="fas fa-ellipsis-v"></i>
                      </div>
                        

                        </div>
                </div>
        
                <div class="swiper-slide rounded-pill">
                        <div class="btn-group w-100" role="group" aria-label="Buttons when cards is opened">
                                <button title="Toggle place cards to list view" id="rotateCards" class="btn btn-primary rounded-pill m-1" type="button">
                                <i class="fa-solid fa-toggle-off"></i> List
                                </button>
                                <button title="Close Place Cards" class="btn btn-danger rounded-pill m-1 removeCards" type="button">
                                <i class="fa-solid fa-xmark"></i>
                                </button>
                                <button class="btn btn-primary rounded-pill m-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#sortPlacesOffcanvas" aria-controls="sortPlacesOffcanvas">
                                <i class="fa fa-solid fa-arrow-down-a-z"></i>  Distance
                                                
                                        
                                </button>
                                
                        </div>
                </div>

                
                <div class="swiper-slide rounded-pill">
                        <div class="btn-group w-100" role="group" aria-label="Buttons when cards is opened"> <button title="Map settings" class="btn btn-primary rounded-pill m-1" type="button"  data-bs-toggle="offcanvas"  data-bs-target="#map-controls" aria-controls="map-controls">  <i class="fa-solid fa-layer-group"></i> </button> </div>
                </div>
                
                
                <div class="swiper-slide rounded-pill"> 
                        <div class="d-flex align-items-center justify-content-center rounded-pill p-2 text-bg-primary">
                        <i class="fa fas fa-solid fa-wand-context-sparkles fa-beat"></i>
                        <span id="text-info-button">...</span>
                </div>
              
                
                </div>
        
       
      </div>
    </div>
  </div>
</div>