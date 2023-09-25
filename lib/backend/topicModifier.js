"use strict";

module.exports = (data, settings) => {
  try {
    const { topic } = data;
    const { mapFields } = topic || {};
    
    if (mapFields?.placeTitle) {
      const isAdmin = data.caller.uid === 1;
      const adminDebugConsole = isAdmin
        ? `<script>console.log(${JSON.stringify(data)})</script>`
        : "";

      const m = mapFields;
      const latlngString = m.latlng.join(",");
      
      const createListElement = (icon, text, color = "") => {
        return `<li class="list-group-item">
                  <i class="fa ${icon} pe-1" style="color:${color}"></i> ${text}
                </li>`;
      };

      const topicMapDiv = `<div id="topicMap" class="text-nowrap w-100 mb-3 rounded" style="height:12rem" data-ua-latlng="${m.latlng}"></div>`;
      
      // Define conditional sections first to make the main template more readable.
        const eventName = m.eventName ? `<h3>${m.eventName}</h3>` : "";

        const eventTime = `
          <p class="calendar-time m-0">
            <i class="fa fa-clock"></i> ${m.eventStartDate} at ${m.eventStartTime} - ${
          m.eventEndDate
            ? `${m.eventEndDate}${
                m.eventEndTime
                  ? ` at ${m.eventEndDate} ${m.eventEndTime} ${m.endDayName}`
                  : `${m.endDayName}`
              }`
            : ""
        }`;

        const eventWeekDay = m.eventWeekDay
          ? `<p class="calendar-recurrence m-0"><i class="fa-solid fa-rotate-right"></i> Every ${m.eventWeekDay} at ${m.eventStartTime}</p>`
          : "";

        const eventCategory = m.categoryName
          ? `<p>${m.categoryName} ${m.eventCategoryName || ""}</p>`
          : "";

        const eventLocation = `
          <p class="calendar-location"><i class="fa-solid fa-location-pin"></i> ${m.city}, ${m.province}</p>`;

        // Use the variables in the main template.
        const topicEventDiv = m.eventStartDate
          ? `<div id="topicEvent" class="text-nowrap">
              ${eventName}
              <div class="calendar-item">
                <div class="calendar-date p-3">
                  <span class="calendar-day">${m.startDayDigit}</span>
                  <span class="calendar-month">${m.startMonth}</span>
                </div>
                <div class="calendar-details p-3">
                  <h3 class="calendar-title"><i class="fa-regular fa-calendar-check"></i> ${
                    m.eventName ||
                    m.eventTitle ||
                    m.fullname ||
                    m.placeTitle ||
                    ""
                  }</h3>
                  ${eventTime}
                  ${eventWeekDay}
                  ${eventCategory}
                  ${eventLocation}
                </div>
              </div>
            </div>`
          : "";



      const altDescription = m.placeDescriptionAlt
        ? `<p class="mt-3"><i class="fa-solid fa-language me-3"></i> ${settings.altContentTitle}</p>${m.placeDescriptionAlt}`
        : "";

        const contactsList = [
          m.mainUsername && createListElement(`fa-${m.socialtype}`, m.mainUsername),
          m.placeExternalUrl && createListElement('fa-brands fa-chrome', m.placeExternalUrl),
          m.linkedin && createListElement('fa-brands fa-linkedin', m.linkedin, '#0077b5'),
          m.telegram && createListElement('fa fa-telegram', m.telegram, '#4faaca'),
          m.facebook && createListElement('fa fa-facebook', m.facebook, '#0065ff'),
          m.instagram && createListElement('fa fa-instagram', m.instagram, '#f5996e'),
          m.youtube && createListElement('fa fa-youtube-play', m.youtube, 'red'),
          m.placeEmail && createListElement('fa fa-envelope', m.placeEmail, 'green'),
          m.phone && createListElement('fa fa-phone', m.phone, 'green')
        ].filter(Boolean).join("");
        

      const eventHtml = {
        button:topicEventDiv?`<button class="nav-link active" id="navEvent-tab" data-bs-toggle="tab" data-bs-target="#navEvent" type="button" role="tab" aria-controls="navEvent" aria-selected="true">Event</button>`:'',
        tab:topicEventDiv?`<div class="tab-pane fade show active mb-3" id="navEvent" role="tabpanel" aria-labelledby="navEvent-tab" tabindex="0">${topicEventDiv}</div>`:''
      }  

      const postAddon = `
        <nav class="p-0 m-0" style="white-space: normal;">
          <div class="nav nav-tabs" id="placeTopicTabs" role="tablist">
            ${eventHtml.button}
            <button class="nav-link" id="navProfile-tab" data-bs-toggle="tab" data-bs-target="#navProfile" type="button" role="tab" aria-controls="navProfile" aria-selected="false">Contacts</button>
            <button class="nav-link" id="navAddress-tab" data-bs-toggle="tab" data-bs-target="#navAddress" type="button" role="tab" aria-controls="navAddress" aria-selected="false">Address</button>
          </div>
        </nav>
        <div class="tab-content" id="placeTopicTabst" style="white-space: normal;">
         
        ${eventHtml.tab}
         <div class="tab-pane fade mb-3" id="navProfile" role="tabpanel" aria-labelledby="navProfile-tab" tabindex="0">
            <ul class="list-group list-group-flush m-0 p-0">
              ${contactsList}
            </ul>
          </div>
          <div class="tab-pane fade mb-3" id="navAddress" role="tabpanel" aria-labelledby="navAddress-tab" tabindex="0">
              <ul class="list-group list-group-flush m-0 p-0">
              ${ m.city ? `<li class="list-group-item">${m.city}, ${m.province}</li>` : "" }
              ${  m.streetAddress ? `<li class="list-group-item">${m.streetAddress}</li>`  : "" }
              ${ m.latlng && m.latlng.length === 2
                  ? `<li class="list-group-item"> <a title="google map" href="https://maps.google.com/?q=${latlngString}"><i class="fa-brands fa-google"></i> ${latlngString}</a></li>`
                  : ""
              }
          </ul>
        </div>
        </div>`;

      data.topic.posts[0].content = `${topicMapDiv}${postAddon}${data.topic.posts[0].content}${altDescription}${adminDebugConsole}`;
    }

  } catch (error) {
    // TODO error logging
  }

  return data;
};