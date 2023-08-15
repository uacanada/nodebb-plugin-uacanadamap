<li data-type="item" class="list-group-item p-3" data-item-slug="{slug}">
    <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center">
            <i data-icon-class="{icon}" class="fa fas {icon} me-3" style="color:{color}"></i>
            <h5 class="mb-0 ml-3" style="color:{color}"> {title}</h5>
        </div>
        <span class="badge text-bg-secondary"><i class="fa fa-solid fa-link me-2"></i> {slug}</span>
    </div>
    <div class="text-truncate mb-2">
        <p class="mb-0">{description}</p>
    </div>

    {{{ if placeByTagCollector }}} <div class="mb-2"> {tagsFromString(placeByTagCollector)} </div> {{{end}}}

    <div class="d-flex justify-content-end">
        {{{ if footer }}} <button type="button" data-type="edit"
            class="btn btn-outline-secondary btn-sm rounded me-5"><i class="fa-solid fa-sheet-plastic me-1"></i> html
            footer</button> {{{end}}}

        <button type="button" data-type="edit" class="btn btn-outline-secondary btn-sm rounded-circle me-2"><i
                class="fas fa-edit"></i></button>
        <button type="button" data-type="remove" class="btn btn-outline-danger btn-sm rounded-circle"><i
                class="fas fa-trash-alt"></i></button>
    </div>

</li>