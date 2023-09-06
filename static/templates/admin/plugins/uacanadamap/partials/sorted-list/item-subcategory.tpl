<li data-type="item" class="list-group-item" data-item-slug="{slug}">
    <div class="row">
        <div class="col-9">
            <strong><i data-icon-class="{icon}" class="fa fas {icon} me-1"></i> {name}</strong> <small><span
                    class="badge text-bg-success"><i class="fa fas fa-solid fa-tag"></i>
                    {slug}</span></small> <br />
            <small>Forum Category: ( cid: {cid} ) {cidname}</small> <br />


            {{{ if parents }}}

            <div class="mt-3 mb-2"> {tagsFromString(parents)} </div>

            <code data-parents-for="{slug}"
                class="d-none hidden-parents-data">{setParentCatOptions(slug,parents)}</code>

            {{{else}}}
            NEED SET PARENT CATEGORIES!
            {{{end}}}

           


            {{{ if visibleOnlyWhenChosen == 'on' }}}  Markers in this category show only when selected. {{{end}}}
              
        </div>
        <div class="col-3 text-end">

            <button type="button" data-type="edit" class="btn btn-outline-secondary btn-sm rounded-circle me-2"><i
                    class="fas fa-edit"></i></button>
            <button type="button" data-type="remove" class="btn btn-outline-danger btn-sm rounded-circle"><i
                    class="fas fa-trash-alt"></i></button>
        </div>
    </div>
</li>