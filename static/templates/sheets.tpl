<div id="ua-bottom-sheet" class="bottom-sheet offcanvas offcanvas-bottom no-propagation" tabindex="-1" data-ua-size="0"
        aria-labelledby="ua-bottom-sheet-Label">


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



<div id="attribution-modal" class="offcanvas offcanvas-bottom no-propagation" tabindex="-1"
        aria-labelledby="attribution-modal" aria-hidden="true">

        <div class="offcanvas-header">

                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body overflow-auto">
                <p>To make your experience friendly and secure we use a variety of technologies:</p>
                <div id="attribution-text"></div>
        </div>

</div>