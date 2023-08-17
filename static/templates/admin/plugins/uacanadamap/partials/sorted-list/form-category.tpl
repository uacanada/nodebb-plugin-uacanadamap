<form id="acpPlaceCategory" class="uacanadamap-acp-bootbox">

    <div class="mb-3">
        <label class="form-label" for="acp-ua-title">Place Category Name</label>
        <small class="form-text d-block">Enter the name of the global category. These categories allow for grouping tabs
            with
            location lists in the bottom panel.</small>
        <input type="text" id="acp-ua-title" name="title" class="form-control" placeholder="e.g.: Hotels"
            autocomplete="off" />
    </div>


    <div class="mb-3">
        <label class="form-label" for="acp-ua-slug">Place Category Slug</label>
        <small class="form-text d-block">Enter the desired slug for the global category. We recommend using short,
            memorable,
            and succinct short names without special characters</small>
        <input type="text" id="acp-ua-slug" name="slug" class="form-control" placeholder="e.g.: hotels"
            autocomplete="off" />
    </div>


    <div class="mb-3">
        <label class="form-label" for="acp-ua-description">Category Description</label>
        <small class="form-text d-block">Create a description for the category. This description will be displayed in
            the
            catefories tabs of the bottom panel.</small>
        <input type="text" id="acp-ua-description" name="description" class="form-control"
            placeholder="Category Description" autocomplete="off" />
    </div>




    <div class="mb-5">


        <div class="row">

            <div class="col-md-6">
                <label class="form-label" for="acp-ua-icon">Category Icon</label>
                <button id="iconPickerButton" class="w-100 btn rounded btn-outline-secondary" type="button"
                    style="height: 3rem;"><i class="fa fa-icons"></i></button>
                <input type="text" id="acp-ua-icon" name="icon" class="form-control fa-icon d-none"
                    placeholder="Category Icon" value="" readonly />
            </div>
            <div class="col-md-6">
                <label class="form-label" for="acp-ua-color">Category Color</label>
                <input data-settings="colorpicker" data-preview-target="iconPickerButton" data-preview-prop="color"
                    type="color" id="acp-ua-color" name="color" title="Category Color"
                    class="form-control w-100 p-0 m-0 rounded overflow-hidden shadow" placeholder="#000000"
                    value="#000000" style="height: 3rem;" />
            </div>
            <div class="col-12">
                <small class="form-text d-block">Specify the icon and color for the category. The icon affects the
                    design of the
                    markers on the map, so choose wisely. The color does not affect the marker's design, but it does
                    influence the design of the tabs in the bottom panel</small>
            </div>
        </div>

    </div>

    <div class="mb-5">
        <label class="form-label" for="acp-ua-footer">Category Footer (optional)</label>
        <small class="form-text d-block mb-2">You can create a footer for the category. The content will be displayed on
            the
            tab for
            this category in the bottom panel. It will appear at the end of the category's item list, at the very
            bottom. You may use HTML. This placeholder is suitable for placing advertising banners or links at the end
            of the category</small>
        <textarea type="text" id="acp-ua-footer" name="footer" class="form-control" placeholder="<div></div>"
            autocomplete="off"></textarea>
    </div>


    <label class="form-label" for="placeByTagCollector">Tags</label>
    <small class="form-text d-block mb-2">You may define a list of tags. If a location on the map matches one of these
        tags,
        it will
        be included under this category's tab</small>
    <div class="mb-3 bootstrap-tagsinput">
        <input data-field-type="tagsinput" type="text" id="placeByTagCollector" name="placeByTagCollector" />
    </div>



</form>