<div id="ua-bottom-sheet" class="bottom-sheet offcanvas offcanvas-bottom no-propagation" tabindex="-1" data-ua-size="0"
        aria-labelledby="ua-bottom-sheet-Label" aria-hidden="true">


        <div id="tabs-body" class="offcanvas-body p-0 h-100 no-propagation">


                <div class="bottom-sheet-header w-100">

                        <div id="ua-sheet-swiper-buttons" class="swiper-container buttons-slider mt-5 p-3 pt-0 pb-0">
                                <div class="swiper-wrapper">
                                        <div class="swiper-slide main-first-tab" data-ua-butt-cat="main-first-tab">
                                                <button type="button">
                                                        <i class="fa fa-solid fa-info" style="color: #01d61d;"></i>
                                                </button>
                                        </div>
                                </div>
                        </div>

                </div>



                <div id="ua-sheet-swiper-tabs" class="swiper-container swiper-h tabs-slider w-100 p-0">
                        <div class="swiper-wrapper">


                                <div class="swiper-slide p-0">



                                        <div class="swiper vertical-places-list" style="height:100vh">
                                                <ul class="list-group list-group-flush swiper-wrapper">
                                                        <li class="swiper-slide list-group-item slide-tab-header">

                                                        </li>

                                                        {{{each widgets.ucm-pull-up-panel}}}
                                                        <li class="swiper-slide list-group-item">
                                                                <div class="p-3">
                                                                        {{widgets.ucm-pull-up-panel.html}}
                                                                </div>
                                                        </li>
                                                        {{{end}}}
                                                </ul>
                                                <div class="swiper-scrollbar"></div>

                                        </div>


                                </div>


                        </div>
                </div>




        </div>




</div>







<div id="ua-place-modal" class="offcanvas offcanvas-bottom no-propagation" tabindex="-1"
        aria-labelledby="ua-place-modal" aria-hidden="true">
        <div class="offcanvas-header">
                <h1 class="offcanvas-title fs-5" id="modal-place-title"></h1>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas"
                        aria-label="Close"></button>
        </div>
        <div class="offcanvas-body overflow-auto text-break dyn-content">
                <!-- Modal body content goes here -->
        </div>

</div>



<div id="attribution-modal" class="offcanvas offcanvas-bottom max500-bottom-offcanvas no-propagation" tabindex="-1" aria-labelledby="attribution-modal" aria-hidden="true">

        <div class="offcanvas-header">

                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body overflow-auto">
                <p>To make your experience friendly and secure we use a variety of technologies:</p>
                <div id="attribution-text"></div>
        </div>

</div>


<div id="sortPlacesOffcanvas" class="offcanvas offcanvas-bottom max500-bottom-offcanvas no-propagation p-3" tabindex="-1" aria-labelledby="sortPlacesOffcanvasLabel" aria-hidden="true">
    <div class="offcanvas-header">
        <h5 id="sortPlacesOffcanvasLabel">Sort By:</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
     
                <div class="list-group">
                <a class="list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="distance" href="#">
                        <i class="fas fa-road me-2"></i> Distance
                </a>
                <a class="list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="latest" href="#">
                        <i class="fas fa-hourglass-start me-2"></i> Latest
                </a>
                <a class="list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="oldest" href="#">
                        <i class="fas fa-hourglass-end me-2"></i> Oldest
                </a>
                <a class="list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="events" href="#">
                        <i class="fas fa-calendar-alt me-2"></i> Event Date
                </a>
                <a class="list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="category" href="#">
                        <i class="fas fa-folder me-2"></i> Category
                </a>
                <div class="list-group-item border-bottom mt-5 py-2">
                   <select id="location-category-filter" name="categoryfilter" class="form-select w-100 rounded-pill" aria-label="category"></select>
                </div>
                </div>




    </div>
</div>



<div id="addPlaceInstructions" class="offcanvas offcanvas-bottom max500-bottom-offcanvas no-propagation p-3" tabindex="-1" aria-labelledby="addPlaceInstructionsOffcanvasLabel" aria-hidden="true">
    <div class="offcanvas-header">
        <h5 id="addPlaceInstructionsOffcanvasLabel">Add a Place to the Map</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
     
    Welcome to our location addition interface! Here, you can contribute to our growing community by adding a new place to the map. Whether it's your favorite café, a historical landmark, or a hidden gem, we'd love to include it!


        <div class="container mt-4">
        <div class="row">
        <div class="col-1 d-flex align-items-center justify-content-center">
        <i class="fa fa-map-marker-alt fa-2x text-primary"></i>
        </div>
        <div class="col-11">
        <p class="mb-0"><strong>To add a location on the map,</strong> simply navigate to the desired area and perform a long tap or right-click on the specific spot.</p>
        </div>
        </div>
        <hr class="my-3">
        <div class="row">
        <div class="col-1 d-flex align-items-center justify-content-center">
        <i class="fa fa-search-location fa-2x text-primary"></i>
        </div>
        <div class="col-11">
        <p class="mb-0"><strong>If you have the exact address of the location</strong> you'd like to add, please enter it into the search field and select from the dropdown list that will present suggested matches.</p>
        </div>
        </div>
        </div>

        <div id="geocoderSearchbox" class="mt-3"></div>

    </div>
</div>



<div id="map-controls" class="offcanvas offcanvas-bottom max500-bottom-offcanvas no-propagation" tabindex="-1" aria-labelledby="map-controls-modal"  aria-hidden="true">

        <div class="offcanvas-header">

            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body overflow-auto">
           

        <div id="tile-chooser"></div>

        </div>

</div>