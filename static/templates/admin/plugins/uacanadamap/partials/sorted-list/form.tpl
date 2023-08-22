<form id="acpPlaceCategory">
    
    <div class="mb-3">
        <label class="form-label" for="acpCategoryName">Place Category Name</label>
        <input type="text" id="acpCategoryName" name="acpCategoryName" class="form-control" placeholder="Place Category Name" />
    </div>


    <div class="mb-3">
        <label class="form-label" for="acpCategorySlug">Place Category Slug</label>
        <input type="text" id="acpCategorySlug" name="acpCategorySlug" class="form-control" placeholder="Place Category Slug" />
    </div>

    <div class="mb-3 d-flex gap-2">
		
    </div>


    <div class="mb-3">
        <label class="form-label" for="acpCategoryDescription">Category Description</label>
        <input type="text" id="acpCategoryDescription" name="acpCategoryDescription" class="form-control" placeholder="Category Description" />
    </div>


    <div class="mb-3">
        <label class="form-label" for="acpCategoryFooter">Category Footer</label>
        <input type="text" id="acpCategoryFooter" name="acpCategoryFooter" class="form-control" placeholder="Category Footer" />
    </div>

    <div class="mb-3">


        <div class="row">
            <div class="col-md-6">
                <label class="form-label" for="acpCategoryIcon">Category Icon</label>
                <button id="iconPickerButton" class="w-100 btn rounded btn-outline-secondary" type="button" style="height: 3rem;"><i class="fa fa-icons"></i></button>
                <input type="text" id="acpCategoryIcon" name="acpCategoryIcon" class="form-control fa-icon d-none" placeholder="Category Icon" value="" readonly/>
            </div>
            <div class="col-md-6">
                <label class="form-label" for="acpCategoryColor">Category Color</label>
                <input data-settings="colorpicker" data-preview-target="iconPickerButton" data-preview-prop="color" type="color" id="acpCategoryColor" name="acpCategoryColor" title="Category Color" class="form-control w-100 p-0 m-0 rounded overflow-hidden shadow" placeholder="#000000" value="#000000" style="height: 3rem;"/>
            </div>
        </div>


    

      
    </div>


</form>