<div id="ua-mainframe" class="position-relative w-100" style="opacity:0">
    <div id="uacamap-wrapper" class="position-fixed top-0">
        <div id="uacamap" class="w-100">

            <!-- IMPORT mapHero.tpl -->
            <!-- IMPORT topButtons.tpl -->
            <!-- IMPORT sheets.tpl -->
            <!-- IMPORT submitPlace.tpl -->

            <!-- IMPORT mapControlsCanvas.tpl -->

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

            <!-- IMPORT bottomButtons.tpl -->
        </div>
    </div>
</div>













<div id="ua-shorts" class="modal fade" data-bs-backdrop="static" tabindex="-1" aria-hidden="true">

    <div class="modal-dialog modal-fullscreen-sm-down">
        <div class="modal-content">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>


            <div id="ua-short-wrapper" class="w-100" style="aspect-ratio:9/16"></div>

        </div>
    </div>
</div>

<div id="ua-news-modal" class="modal fade" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalCenterTitle">New locations</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">

                 <a
                        href="https://t.me/uacanada_help">
                        <h4>t.me/uacanada_help</h4>
                    </a></p>
                </p>

                <ul id="ua-news-list" class="mt-5"></ul>

            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <a href="https://t.me/uacanada_help"><button type="button" class="btn btn-primary">Telegram Help
                        Group</button></a>
            </div>

        </div>
    </div>
</div>