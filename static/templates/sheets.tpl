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



<div id="attribution-modal" class="ua-bottom-panels offcanvas offcanvas-bottom no-propagation" tabindex="-1" aria-labelledby="attribution-modal" aria-hidden="true">

        <div class="offcanvas-header">

                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body overflow-auto">
                <p>To make your experience friendly and secure we use a variety of technologies:</p>
                <div id="attribution-text"></div>
        </div>

</div>


<div id="sortPlacesOffcanvas" class="ua-bottom-panels offcanvas offcanvas-bottom no-propagation p-3" tabindex="-1" aria-labelledby="sortPlacesOffcanvasLabel" aria-hidden="true">
    <div class="offcanvas-header">
        <h5 id="sortPlacesOffcanvasLabel">Sort By:</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body overflow-auto ">
     
                <div class="list-group">
                <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="distance" href="#">
                        <i class="fas fa-road me-2"></i> Distance
                </a>
                <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="latest" href="#">
                        <i class="fas fa-hourglass-start me-2"></i> Latest
                </a>
                <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="oldest" href="#">
                        <i class="fas fa-hourglass-end me-2"></i> Oldest
                </a>
                <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="events" href="#">
                        <i class="fas fa-calendar-alt me-2"></i> Event Date
                </a>
                <a class="ua-sort list-group-item list-group-item-action d-flex align-items-center border-bottom" data-ua-sortby="category" href="#">
                        <i class="fas fa-folder me-2"></i> Category
                </a>
                <div class="list-group-item border-bottom mt-5 py-2">
                   <select id="location-category-filter" name="categoryfilter" class="form-select w-100 rounded-pill" aria-label="category"></select>
                </div>
                </div>




    </div>
</div>


<div id="addPlaceInstructions" class="ua-bottom-panels d-flex flex-column no-propagation offcanvas offcanvas-bottom p-3" tabindex="-1" aria-labelledby="addPlaceInstructionsOffcanvasLabel" aria-hidden="true">
    <div class="offcanvas-header">
        <h5 id="addPlaceInstructionsOffcanvasLabel">Add a Place to the Map</h5>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
     
        {UacanadaMapSettings.placeInstruction}
        

    </div>
</div>






<div id="map-controls" class="ua-bottom-panels offcanvas offcanvas-bottom no-propagation" tabindex="-1" aria-labelledby="map-controls-modal"  aria-hidden="true">

        <div class="offcanvas-header">

            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body overflow-auto">
           

        <div id="tile-chooser"></div>

        </div>

</div>