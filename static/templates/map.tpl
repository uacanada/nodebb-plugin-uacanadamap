<div id="ua-mainframe" class="position-relative w-100" style="opacity:0">
    <div id="uacamap-wrapper" class="position-fixed top-0">
        <div id="uacamap" class="w-100">

            <!-- IMPORT mapHero.tpl -->
            <!-- IMPORT topButtons.tpl -->
           
            

            <div id="mapStatusLine" class="position-absolute top-0 align-items-center border-0 m-2">
                <div class="d-flex">
                    <a href="/" role="button" class="top-reload btn rounded-pill me-3"><i
                            class="fa-solid fa-arrow-rotate-right"></i></a>


                </div>
            </div>



            <div id="ua-map-cards-fullscreen" class="ps-1 slider-closed">

            </div>



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
             <div id="targetForNewPlace d-none">
                <div class="ua-markers marker-selector d-flex align-items-center marker-container">
                    <span id="locationSelectionLatLng"></span> 
                    <button title="Add place here" class="btn btn-sm rounded-pill newlocation-create-button" type="button"><i class="fa fas fa-solid fa-check"></i> Create</button>
                    <div class="circle-icon rounded-circle shadow d-flex align-items-center justify-content-center"><i class="'fa fa-fw fas fa-solid fa-compass fa-spin"></i></div>
                    <button title="Add place here" class="btn rounded-pill newlocation-cancel-button" type="button"><i class="fa-solid fa-xmark"></i></button>  
                </div>
             </div>
        </div>
    </div>
</div>