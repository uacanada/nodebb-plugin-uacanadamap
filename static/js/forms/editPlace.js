'use strict';
define('forms/editPlace',['core/uacanadamap'], function(UacanadaMap) { 

    UacanadaMap.form.reset = () => {
        
        document.getElementById("ua-custom-loc-form").reset()
        UacanadaMap.form.tags = []
        $("#tag-container").html('')
         $("#ua-form-event-holder").html('')


    }

    UacanadaMap.api.clearFormFields=()=>{
        $('#uaMapAddress').val('');
        $('#subaddress').val('');
        $('#ua-newplace-city').val('');
        $("#ua-latlng-text").val('');
    };

    UacanadaMap.form.socialTypeIconAdjust = (e) => {
        try {
            const inputs = 'form#ua-custom-loc-form input[name="socialtype"]';
            const checkedInput = $(inputs).filter(':checked');
            const ico = checkedInput.next().find('i');
            const icoFaClasses = ico.attr('class');
            const icoStyle = ico.attr('style');
            
            const socialtypeIco = $('#socialtype-ico');
            if (icoFaClasses) {
              socialtypeIco.attr('class', icoFaClasses);
            }
            else {
              socialtypeIco.attr('class', 'fa-solid fa-at');
            }
            
            if (icoStyle) {
              socialtypeIco.attr('style', icoStyle);
            }
            else {
              socialtypeIco.removeAttr('style');
            }
            
            console.log({checkedInput})

        } catch (error) {
           // console.log(error);
        }
        
    }

    UacanadaMap.form.editPlace = (tid) => {
      const topic_id = tid ? Number(tid) : 0;
      if (!topic_id) return;
      
      UacanadaMap.form.reset();
    
      fetch(`/api/v3/plugins/map/getplace/${topic_id}`, { method: "GET" })
        .then((res) => res.json())
        .then((x) => {
          if (x?.response?.tid && x?.response?.placeOnMap) {
            const place = x.response.placeOnMap;

            $('#place-tag-input').tagsinput('removeAll');
            $('#place-tag-input').val('')
    
            if (place.eventCategory) {
              $("#ua-form-event-holder").html(UacanadaMap.uaEventPartFormHTML);
              $("#eventSwitcher").prop("checked", true);
            }
    
            UacanadaMap.choosedLocation = place.latlng.length === 2 ? place.latlng : UacanadaMap.defaultLatLng;
            $("#ua-latlng-text").val(UacanadaMap.choosedLocation.join(","));
    
            if (UacanadaMap.adminsUID) console.log(UacanadaMap.choosedLocation, place);
    
            $('form#ua-custom-loc-form [name="tid"]').val(topic_id);
    
            for (const inputKey in place) {
              try {
                if (inputKey == "eventWeekDay" || inputKey == "socialtype") {
                  const value = place[inputKey] ?? "";
                  $(`form#ua-custom-loc-form [value="${value}"]`).prop("checked", true);
                  
                  if (inputKey == "socialtype") UacanadaMap.form.socialTypeIconAdjust();
                } else if (inputKey == "placetags" && place['placetags'].length > 0) {

                  const tagString =  place['placetags'].join(',')
                 
                  $('#place-tag-input').val(tagString)
                  $('#place-tag-input').tagsinput('add',tagString)

                } else if (inputKey == "image") {
                   if(place["placethumb"]){
                    $("#ua-form-img-holder").html('<img src="'+place["placethumb"]+'"/>')

                   }
                 
                } else {
                  $(`form#ua-custom-loc-form [name="${inputKey}"]`).val(place[inputKey]);
                }
              } catch (error) {
                console.log(place[inputKey], error);
              }
            }
    
            $("#place-creator-offcanvas").offcanvas("show");
          } else {
            console.log(x);
          }
        })
        .catch((error) => {
          if (UacanadaMap.adminsUID) console.log("Request failed", error);
        });
    
      UacanadaMap.api.toggleFs();
    }
    
    
})