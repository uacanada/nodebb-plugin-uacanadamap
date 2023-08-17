<form id="advMarkers" class="uacanadamap-acp-bootbox">


    <div class="mb-3">
        <div class="row">
            <div class="col-md-6">
                <label class="form-label" for="advMarkerTitle">Marker title</label>
                <input type="text" id="advMarkerTitle" name="title" class="form-control" placeholder="marker title..."
                    autocomplete="off" />
            </div>
            <div class="col-md-6">
                <label class="form-label" for="advMarkerUrl">Marker URL</label>
                <input type="text" id="advMarkerUrl" name="url" class="form-control" placeholder="/topic/123 or URL"
                    autocomplete="off" />

            </div>
        </div>
    </div>

    <div class="mb-3">


        <div class="row">
            <div class="col-md-6">
                <label class="form-label" for="acp-ua-icon">Marker Icon</label>
                <button id="iconPickerButton" class="w-100 btn rounded btn-outline-secondary" type="button"
                    style="height: 3rem;"><i class="fa fa-icons"></i></button>
                <input type="text" id="acp-ua-icon" name="icon" class="form-control fa-icon d-none" placeholder="Icon"
                    value="" readonly />
            </div>
            <div class="col-md-6">
                <label class="form-label" for="advMarkerColor">Marker Color</label>
                <input data-settings="colorpicker" data-preview-target="iconPickerButton" data-preview-prop="color"
                    type="color" id="advMarkerColor" name="color" title="Color"
                    class="form-control w-100 p-0 m-0 rounded overflow-hidden shadow" placeholder="#000000"
                    value="#000000" style="height: 3rem;" />
            </div>
        </div>

    </div>

    <div class="mb-3">
        <label class="form-label" for="advMarkerImg">Marker Image</label>
        <div class="d-flex gap-1">
            <input id="advMarkerImg" name="advMarkerImg" type="text" class="form-control" />
            <input value="Upload" data-action="upload" data-target="advMarkerImg" type="button" class="btn btn-light" />
        </div>
    </div>




    <div class="mb-3">
        <label class="form-label" for="advMarkerLatLng">Lat,Lng</label>
        <input type="text" id="advMarkerLatLng" name="latlng" class="form-control" placeholder="123.001,456.111"
            autocomplete="off" />
    </div>



    <div class="mb-3">
        <label class="form-label" for="advPopup">Popup HTML</label>
        <textarea type="text" id="advPopup" name="popup" class="form-control"></textarea>
    </div>

    <div class="mb-3">
        <label class="form-label" for="advCard">Card HTML</label>
        <textarea type="text" id="advCard" name="card" class="form-control" placeholder="< Type Card HTML here />"
            autocomplete="off"></textarea>
    </div>


    <div class="mb-3">
        <label class="form-label" for="advMarkerId">Uniq Marker ID/Slug</label>
        <input type="text" id="advMarkerId" name="id" class="form-control" autocomplete="off" />
    </div>



    <div class="mb-3 bootstrap-tagsinput">
        <input data-field-type="tagsinput" type="text" id="advMarkerTags" name="advMarkerTags" />
    </div>


</form>