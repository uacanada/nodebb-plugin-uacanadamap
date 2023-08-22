<li data-type="item" class="list-group-item p-3" data-advmarker-id="{id}">


    {{{ if advMarkerImg }}} <img style="width: 64px; height: 64px;"
        class="border me-3 float-start rounded-circle markerImage" src="{advMarkerImg}" /> {{{end}}}

    <div class="d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center">
            <h5 class="mb-0" style="color:{color}"><i data-icon-class="{icon}" class="fa fas {icon} me-3"
                    style="color:{color}"></i> {title}</h5>
        </div>


    </div>
    <div class="d-block mb-3">
        <span class="badge text-bg-secondary"><i class="fa fa-solid fa-tag me-3"></i> {id}</span>
        <span class="badge text-bg-primary"><i class="fa fa-solid fa-link"></i> {url}</span>
    </div>






    {{{ if advMarkerTags }}} <div class="mb-3"> {tagsFromString(advMarkerTags)} </div> {{{end}}}

    <div class="d-flex justify-content-end mt-3">

        <button type="button" data-type="edit" class="btn btn-outline-secondary btn-sm rounded me-5"><i
                class="fa fas fa-regular fa-compass me-3"></i> {latlng}</button>

        <button type="button" data-type="edit" class="btn btn-outline-secondary btn-sm rounded me-5"><i
                class="fa-solid fa-sheet-plastic me-1"></i> {{{ if popup }}} popup {{{end}}} {{{ if card }}} / card
            {{{end}}}
        </button>

        <button type="button" data-type="edit" class="btn btn-outline-secondary btn-sm rounded-circle me-2"><i
                class="fas fa-edit"></i></button>
        <button type="button" data-type="remove" class="btn btn-outline-danger btn-sm rounded-circle"><i
                class="fas fa-trash-alt"></i></button>
    </div>

</li>