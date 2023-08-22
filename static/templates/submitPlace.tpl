<div id="place-creator-offcanvas" class="offcanvas offcanvas-bottom no-propagation" style="max-width: 800px"
    data-bs-backdrop="true" tabindex="-1" aria-labelledby="place-creator-offcanvasLabel" role="dialog"
    aria-hidden="true">
    <div class="offcanvas-header">
        <h1 class="offcanvas-title fs-5" id="place-creator-offcanvasLabel">
            <div class="spinner-grow spinner-grow-sm" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            Place creator
        </h1>
        <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div id="ua-loc-form-target" class="offcanvas-body overflow-auto offcanvas-body overflow-auto mb-5 pb-5">
        <form id="placeForm" class="row g-3 needs-validation" action="/api/v3/plugins/map/addplace"
            enctype="multipart/form-data" method="post" novalidate>
            <div class="col-12 col-sm-6 has-validation mb-3">
                <div class="input-group">
                    <span class="input-group-text"><i class="fa-solid fa-pen-nib"></i></span>
                    <input type="text" class="form-control" maxlength="60" name="placeTitle" id="placeTitle"
                        placeholder="Short Title" required>
                </div>
                <div id="placeTitleHelpBlock" class="form-text">Location Title</div>
                <div class="invalid-feedback">Max 40 symbols!</div>
            </div>

            <div class="col-12 col-sm-6 has-validation">
                <select id="location-category" name="placeCategory" class="form-select" aria-label="category" required>

                </select>
                <div id="categotyHelpBlock" class="form-text mb-3">Choose Category for your location</div>

            </div>

            <div class="accordion" id="address-accordion">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="address-accordion-headingOne">
                        <button class="p-2 ps-3 accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#address-accordion-collapseOne" aria-expanded="false"
                            aria-controls="address-accordion-collapseOne">
                            <i class="fa-regular fa-map me-3"></i> Address
                        </button>
                    </h2>
                    <div id="address-accordion-collapseOne" class="accordion-collapse collapse"
                        aria-labelledby="address-accordion-headingOne" data-bs-parent="#address-accordion">
                        <div class="row g-3 mt-3 p-3">

                            <div class="col-12 col-sm-6">
                                <div class="input-group has-validation">
                                    <span class="input-group-text" id="addon-wrapping"> <i class="fa-solid fa-city"></i>
                                    </span>
                                    <input class="form-control" name="city" list="datalistOptions" id="ua-newplace-city"
                                        placeholder="Type to search city or town..." required> <datalist
                                        id="datalistOptions">

                                    </datalist>
                                    <div class="invalid-feedback">(e.g: Vancouver) </div>
                                </div>

                            </div>

                            <div class="col-12 col-sm-6 has-validation">
                                <div class="input-group ">
                                    <span class="input-group-text"> <i class="fa-brands fa-canadian-maple-leaf"></i>
                                    </span>
                                    <select id="location-province" name="province" class="form-select"
                                        aria-label="province" required>

                                    </select>

                                </div>

                            </div>


                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text">📪</span>
                                    <input type="text" class="form-control" name="streetAddress" id="uaMapAddress"
                                        placeholder="1234 Main St">
                                </div>
                                <div id="uaMapAddressHelpBlock" class="form-text mb-3">Optional
                                </div>
                            </div>






                        </div>
                    </div>
                </div>

            </div>




            <div class="accordion" id="contacts-accordion">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="contacts-accordion-headingOne">
                        <button class="p-2 ps-3 accordion-button collapsed" type="button" data-bs-toggle="collapse"
                            data-bs-target="#contacts-accordion-collapseOne" aria-expanded="false"
                            aria-controls="contacts-accordion-collapseOne">
                            <i class="fa-regular fa-address-book me-3"></i> Contact Information
                        </button>
                    </h2>
                    <div id="contacts-accordion-collapseOne" class="accordion-collapse collapse"
                        aria-labelledby="contacts-accordion-headingOne" data-bs-parent="#contacts-accordion">
                        <div class="row g-3 mt-3 p-3">


                            <div class="col-12 col-sm-6">
                                <div class="input-group has-validation">
                                    <button type="button"
                                        class="btn btn-outline-secondary dropdown-toggle dropdown-toggle-split"
                                        data-bs-toggle="dropdown" aria-expanded="false"> <i id="socialtype-ico"
                                            class="fa-solid fa-at"></i> <i class="fa-solid fa-caret-down"></i> <span
                                            class="visually-hidden">Toggle Dropdown</span> </button>
                                    <ul class="dropdown-menu p-2" aria-label="Social network type">
                                        <li class="form-check"><input class="form-check-input" type="radio"
                                                name="socialtype" id="usernamefb" value="facebook"> <label
                                                class="form-check-label" for="usernamefb"><i class="fa fa-facebook"
                                                    style="color:#0065ff"></i> Facebook</label> </li>
                                        <li class="form-check"><input class="form-check-input" type="radio"
                                                name="socialtype" id="usernametg" value="telegram"> <label
                                                class="form-check-label" for="usernametg"><i class="fa fa-telegram"
                                                    style="color:#4faaca"></i> Telegram</label></li>
                                        <li class="form-check"><input class="form-check-input" type="radio"
                                                name="socialtype" id="usernameinsta" value="instagram"> <label
                                                class="form-check-label" for="usernameinsta"><i class="fa fa-instagram"
                                                    style="color:#f45e00"></i> Instagram</label></li>
                                        <li class="form-check"><input class="form-check-input" type="radio"
                                                name="socialtype" id="usernameyt" value="youtube"> <label
                                                class="form-check-label" for="usernameyt"><i class="fa fa-youtube-play"
                                                    style="color:red"></i> Youtube</label></li>
                                        <li class="form-check"><input class="form-check-input" type="radio"
                                                name="socialtype" id="usernamein" value="linkedin"> <label
                                                class="form-check-label" for="usernamein"><i class="fa fa-linkedin"
                                                    style="color:#0a064e"></i> LinkedIn</label></li>
                                        <li>
                                            <hr class="dropdown-divider">
                                        </li>
                                        <li class="form-check"><input class="form-check-input" type="radio"
                                                name="socialtype" id="usernameother" value=""> <label
                                                class="form-check-label" for="usernameother"> Other ...</label></li>
                                    </ul>
                                    <input type="text" class="form-control" id="mainUsername" name="mainUsername"
                                        aria-label="Username on map" placeholder="Main Shortname" required
                                        pattern="[0-9A-Za-z._-]{2,40}">


                                    <div class="invalid-feedback">Username must be 2-40 and 0-9 A-Z a-z ._- </div>
                                </div>
                                <div class="form-text">Required field</div>

                            </div>





                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-instagram"
                                            style="color:#f45e00"></i></span>
                                    <input name="instagram" type="text" class="form-control form-control-sm"
                                        maxlength="100" placeholder="Instagram Username">
                                </div>
                            </div>


                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-facebook"
                                            style="color:#0065ff"></i></span>
                                    <input name="facebook" type="text" class="form-control form-control-sm"
                                        maxlength="100" placeholder="Facebook Username">
                                </div>
                            </div>



                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-youtube-play"
                                            style="color:red"></i></span>
                                    <input name="youtube" type="text" class="form-control form-control-sm"
                                        maxlength="100" placeholder="Youtube Username">
                                </div>
                            </div>

                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-linkedin"
                                            style="color:#084094"></i></span>
                                    <input name="linkedin" type="text" class="form-control form-control-sm"
                                        maxlength="100" placeholder="linkedin Username">
                                </div>
                            </div>

                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa fa-telegram"
                                            style="color:#4faaca"></i></span>
                                    <input name="telegram" type="text" class="form-control form-control-sm"
                                        maxlength="100" placeholder="Telegram Username">
                                </div>
                            </div>

                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa-solid fa-phone"></i></span>
                                    <input name="phone" type="text" class="form-control form-control-sm" maxlength="130"
                                        placeholder="Phone">
                                </div>
                                <div class="form-text">Optional field</div>
                            </div>

                            <div class="col-12 col-sm-6">
                                <div class="input-group">
                                    <span class="input-group-text"><i
                                            class="fa-solid fa-envelope-circle-check"></i></span>
                                    <input name="placeEmail" type="text" class="form-control form-control-sm"
                                        maxlength="100" placeholder="Email address">
                                </div>
                            </div>






                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa-solid fa-globe"></i> </span>
                                    <input type="text" placeholder="uacanada.org" class="form-control"
                                        id="placeExternalUrl" name="placeExternalUrl" aria-label="User url on map">
                                </div>

                            </div>


                            <div class="col-12">
                                <div class="input-group">
                                    <span class="input-group-text"><i class="fa-regular fa-id-badge"></i></span>
                                    <input name="fullname" type="text" class="form-control form-control-sm"
                                        maxlength="130" placeholder="Name or Title">
                                </div>
                                <div class="form-text">Optional field</div>
                            </div>


                        </div>
                    </div>
                </div>
            </div>











            <div class="w-100 mb-5">

                <nav>
                    <div class="nav nav-tabs" id="nav-tab" role="tablist">
                        <button class="nav-link active" id="desc-eng" data-bs-toggle="tab"
                            data-bs-target="#desc-eng-box" type="button" role="tab" aria-controls="desc-eng-box"
                            aria-selected="true">English</button>
                        <button class="nav-link" id="desc-ua" data-bs-toggle="tab" data-bs-target="#desc-ua-box"
                            type="button" role="tab" aria-controls="desc-ua-box"
                            aria-selected="false">Ukrainian</button>

                    </div>
                </nav>
                <div class="tab-content" id="nav-tabContent">
                    <div class="tab-pane fade show active" id="desc-eng-box" role="tabpanel" aria-labelledby="desc-eng"
                        tabindex="0">
                        <div class="input-group has-validation">
                            <textarea required id="placeDescription" minlength="30" maxlength="1000"
                                name="placeDescription" class="form-control mt-2" id="describethelocation"
                                style="height: 15rem"></textarea>
                            <div class="invalid-feedback">min 30; max 1000</div>
                        </div>
                        <div class="form-text">Describe location on English</div>
                    </div>
                    <div class="tab-pane fade" id="desc-ua-box" role="tabpanel" aria-labelledby="desc-ua" tabindex="0">
                        <div class="input-group has-validation">
                            <textarea maxlength="1000" id="placeDescriptionAlt" name="placeDescriptionAlt"
                                class="form-control mt-2" id="describethelocation-alter"
                                style="height: 15rem"></textarea>
                            <div class="invalid-feedback">Max 1000 chars</div>
                        </div>
                        <div class="form-text">Describe location</div>
                    </div>
                </div>

                <div class="mt-3">
                    <input type="text" id="place-tag-input" name="placetags" class="form-control"
                        aria-label="Add a tag">

                </div>




            </div>


            <div class="col-12 col-sm-6 mb-5">
                <div id="ua-form-img-holder"></div>
                <input name="image" type="file" accept="image/*" class="form-control" id="ua-location-cover-img">
            </div>


            <div class="col-md-12">
                <div class="form-check form-switch">
                    <input class="form-check-input" name="eventSwitcher" type="checkbox" role="switch"
                        id="eventSwitcher">
                    <label class="form-check-label" for="eventSwitcher">Convert to an Event with date and time
                        announcement</label>
                </div>
            </div>


            <div id="ua-form-event-holder">

                <div class="col-md-12 mt-3 mb-5">

                    <div class="input-group">
                        <span class="input-group-text">🎟️</span>
                        <input type="text" maxlength="100" placeholder="Event title" class="form-control"
                            name="eventName" id="eventName" aria-label="Event Title" required>
                    </div>
                    <div id="eventNameHelpBlockUA" class="form-text ">
                      Event name
                    </div>
                </div>
                <div class="col-md-12 mb-5">

                    <select id="event-location-category" name="eventCategory" class="form-select"
                        aria-label="eventcategory" required>
                       

                    </select>

                </div>


                <div class="col-md-12 mb-5">
                    <div class="input-group date" data-provide="datepicker">
                        <span class="input-group-text">START</span>
                        <input type="date" class="form-control" id="eventStartDate" name="eventStartDate"
                            aria-label="Event start date" required>
                        <input type="time" id="eventStartTime" class="form-control" name="eventStartTime" required>
                    </div>
                    <div id="eventHelpBlockUA" class="form-text">
                        Date and time when the event starts (required)
                    </div>
                </div>


                <div class="col-md-12 mb-5">
                    <div class="input-group date" data-provide="datepicker">
                        <span class="input-group-text">END</span>
                        <input type="date" class="form-control" id="eventEndDate" name="eventEndDate"
                            aria-label="Event final date">
                        <input type="time" id="eventEndTime" class="form-control" name="eventEndTime">
                    </div>
                    <div class="form-text ">
                        Date and time when the event ends (optional)
                    </div>

                </div>




                <select id="event-day-select" name="eventWeekDay" class="form-select mb-5"
                    aria-label="event-day-select">
                    <option value="" selected>It is weekly event?</option>
                    <option value="">This event not happens every week</option>

                    <option value="Sunday">Every Sunday</option>
                    <option value="Monday">Every Monday</option>
                    <option value="Tuesday">Every Tuesday</option>
                    <option value="Wednesday">Every Wednesday</option>
                    <option value="Thursday">Every Thursday</option>
                    <option value="Friday">Every Friday</option>
                    <option value="Saturday">Every Saturday</option>


                </select>


            </div>



            <div class="collapse mt-5" id="uacollapsecoord">


                <input class="input-for-admin d-none" name="forcedpicture" value="">
                <input class="input-for-admin d-none" name="classesFromAdmin" value="">
                <input class="input-for-admin d-none" name="tid" value="">


                <div class="input-group mt-3">
                    <span class="input-group-text">🎯</span>
                    <input id="ua-latlng-text" class="form-control form-control-sm" name="latlng" type="text"
                        placeholder="Coordinates" aria-label="Coordinates" value="">
                </div>
                <div class="input-group mt-3">
                    <span class="input-group-text">🔎 Keyword</span>
                    <input id="input-search-query" class="form-control form-control-sm" name="searchquery" type="text"
                        aria-label="Search query" value="">
                </div>
                <div class="input-group mt-3">
                    <span class="input-group-text">Related places ID's</span>
                    <input class="form-control form-control-sm" name="relatedPlaces" type="text" placeholder="1,2,3,4"
                        aria-label="relatedPlaces" value="">
                </div>
                <div class="input-group mt-3">
                    <span class="input-group-text">🗺️</span>
                    <input id="subaddress" class="form-control form-control-sm" name="subaddress" type="text"
                        placeholder="subaddress" aria-label="subaddress" value="">
                </div>





            </div>
            <div id="submit-place-errors"></div>


            <div class="col-12 offcanvas-fixed-bottom col-12 d-flex justify-content-end px-4 py-2">

                <button class="btn btn-light" type="button" data-bs-toggle="collapse" data-bs-target="#uacollapsecoord"
                    aria-expanded="false" aria-controls="collapseCoordinates"><i
                        class="fa fa-location-crosshairs"></i></button>
                <button type="button" id="cancel-location" class="btn btn-warning me-3" data-bs-dismiss="offcanvas"><i
                        class="fa fa-close"></i> CANCEL</button>
                <button type="submit" value="Submit" id="submit-place" class="btn btn-success"><i
                        class="fa fa-map-location-dot"></i> SUBMIT </button>
            </div>

        </form>


    </div>

</div>