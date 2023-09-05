<div id="ua-context-buttons-wrapper" class="position-fixed start-0 end-0 w-100 no-propagation px-2">
        <div id="context-buttons-swiper" class="swiper-container">
                <div class="swiper">
                        <div class="swiper-wrapper">

                                <div class="swiper-slide rounded-pill">
                                        <div class="btn-group w-100" role="group"
                                                aria-label="Buttons when cards is opened">
                                                {UacanadaMapSettings.contextButtonSlide}
                                        </div>
                                </div>

                                <div class="swiper-slide rounded-pill">
                                        <div class="btn-group w-100" role="group"
                                                aria-label="Buttons when cards is opened">
                                                <button title="Toggle place cards to list view" id="rotateCards"
                                                        class="btn btn-primary rounded-pill m-1 py-1" type="button">
                                                        <i class="fa-solid fa-toggle-off"></i> List
                                                </button>
                                                <button title="Close Place Cards"
                                                        class="btn btn-danger rounded-pill m-1 py-1 removeCards"
                                                        type="button">
                                                        <i class="fa-solid fa-xmark"></i>
                                                </button>
                                                <button class="btn btn-primary rounded-pill m-1 py-1" type="button"
                                                        data-bs-toggle="offcanvas" data-bs-target="#sortPlacesOffcanvas"
                                                        aria-controls="sortPlacesOffcanvas">
                                                        <i class="fa fa-solid fa-arrow-down-a-z"></i> Distance


                                                </button>

                                        </div>
                                </div>


                                <div class="swiper-slide rounded-pill">
                                        <div class="btn-group w-100" role="group"
                                                aria-label="Buttons when cards is opened"> <button title="Map settings"
                                                        class="btn btn-primary rounded-pill m-1 py-1" type="button"
                                                        data-bs-toggle="offcanvas" data-bs-target="#map-controls"
                                                        aria-controls="map-controls"> <i
                                                                class="fa-solid fa-layer-group"></i> </button> </div>
                                </div>


                                <div class="swiper-slide rounded-pill">
                                        <div class="d-flex align-items-center justify-content-center rounded-pill p-1 text-bg-primary">  <i class="fa fas fa-solid fa-puzzle-piece fa-beat me-3"></i>
                                                <span id="text-info-button" class="text-truncate">...</span>
                                        </div>


                                        


                                </div>

                                <div class="swiper-slide rounded-pill">
                                                <div class="btn-group w-100" role="group"
                                                        aria-label="Buttons when place chooser is opened">
                                                        <button title="Tap to Add a Business or Place at These Coordinates"
                                                                class="btn btn-primary rounded-pill m-1 py-1 newLocationCreateButton"
                                                                type="button">
                                                                <i class="fa fa-solid fa-pin"></i> Add Place Here
                                                        </button>

                                                        <button title="Close place adding"
                                                                class="btn btn-danger rounded-pill m-1 py-1 newLocationCancelButton"
                                                                type="button">
                                                                <i class="fa fa-solid fa-times"></i> Cancel
                                                        </button>



                                                </div>
                                </div>


                        </div>
                </div>
        </div>
</div>