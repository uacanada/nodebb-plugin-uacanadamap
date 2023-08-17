<form id="acpPlaceSubCategory" class="uacanadamap-acp-bootbox">


    <div class="d-none">
        <input type="number" id="acpRouteCid" name="cid" />
        <input type="text" id="acpRouteCidName" name="cidname" />
    </div>


    <div class="mb-3">
        <label class="form-label" for="acpSubCategoryName">Sub Category Name</label>
        <input type="text" id="acpSubCategoryName" name="name" class="form-control" placeholder="Place Category Name"
            autocomplete="off" />
    </div>




    <div class="mb-3">
        <label class="form-label">Select Parent Tabs</label>

        <div class="input-group mb-3"> <select multiple style="height:14rem" class="form-select"
                id="acpParentTabsSelector" name="parents" aria-label="size 14 select">
                {renderParentsOptions()}
            </select> </div>
    </div>


    <div class="mb-3">
        <label class="form-label" for="acpSubCategorySlug">Sub Category Slug</label>
        <input type="text" id="acpSubCategorySlug" name="slug" class="form-control" placeholder="Place Category Slug"
            autocomplete="off" />
    </div>


    <div class="mb-3">
        <label class="form-label" for="acp-ua-icon">Marker icon</label>
        <button id="iconPickerButton" class="w-100 btn rounded btn-outline-secondary" type="button"
            style="height: 3rem;"><i class="fa fa-icons"></i></button>
        <input type="text" id="acp-ua-icon" name="icon" class="form-control fa-icon d-none" placeholder="Category Icon"
            value="" readonly />
    </div>

    <div id="cid-selector-wrapper">
        <!-- IMPORT admin/partials/categories/select-category.tpl -->
    </div>






</form>