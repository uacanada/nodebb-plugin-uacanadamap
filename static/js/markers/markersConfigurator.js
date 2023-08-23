'use strict';
define('markers/markersConfigurator',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

    UacanadaMap.api.createMarker = (index,item) => {

        

        const {
            tid,
            placeCategory,
            placethumb = "",
            pic = "",
            placeTitle,
            categoryName,
            eventCategoryName,
            uid,
            classesFromAdmin,
            eventWeekDay = "",
            eventStartDate = "",
            eventStartTime = "",
            eventName = "",
            eventCategory = "",
            socialtype,
            placeDescriptionAlt,
            placeDescription,
            streetAddress,
            latlng,
            city,
            province,
            mainUsername,
            created,
            placetags,
          } = item;
    
    
          UacanadaMap.api.countFilledCategories(placeCategory);
         
          let eventHtml = "";
          
          const editLink =
            app.user?.uid &&
            (app.user.isAdmin ||
              app.user.isGlobalMod ||
              Number(uid) === Number(app.user.uid))
              ? `<div class="ua-edit-link"> <a href="#!" data-topic="${tid}" class="edit-place card-link"><i class="fa-regular fa-pen-to-square"></i> Edit</a></div>`
              : "";
              
          
          const profileIcon = UacanadaMap.api.getProfileImage(item);
          const markerTitle = placeTitle || categoryName;
          const cardTitle = eventName ? eventName : placeTitle || markerTitle;
          const eventNameHtml = eventName ? `<b>${eventName}</b><br>` : "";
          
          
          const subCategoryData = UacanadaMap.subCategoryRouterObject[placeCategory]
          const parentTabs = subCategoryData.tabs || []
          const faIconClass = subCategoryData.icon || 'fa-map'
          const parentTabColor = UacanadaMap.parentCategoriesObject[parentTabs[0]]?.color
    
          
          
          const faIcon = `<i class="'fa fa-fw fas fa-solid ${faIconClass}"></i>`; 
    
          let markerClassName = `ua-marker-d ua-social-${
            socialtype
          } ua-topic-${tid} cat-${placeCategory} marker-${
            UacanadaMap.markersClasses[1] // TODO
          }${classesFromAdmin ? ` ${classesFromAdmin}` : ""}`;
          if (eventCategory) {
            markerClassName += ` ua-marker-event ua-evnt-${eventCategory}`;
            eventHtml += eventStartDate
              ? `<span class="ua-event-popup">📅 ${eventStartDate} ⏰ ${eventStartTime} ${eventCategoryName}</span>`
              : `<span class="ua-event-popup">📅 Every ${eventWeekDay} ⏰ ${eventStartTime} ${eventCategoryName}</span>`;
          }
    
          const socialIcon =
            socialtype && socialtype !== "undefined"
              ? UacanadaMap.socialMediaIcons[socialtype]
              : '<i class="fa-brands fa-chrome"></i>';
          const cardTitleWithLinkAndIcon = `${faIcon} ${cardTitle}`;
    
          const language =
            window.navigator.userLanguage || window.navigator.language; // TODO improve
          const langRegex = new RegExp(ajaxify.data.UacanadaMapSettings.altContentTrigger, "mig");
          const bodyTextDetected =
            language.match(langRegex) && placeDescriptionAlt
              ? placeDescriptionAlt
              : placeDescription;
          const bodyText = UacanadaMap.api.harmonizeSnippet({
            text: bodyTextDetected,
            lineslimit: 5,
            maxchars: 300,
          });
         
    
          let words = markerTitle.split(/[\s]|[+-/&\\|]/); // Split into an array of words
    
          let markerTitleFormated = "";
          let lineLength = 0;
          let lineCount = 1;
          let markerHeightClass = "one-line-m";
    
          for (let i = 0; i < words.length; i++) {
            // If adding the next word exceeds the line length and we're already at two lines, truncate and break.
            if (lineLength + words[i].length > 14 && lineCount == 2) {
              markerTitleFormated += "...";
              break;
            }
            // If adding the next word exceeds the line length and we're still on the first line, move to the second line.
            else if (lineLength + words[i].length > 14 && lineCount == 1) {
              markerTitleFormated += "<br>";
              lineLength = 0;
              lineCount++;
              markerHeightClass = "two-line-m";
            }
    
            // Add the next word to the line.
            markerTitleFormated += words[i] + " ";
            lineLength += words[i].length + 1; // +1 for the space
          }
    
          markerTitleFormated = markerTitleFormated.trim(); // Remove leading and trailing spaces
    
          const markerLineIcon = UacanadaMap.L.divIcon({
            className: markerClassName,
            html: `<div class="ua-markers d-flex align-items-center ${markerHeightClass}">
                    <div class="circle-icon rounded-circle shadow d-flex align-items-center justify-content-center">
                    ${faIcon}
                    </div>
                    <span class="ms-1 badge-text">${markerTitleFormated}</span> 
                  </div>`,
            iconSize: [150, 24],
            iconAnchor: [11, 35],
            popupAnchor: [0, 0],
          });
    
          const marker = UacanadaMap.L.marker(latlng, { icon: markerLineIcon })
            .bindPopup(`<a class="ua-popup-link" href="/topic/${tid}/1">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">${faIcon} ${markerTitle}</li>
                  ${
                    streetAddress
                      ? ` <li class="list-group-item">📬 ${streetAddress}</li>`
                      : ""
                  } 
                  <li class="list-group-item"><i class="fa-solid fa-tree-city"></i> ${
                    city
                  }, ${province}</li>
                </ul>
                </a>`);
    
          const cardPlacePic = profileIcon
            ? `<div style="background:url(${profileIcon}) center center;background-size:cover;width:2rem" class="place-pic me-2 mb-1 ratio ratio-1x1 rounded-circle uac-inset-shadow"></div>`
            : "";
            
            var cardHtml = '<div class="ua-place-card-inner ms-0 me-0 p-3 position-relative" data-ua-tid=' + tid + '>' +
            '<div class="card-body">' +
              '<a title="topic/' + tid + '" class="float-end ua-topic-link" href="/topic/' + tid + '/1">' + cardPlacePic + '</a>' +
              '<div class="d-flex justify-content-between align-items-start text-truncate">' +
                '<a title="Topic link" class="ua-topic-link" href="/topic/' + tid + '/1">' +
                  '<h6 style="color: ' + parentTabColor + ';" title="Topic link" class="text-primary card-title mb-2">' + cardTitleWithLinkAndIcon + '</h6>' +
                '</a>' +
              '</div>' +
              '<div class="d-flex align-items-start justify-content-between">' +
                '<ul class="list-unstyled mb-1">' +
                  '<li class="mb-1">' +
                    '<span class="ua-mini-username text-primary username-' + socialtype + '">' +
                      socialIcon + ' ' + mainUsername +
                    '</span>' +
                  '</li>' +
                '</ul>' +
              '</div>' +
              '<p class="card-text mb-0"> <span class="badge rounded-pill text-bg-fancy">' + categoryName + '</span>  ' + eventNameHtml + eventHtml + bodyText + '</p>' +
              editLink +
           '</div>' +
         '</div>';
    
    
    
          const eventDate = eventStartDate ? new Date(`${eventStartDate} ${eventStartTime}`):0;
          const eventTimestamp = eventDate ? Math.floor(eventDate.getTime() / 1000) : 0;
    
          marker.uaMarkerCardHTML = cardHtml;
          marker.number = index;
          marker.tid = Number(tid);
          marker.eventTimestamp = eventTimestamp
          marker.icon = faIcon;
          marker.on("popupopen", (e) => {
            UacanadaMap.lastPlaceMarker = e.sourceTarget;
            UacanadaMap.api.fitElementsPosition();
          });
          marker.on("click", (e) => {
            e.sourceTarget.openPopup();
            UacanadaMap.api.openCards(e.sourceTarget.tid, "distance", false); // TODO: 'category' or 'distance'
          });
    
          UacanadaMap.allPlaces[tid] = {
            marker,
            gps: latlng,
            json: item,
            parentTabColor,
            faIconClass,
            parentTabs,
            index
          };
    
              UacanadaMap.currentSortedMarkers.push({ tid, lat: latlng[0],  lng: latlng[1], json: item, html: cardHtml});
           
          if (eventTimestamp > 0) {
              UacanadaMap.TEMP.eventsArray.push({tid, eventTimestamp, everyWeek: eventWeekDay, category: placeCategory, eventcategory:eventCategory, tags: placetags});
            }else{
              UacanadaMap.TEMP.placesArray.push({tid, createdTimestamp:created, category:placeCategory, tags: placetags});
          }



          return marker;
    
    }

   

})