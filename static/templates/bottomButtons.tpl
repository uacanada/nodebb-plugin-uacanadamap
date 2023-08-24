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
                                <button title="Sort Places" class="btn btn-primary rounded-pill m-1" type="button" data-bs-toggle="modal" data-bs-target="#sortModal"> <span id="sortby-label" class="btn-label d-inline-block text-truncate rounded-pill btn-sm"> Distance  <i class="fa fa-solid fa-arrow-down-a-z"></i> </span> </button>
                        </div>
                </div>

                
                <div class="swiper-slide rounded-pill">
                        <div class="btn-group w-100" role="group" aria-label="Buttons when cards is opened"> <button title="Map settings" class="btn btn-primary rounded-pill m-1" type="button"  data-bs-toggle="offcanvas"  data-bs-target="#map-controls" aria-controls="map-controls">  <i class="fa-solid fa-layer-group"></i> </button> </div>
                </div>
                
                
                <div class="swiper-slide rounded-pill"> 
                        <div class="rounded-pill p-2 text-bg-primary"><i class="fa fas fa-solid fa-wand-magic-sparkles fa-beat"></i> <span id="text-info-button">...</span></div>
                
                </div>
        
       
      </div>
    </div>
  </div>
</div>



<div class="modal fade" id="sortModal" tabindex="-1" aria-labelledby="sortModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-sm modal-fullscreen-md-down">
    <div class="modal-content">
      <div class="modal-body">
        <ul class="list-group list-group-flush">
          <li class="list-group-item">Sort By:</li>
          <li class="list-group-item"><a class="dropdown-item ua-sort" data-ua-sortby="distance" href="#">Distance</a></li>
          <li class="list-group-item"><a class="dropdown-item ua-sort" data-ua-sortby="latest" href="#">Latest</a></li>
          <li class="list-group-item"><a class="dropdown-item ua-sort" data-ua-sortby="oldest" href="#">Oldest</a></li>
          <li class="list-group-item"><a class="dropdown-item ua-sort" data-ua-sortby="events" href="#">Event Date</a></li>
          <li class="list-group-item"><a class="dropdown-item ua-sort" data-ua-sortby="category" href="#">Category</a></li>
          <li class="list-group-item">
            <select id="location-category-filter" name="categoryfilter" class="form-select shadow me-2" aria-label="category"></select>
          </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>