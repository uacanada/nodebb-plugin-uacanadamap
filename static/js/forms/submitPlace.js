'use strict';
define('forms/submitPlace',['../uacanadamap'], function(UacanadaMap) { 
    const { L, map } = UacanadaMap;
  
    UacanadaMap.form.convertToMonth=(dateString)=> {
      const date = new Date(dateString);
      const options = { month: 'short' };
      const month = date.toLocaleString('en-US', options);
      return month;
    }
  
    UacanadaMap.form.convertToWeekday=(dateString)=> {
      const date = new Date(dateString);
      const options = { weekday: 'long' };
      const weekday = date.toLocaleString(undefined, options);
      return weekday;
    }
  
    UacanadaMap.form.convertToDay=(dateString)=> {
      const date = new Date(dateString);
      const day = date.getDate();
      return day;
    }
  
     
    // UacanadaMap.form.placeTagsHandler = () => {
  
    //       //bootstrap-tagsinput.github.io/bootstrap-tagsinput/examples/
    //       $('#place-tag-input').tagsinput({  maxChars: 24, maxTags: 10, tagClass: "badge bg-info", confirmKeys: [13, 44], trimValue: true});
    //   }  
  
  
  // TODO remove  UacanadaMap.form.submitPlace   ???
      UacanadaMap.form.submitPlace = async (e) => {
          e.preventDefault();
          let formIsValid = true;
          const [lat, lng] = $("#ua-latlng-text").val().split(",");
          UacanadaMap.choosedLocation = [lat, lng];
          let notSended = true;
        
          if (!notSended) {
            console.log("AllReady Sended!!!");
            return;
          }
        
          if (UacanadaMap.currentmarker) {
            map.removeLayer(UacanadaMap.currentmarker);
          }
        
          UacanadaMap.currentmarker = L.marker([lat, lng], { icon: UacanadaMap.icon })
            .addTo(map)
            .bindPopup(`<p>⏳ Creating a location for you...</p><code>${lat},${lng}</code>`)
            .openPopup();
        
          const formhtml = $("form#ua-custom-loc-form")[0];
          const formData = new FormData(formhtml);
          formData.append("gps", [lat, lng]);
          formData.append("uid", app.user.uid);
          formData.append("userslug", app.user.userslug);
        
          if ($("input[type=file]#ua-location-cover-img")[0].files[0]) {
            formData.append("image", $("input[type=file]#ua-location-cover-img")[0].files[0]);
          }
        
          const validatefields = document.querySelectorAll(".needs-validation");
        
          Array.from(validatefields).forEach((field) => {
            if (!field.checkValidity()) {
              formIsValid = false;
            }
        
            if (!formIsValid) {
             
                UacanadaMap.console.log("NOT VALID FORM DATA! ", [...formData]);
          
            }
        
            if (!$("#ua-newplace-city").val() || !$("#location-province").val()) {
              const addressAccordion = $("#address-accordion-collapseOne");
              if (!addressAccordion.hasClass("show")) {
                addressAccordion.collapse("toggle");
              }
            }
        
            if (!$("#mainUsername").val()) {
              const contactsAccordion = $("#contacts-accordion-collapseOne");
              if (!contactsAccordion.hasClass("show")) {
                contactsAccordion.collapse("toggle");
              }
            }
        
            if (!$("#placeDescription").val()) {
              $("#desc-eng").click();
            }
        
            field.classList.add("was-validated");
          });
        
          if (formIsValid && notSended) {
            $("#place-creator-offcanvas").offcanvas("hide");
            notSended = false;
            localStorage.setItem("uamaplocation", JSON.stringify([lat, lng]));
        
            if (UacanadaMap.adminsUID) {
              console.log("try save localStorage", JSON.stringify([lat, lng]), [...formData]);
            }
        
            try {
              const res = await fetch("/maplocationapi/", { method: "POST", body: formData });
              const response = await res.json();
        
              if (response.ok && response.url) {
                // TODO improve design
                UacanadaMap.currentmarker.bindPopup(`
                  <p>A topic has been created for your location: <a href="/topic/${response.url}">/topic/${response.url}</a></p>
                
                `);
                UacanadaMap.map.setView([lat, lng], 16);
                UacanadaMap.currentmarker.openPopup();
               // $(location).prop("href", `/?place=${response.data.tid}`);
              } else {
                UacanadaMap.currentmarker.bindPopup(`Error! ${response.error}`).openPopup();
              }
            } catch (error) {
              if (UacanadaMap.adminsUID) {
                console.log("Request failed", error);
              }
              UacanadaMap.currentmarker.bindPopup("Error...").openPopup();
            }
          }
        };
        
  
  
        /**
         * Creating place on map
         * 
         */
  
        let canSendForm = true;
       
        $('#place-creator-offcanvas').on('hidden.bs.offcanvas', ()=> { canSendForm = true;  });
        document.getElementById('ua-custom-loc-form').addEventListener('submit', async (event) => {
          event.preventDefault();
          const form = event.target;
        
          if (UacanadaMap.currentmarker) {
            map.removeLayer(UacanadaMap.currentmarker);
          }
        
          if (!canSendForm) {
            console.log("Already Sent!!!");
            return;
          }
        
          let formIsValid = form.checkValidity();
          form.classList.add("was-validated");
        
          if (!formIsValid) {
            if (!$("#ua-newplace-city").val() || !$("#location-province").val()) {
              const addressAccordion = $("#address-accordion-collapseOne");
              if (!addressAccordion.hasClass("show")) {
                addressAccordion.collapse("toggle");
              }
            }
            if (!$("#mainUsername").val()) {
              const contactsAccordion = $("#contacts-accordion-collapseOne");
              if (!contactsAccordion.hasClass("show")) {
                contactsAccordion.collapse("toggle");
              }
            }
            if (!$("#placeDescription").val()) {
              $("#desc-eng").click();
            }
        
            UacanadaMap.currentmarker.bindPopup(`You need to fix errors before submitting the place!`).openPopup();
            $('#submit-place-errors').html(`Please check the required fields and try again`);
        
          } else if (formIsValid && canSendForm) {
            canSendForm = false;
            const fields = $(form).serializeArray();
        
            const [lat, lng] = $("#ua-latlng-text").val().split(",");
            UacanadaMap.currentmarker = L.marker([lat, lng], { icon: UacanadaMap.icon }).addTo(map).bindPopup(`<p>⏳ Creating new place...</p><code>${lat},${lng}</code>`).openPopup();
            const formData = new FormData();
            
            for (let field of fields) {
              formData.append(field.name, field.value);
  
              if(field.name === "placeCategory" && field.value){
                formData.append("categoryName", UacanadaMap.categoryMapper[field.value]);
              }
  
              if(field.name === "eventCategory" && field.value){
                formData.append("eventCategoryName",UacanadaMap.eventCatMapper[field.value]);
              }
            
              if(field.name === "eventStartDate" && field.value){
                formData.append("startMonth", UacanadaMap.form.convertToMonth(field.value));
                formData.append("startDayName", UacanadaMap.form.convertToWeekday(field.value));
                formData.append("startDayDigit", UacanadaMap.form.convertToDay(field.value));
              }
  
              if(field.name === "eventEndDate" && field.value){
                formData.append("endMonth", UacanadaMap.form.convertToMonth(field.value));
                formData.append("endDayName", UacanadaMap.form.convertToWeekday(field.value));
                formData.append("endDayDigit", UacanadaMap.form.convertToDay(field.value));
              }
  
  
  
  
            }
  
  
  
            
  
  
            if ($("input[type=file]#ua-location-cover-img")[0].files[0]) {
              formData.append("image", $("input[type=file]#ua-location-cover-img")[0].files[0]);
            }
            formData.append("gps", [lat, lng]);
            const response = await fetch('/api/config');
            const data = await response.json();
            const csrfToken = data.csrf_token;
        
            const headers = {
              'x-csrf-token': csrfToken
            };
            const postResponse = await fetch(UacanadaMap.routers.addplace, { method: 'POST', headers, body: formData });
            const res = await postResponse.json();
        
           
              UacanadaMap.console.log(res);
          
        
            if (res.status.code === 'ok' && res.response.status === "success") {
              $("#place-creator-offcanvas").offcanvas("hide");
        
              const tid = Number(res.response.tid);
              UacanadaMap.currentmarker.bindPopup(`
                <p>A topic has been created for your place: <a href="/topic/${tid}">/topic/${tid}</a></p>
              `);
              UacanadaMap.map.setView([lat, lng], 13);
              UacanadaMap.currentmarker.openPopup();
            } else if (res.response.error) {
              canSendForm = true;
              UacanadaMap.currentmarker.bindPopup(`ERROR: ${res.response.error}`).openPopup();
              $('#submit-place-errors').html(`<strong>Error:</strong> ${res.response.error}`);
            } else if (res.response.status?.code === "internal-server-error") {
              UacanadaMap.currentmarker.bindPopup(`FILE ERROR`).openPopup();
              $('#submit-place-errors').html(`<strong>File Error</strong>`);
            } else {
              canSendForm = true;
              UacanadaMap.currentmarker.bindPopup(`Something went wrong`).openPopup();
              $('#submit-place-errors').html(`<strong>Unhandled Error:</strong> ${res.response.error}`);
            }
          }
        });
        
  
  
  
  
  
  })