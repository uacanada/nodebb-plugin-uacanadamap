<div id="ua-magic-button-wrapper" class="position-fixed start-0 end-0 w-100 no-propagation">
  <div id="magic-button-swiper" class="swiper-container">
    <div class="swiper">
      <div class="swiper-wrapper">

                <div class="swiper-slide rounded-pill">
                        <div class="btn-group w-100" role="group" aria-label="Buttons when cards is opened">
                        {UacanadaMapSettings.magicButtonSlide}
                        
                        <button class="btn btn-primary rounded-pill m-1" type="button"><i class="fa-solid fa-settings"></i></button>
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
                                <div class="dropdown-center">
                                <button title="Sort Places" class="btn btn-primary rounded-pill m-1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span id="sortby-label" class="btn-label d-inline-block text-truncate rounded-pill btn-sm"> Distance
                                        <i class="fa fa-solid fa-arrow-down-a-z"></i>
                                        </span>
                                </button>
                                <ul class="dropdown-menu">
                                        <li>Sort By:</li>
                                        <li><a class="dropdown-item ua-sort" data-ua-sortby="distance" href="#">Distance</a></li>
                                        <li><a class="dropdown-item ua-sort" data-ua-sortby="latest" href="#">Latest</a></li>
                                        <li><a class="dropdown-item ua-sort" data-ua-sortby="oldest" href="#">Oldest</a></li>
                                        <li><a class="dropdown-item ua-sort" data-ua-sortby="events" href="#">Event Date</a></li>
                                        <li><a class="dropdown-item ua-sort" data-ua-sortby="category" href="#">Category</a></li>
                                        <li>
                                        <select id="location-category-filter" name="categoryfilter" class="form-select shadow me-2" aria-label="category"></select>
                                        </li>
                                </ul>
                                </div>
                        </div>
                </div>

                
                <div class="swiper-slide rounded-pill">
                        <div class="btn-group w-100" role="group" aria-label="Buttons when cards is opened"> <button title="Map settings" class="btn btn-primary rounded-pill m-1" type="button"  data-bs-toggle="offcanvas"  data-bs-target="#map-controls" aria-controls="map-controls">  <i class="fa-solid fa-layer-group"></i> </button> </div>
                </div>
                
                
                <div class="swiper-slide rounded-pill"> 
                        <i class="fa fas fa-solid fa-wand-magic-sparkles fa-beat"></i> <span id="text-info-button" class="rounded-pill">...</span> 
                
                </div>
        
       
      </div>
    </div>
  </div>
</div>