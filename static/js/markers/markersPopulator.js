'use strict';
define('markers/markerPopulator',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    const { L } = UacanadaMap;
  
    function calculateDegreesFromPixels(pixelX, pixelY, zoom) {
      const vancouverLatLng = L.latLng(49.2827, -123.1207);
      const startPoint = UacanadaMap.map.project(vancouverLatLng, zoom);
      const endPoint = startPoint.add(L.point(pixelX, pixelY));
      const endPointLatLng = UacanadaMap.map.unproject(endPoint, zoom);
      const lng = Math.abs(endPointLatLng.lng - vancouverLatLng.lng);
      const lat = Math.abs(endPointLatLng.lat - vancouverLatLng.lat);
      return { lng, lat, endPointLatLng };
    }
  
    function getRandomNumber() {
      return (Math.random() * (0.6 - 0.1) + 0.1).toFixed(2);
    }
  
    function findGroup(groups, marker) {
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].includes(marker)) {
          return i;
        }
      }
      return -1;
    }
  
    function mergeGroups(groups, group1, group2) {
      if (group1 === group2) {
        return;
      }
  
      for (const marker of groups[group2]) {
        groups[group1].push(marker);
      }
  
      groups[group2] = [];
    }
  
    function shiftMarkersWithCloseNeighbors(markers, forceShift) {
      const {
        virtZoom,
        shiftX,
        shiftY,
        latDistanceTtrigger,
        lngDistanceTtrigger,
      } = UacanadaMap.markerSettings;
      const shift = calculateDegreesFromPixels(shiftX, shiftY, virtZoom);
      const treshold = calculateDegreesFromPixels(
        lngDistanceTtrigger,
        latDistanceTtrigger,
        virtZoom
      );
      let groups = [];
  
      for (let i = 0; i < markers.length; i++) {
        groups[i] = [markers[i]];
      }
      for (let i = 0; i < markers.length; i++) {
        const currentMarker = markers[i];
  
        let hasNeighbors = false;
  
        for (let j = i + 1; j < markers.length; j++) {
          const otherMarker = markers[j];
          if (
            Math.abs(
              currentMarker.getLatLng().lat - otherMarker.getLatLng().lat
            ) < treshold.lat &&
            Math.abs(
              currentMarker.getLatLng().lng - otherMarker.getLatLng().lng
            ) < treshold.lng
          ) {
            hasNeighbors = true;
  
            const currentGroup = findGroup(groups, currentMarker);
            const otherGroup = findGroup(groups, otherMarker);
            if (currentGroup !== otherGroup) {
              mergeGroups(groups, currentGroup, otherGroup);
            }
          }
        }
      }
  
      const markerGroups = groups.filter((group) => group.length > 1);
      if (forceShift) {
        markerGroups.forEach((group) => {
          const groupSize = group.length;
  
          group.forEach((marker, index) => {
            const m = UacanadaMap.allPlaces[marker.tid];
            const realGps = m.marker._latlng || [
              Number(m.gps[0]),
              Number(m.gps[1]),
            ];
            const idx = index + 1;
  
            m.neighborIndex = index;
            m.neighborsCount = groupSize;
            m.neighbors = group;
  
            const currentLatLng = marker.getLatLng();
            const randomMul = getRandomNumber();
            const shiftedLatLng = L.latLng(
              currentLatLng.lat - shift.lat * idx * 0.3,
              currentLatLng.lng + shift.lng * idx * randomMul
            );
  
            m.shifted = true;
            marker.setLatLng(shiftedLatLng);
            L.polyline([realGps, shiftedLatLng], {
              weight: 1,
              color: "#ff2424",
              opacity: 0.6,
              dashArray: "5, 5",
            }).addTo(UacanadaMap.map);
            const markerDot = L.divIcon({
              className: "ua-marker-dot",
              html: `📍`,
              iconSize: [15, 15],
              iconAnchor: [7, 7],
            });
            L.marker(realGps, { icon: markerDot }).addTo(UacanadaMap.map);
          });
        });
      }
  
      return markerGroups;
    }
  
    UacanadaMap.api.populatePlaces = async (array) => {
  
      
  
      UacanadaMap.api.cleanUp();
  
      for (const [index, item] of array.entries()) {
        if (!item.placeCategory || !item.latlng[0]) continue;
  
  
        const {
          tid,
          placeCategory,
          placethumb,
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
        const profileIcon = placethumb || "";
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
  
        const markerLineIcon = L.divIcon({
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
  
        const m = L.marker(latlng, { icon: markerLineIcon })
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
  
        m.uaMarkerCardHTML = cardHtml;
        m.number = index;
        m.tid = Number(tid);
        m.eventTimestamp = eventTimestamp
        m.icon = faIcon;
        m.on("popupopen", (e) => {
          UacanadaMap.lastPlaceMarker = e.sourceTarget;
          UacanadaMap.api.fitElementsPosition();
        });
        m.on("click", (e) => {
          e.sourceTarget.openPopup();
          UacanadaMap.api.openCards(e.sourceTarget.tid, "distance", false); // TODO: 'category' or 'distance'
        });
  
        UacanadaMap.allPlaces[tid] = {
          marker: m,
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
        
          
        UacanadaMap.mapLayers.markers.addLayer(m);
      }
  
      UacanadaMap.mapLayers.markers.addTo(UacanadaMap.map);
  
      try {
        shiftMarkersWithCloseNeighbors(
          UacanadaMap.mapLayers.markers.getLayers(),
          true
        );
      } catch (error) {
        console.log(error);
      }
  
     // UacanadaMap.api.mapReLoaded(UacanadaMap.initUaMapCount);
      return UacanadaMap.initUaMapCount;
    };
  });
  