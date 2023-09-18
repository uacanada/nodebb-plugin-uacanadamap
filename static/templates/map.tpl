<div id="ua-mainframe" class="position-relative w-100" style="opacity:0">
    <div id="uacamap-wrapper" class="position-fixed top-0">
        <div id="uacamap" class="w-100">

            <!-- IMPORT mapHero.tpl -->
            <!-- IMPORT topButtons.tpl -->
           
            

           



            <div id="cardsSwiperPlaceholder" class="ps-1 slider-closed">

            </div>


            <div id="scrollableBottomPanel" class="pe-none user-select-none w-100 position-absolute no-propagation top-0 start-0" aria-hidden="true">
               
                <div class="container p-0">
                    <div class="sheet-spacer pe-none user-select-none w-100"></div>
                    <div class="sheet-dragger pe-auto text-center w-100 user-select-none" aria-label="Draggable sheet handler"><i class="fa-solid fa-minus"></i></div>
                    <div class="sheet-content pe-auto w-100 p-1" role="region" aria-label="Sheet content">
                        <div id="sheet-content-loader" class="p-0 m-0" aria-busy="true"></div>
                    </div>
                </div>

            </div>
            <div id="bottomPanelCategoryButtons" class="swiper no-propagation position-fixed bottom-0 start-50 container"></div>



            <div class="toast-container">
                <div id="error-toast" class="toast top-0 start-50 translate-middle-x" role="alert" aria-live="assertive"
                    aria-atomic="true">
                    <div class="toast-header">
                        <strong class="toast-title me-auto">Error</strong>
                        <small class="toast-meta">Advice</small>
                        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                    <div class="toast-body">Try again...</div>
                </div>
            </div>



            <div id="mapattribution">
                <div class="mapbox-logo"></div> <span data-bs-toggle="offcanvas" data-bs-target="#attribution-modal"><i
                        class="fa-solid fa-circle-info"></i></span>
            </div>

             <!-- IMPORT contextButtons.tpl -->
             <!-- IMPORT sheets.tpl -->
             <!-- IMPORT submitPlace.tpl -->
             <div id="targetForNewPlaceWrapper" class="d-none position-fixed top-0 start-0 w-100 h-100 p-0 m-0">
                <div id="targetForNewPlace">
                    <div class="ua-markers marker-selector d-flex align-items-center marker-container">
                        <span id="locationSelectionLatLng"></span> 
                        <button title="Add place here" class="btn btn-sm rounded-pill newLocationCreateButton" type="button"><i class="fa fas fa-solid fa-check"></i> Create</button>
                        <div class="circle-icon rounded-circle shadow d-flex align-items-center justify-content-center"><i class="fa fa-fw fas fa-solid fa-compass"></i></div>
                        <button title="Add place here" class="btn rounded-pill newLocationCancelButton" type="button"><i class="fa-solid fa-xmark"></i></button>  
                    </div>
                </div>
             </div>

             <div id="geocoderSearchbox"></div>
        </div>
    </div>
</div>