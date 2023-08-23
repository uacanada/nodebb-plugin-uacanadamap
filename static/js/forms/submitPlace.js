"use strict";
define("forms/submitPlace", [
  "core/variables" /*   Global object UacanadaMap  */,
], function (UacanadaMap) {
  let canSendForm = true;
  $("#place-creator-offcanvas").on("hidden.bs.offcanvas", () => {
    canSendForm = true;
  });
  document
    .getElementById("placeForm")
    .addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target;

      if (UacanadaMap.currentmarker) {
        UacanadaMap.map.removeLayer(UacanadaMap.currentmarker);
      }

      if (!canSendForm) {
        UacanadaMap.console.log("Already Sent!!!");
        return;
      }

      let formIsValid = form.checkValidity();
      form.classList.add("was-validated");

      if (!formIsValid) {
        checkFormValidation();
        UacanadaMap.currentmarker
          .bindPopup("You need to fix errors before submitting the place!")
          .openPopup();
        $("#submit-place-errors").html(
          "Please check the required fields and try again"
        );
      } else {
        $("#place-creator-offcanvas").offcanvas("hide");
        await handleSubmit(form);
      }
    });

  function checkFormValidation() {
    const checkAndToggleAccordion = (selector, inputSelector) => {
      const accordion = $(selector);
      if (!$(inputSelector).val() && !accordion.hasClass("show")) {
        accordion.collapse("toggle");
      }
    };

    checkAndToggleAccordion(
      "#address-accordion-collapseOne",
      "#ua-newplace-city, #location-province"
    );
    checkAndToggleAccordion("#contacts-accordion-collapseOne", "#mainUsername");
    if (!$("#placeDescription").val()) {
      $("#desc-eng").click();
    }
  }

  async function handleSubmit(form) {
    canSendForm = false;
    const fields = $(form).serializeArray();

    const [lat, lng] = $("#ua-latlng-text")
      .val()
      .split(",")
      .map((coord) => parseFloat(coord.trim()));

    UacanadaMap.currentmarker = UacanadaMap.L.marker([lat, lng], {
      icon: UacanadaMap.icon,
    })
      .addTo(UacanadaMap.map)
      .bindPopup(`<p>⏳ Creating new place...</p><code>${lat},${lng}</code>`)
      .openPopup();
    const formData = processFormData(fields, lat, lng);

    try {
      const response = await fetch("/api/config");
      if (!response.ok) throw new Error("Failed to fetch CSRF token");

      const data = await response.json();

      debugFormData(formData)
      const postResponse = await sendPlaceData(formData, data.csrf_token);

      if (!postResponse.ok) throw new Error(postResponse.statusText);

      handlePostResponse(await postResponse.json(), lat, lng);
    } catch (error) {
      canSendForm = true;
      UacanadaMap.currentmarker
        .bindPopup(`ERROR: ${error.message}`)
        .openPopup();
      $("#submit-place-errors").html(
        `<strong>Error:</strong> ${error.message}`
      );
    }
  }

  function processFormData(fields, lat, lng) {
    const formData = new FormData();
    

    fields.forEach((field) => {
        try {
            const { name, value } = field;

            if (value && value !== 'image') {
                const stringValue = typeof value === 'string' ? value : value.toString();
                formData.append(name, stringValue);
            }

            handleSpecialFields(formData, name, value);

        } catch (error) {
            UacanadaMap.console.log(error);
        }
    });


    formData.append("gps", JSON.stringify([lat, lng]));


    appendImageToFormData(formData);
    

    return formData;
}

function handleSpecialFields(formData, name, value) {
    switch (name) {
        case "placeCategory":
            appendCategoryName(
                formData,
                value,
                ajaxify.data.UacanadaMapSettings.subCategories
            );
            break;
        case "eventCategory":
            appendCategoryName(
                formData,
                value,
                ajaxify.data.UacanadaMapSettings.eventCategories,
                "eventCategoryName"
            );
            break;
        case "eventStartDate":
            appendDateInfo(formData, value, "start");
            break;
        case "eventEndDate":
            appendDateInfo(formData, value, "end");
            break;
    }
}


  function appendCategoryName(
    formData,
    value,
    categories,
    fieldName = "categoryName"
  ) {
    if (value) {
      const category = categories.find((cat) => cat.slug === value);
      formData.append(fieldName, category?.name || "");
    }
  }

  function appendDateInfo(formData, dateValue, prefix) {
    if (dateValue) {
      formData.append(
        `${prefix}Month`,
        UacanadaMap.form.convertToMonth(dateValue)
      );
      formData.append(
        `${prefix}DayName`,
        UacanadaMap.form.convertToWeekday(dateValue)
      );
      formData.append(
        `${prefix}DayDigit`,
        UacanadaMap.form.convertToDay(dateValue)
      );
    }
  }

  function appendImageToFormData(formData) {
    // const imageInput = $("input[type=file]#ua-location-cover-img")[0];
    // if (imageInput.files[0]) {
    //   formData.append("image", imageInput.files[0]);
    // }

    const imageInput = document.querySelector("input[type=file]#ua-location-cover-img");

    if (imageInput && imageInput.files.length > 0) {
        for (let i = 0; i < imageInput.files.length; i++) {
            const file = imageInput.files[i];
            formData.append("image", file);
        }
    }


  }

  async function sendPlaceData(formData, csrfToken) {
    const headers = {
      "x-csrf-token": csrfToken,
    };
    return await fetch(UacanadaMap.routers.addplace, {
      method: "POST",
      headers,
      body: formData,
    });
  }

  function handlePostResponse(res, lat, lng) {
    if (res.status.code === "ok" && res.response.status === "success") {
      // $("#place-creator-offcanvas").offcanvas("hide");
      const tid = Number(res.response.tid);
      UacanadaMap.currentmarker.bindPopup(`
                  <p>A topic has been created for your place: <a href="/topic/${tid}">/topic/${tid}</a></p>
              `);
      UacanadaMap.map.setView([lat, lng], 13);
      UacanadaMap.currentmarker.openPopup();
    } else {
      $("#place-creator-offcanvas").offcanvas("show");
      throw new Error(res.response.error || "Unexpected error");
    }
  }

  const debugFormData = (data) => {
    if(app.user.isAdmin){
      try {
        for (let [key, value] of data.entries()) {
          console.log(key, value);
        }
      } catch (error) {
        console.log(error)
      }
      
    }
  }

  UacanadaMap.form.convertToMonth = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short" };
    const month = date.toLocaleString("en-US", options);
    return month;
  };

  UacanadaMap.form.convertToWeekday = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: "long" };
    const weekday = date.toLocaleString(undefined, options);
    return weekday;
  };

  UacanadaMap.form.convertToDay = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    return day;
  };
});

/*
        
        document.getElementById('placeForm').addEventListener('submit', async (event) => {
          event.preventDefault();
          const form = event.target;
        
          if (UacanadaMap.currentmarker) {
            UacanadaMap.map.removeLayer(UacanadaMap.currentmarker);
          }
        
          if (!canSendForm) {
            UacanadaMap.console.log("Already Sent!!!");
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
            UacanadaMap.currentmarker = UacanadaMap.L.marker([lat, lng], { icon: UacanadaMap.icon }).addTo(UacanadaMap.map).bindPopup(`<p>⏳ Creating new place...</p><code>${lat},${lng}</code>`).openPopup();
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
        
       */
