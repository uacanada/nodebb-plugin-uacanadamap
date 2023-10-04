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
        const eventName = m.eventName ? `<strong>${m.eventName}</strong>` : "";

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
          ? `<div id="topicEvent">
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


        const contactsList = [
         // m.mainUsername && createListElement(`fa-${m.socialtype}`, m.mainUsername),
          m.placeExternalUrl && createListElement('fa-brands fa-chrome', m.placeExternalUrl),
          m.linkedin && createListElement('fa-brands fa-linkedin', m.linkedin, '#0077b5'),
          m.telegram && createListElement('fa fa-telegram', m.telegram, '#4faaca'),
          m.facebook && createListElement('fa fa-facebook', m.facebook, '#0065ff'),
          m.instagram && createListElement('fa fa-instagram', m.instagram, '#f5996e'),
          m.youtube && createListElement('fa fa-youtube-play', m.youtube, 'red'),
          m.placeEmail && createListElement('fa fa-envelope', m.placeEmail, 'green'),
          m.phone && createListElement('fa fa-phone', m.phone, 'green')
        ].filter(Boolean).join("");
        

        const btnClasses = 'nav-link badge rounded-pill text-bg-primary me-1'
        const btnAttrs = 'type="button" role="tab" data-bs-toggle="pill"'
        const liAttrs = 'class="nav-item me-2" role="presentation"'
  


      const eventHtml = {
        button:topicEventDiv?`<li ${liAttrs}><button class="active ${btnClasses}" title="Show event details" id="navEvent-tab" data-bs-target="#navEvent" ${btnAttrs} aria-controls="navEvent" aria-selected="true"><i class="fa fa-solid fa-calendar-day"></i></button></li>`:'',
        tab:topicEventDiv?`<div class="tab-pane fade show active mb-3" id="navEvent" role="tabpanel" aria-labelledby="navEvent-tab" tabindex="0">${topicEventDiv}</div>`:'',
        contactsClass:topicEventDiv ? '' :'active',
        contactsAriaSelected:topicEventDiv ? 'false' :'true',
      }  

     
      const author = topic.posts[0].user
      const authorLetter = author["icon:text"]
      const authorColor = author["icon:bgColor"]
      const authorAvatar = author.picture ? `<img alt="${author.username}" title="${author.username}" data-uid="${author.uid}" class="p-0 m-0 avatar avatar-rounded" component="user/picture" src="${author.picture}" style="--avatar-size: 24px;" onerror="this.remove();" itemprop="image">`: 
      `<div class="float-start rounded-circle me-1" style="width:1rem;height: 1rem;line-height: 0.7rem;padding: 0.25rem;font-size: 0.75rem;color:white;background-color:${authorColor}">${authorLetter}</div>`;
      
     
     
      const modifiedContent = `<div class="placeTopicMetaWrapper mb-5">
      
      <nav id="placeTopicNav" class="pb-2 m-0">
          <ul class="p-0 list-unstyled nav nav-pills" id="top-pills-tab" role="tablist">
             ${eventHtml.button} 
              <li ${liAttrs}>
                  <button class="nav-link ${eventHtml.contactsClass} ${btnClasses}" title="Show social networks" id="navProfile-tab" data-bs-target="#navProfile" aria-controls="navProfile" aria-selected="${eventHtml.contactsAriaSelected}" ${btnAttrs}><i class="fa fa-solid fa-address-card"></i></button>
              </li>
              <li ${liAttrs}>
                  <button class="${btnClasses}" title="Show full address" id="navAddress-tab" data-bs-target="#navAddress" ${btnAttrs} aria-controls="navAddress" aria-selected="false"><i class="fa fa-solid fa-map-location-dot"></i> Address</button>
              </li>
          </ul>
          
      </nav>

      
        
        <div id="metaTab" class="tab-content">
           ${eventHtml.tab}
            <div class="tab-pane fade mb-3${eventHtml.contactsClass?' active show':''}" id="navProfile" role="tabpanel" aria-labelledby="navProfile-tab" tabindex="0">
              <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
                ${contactsList}
              </ul>
            </div>
            <div class="tab-pane fade mb-3" id="navAddress" role="tabpanel" aria-labelledby="navAddress-tab" tabindex="0">
                <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
                ${ m.city ? `<li class="list-group-item">${m.city}, ${m.province}</li>` : "" }
                ${ m.streetAddress ? `<li class="list-group-item">${m.streetAddress}</li>`  : "" }
                ${ m.latlng && m.latlng.length === 2
                    ? `<li class="list-group-item"> <a title="google map" href="https://maps.google.com/?q=${latlngString}"><i class="fa-brands fa-google"></i> ${latlngString}</a></li>`
                    : ""
                }
              </ul>
            </div>
        </div>

        <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
       
          <li class="list-group-item">
              <div role="tablist">
                      
                    <a href="#" class="active me-3" title="Show article" id="navDescription-tab" data-bs-target="#navDescription" ${btnAttrs} aria-controls="navDescription" aria-selected="true"><i class="fa fa-solid fa-circle-info"></i></a>
                    <a href="#" title="Show alternative lang" id="navAltDescription-tab" data-bs-target="#navAltDescription" ${btnAttrs} aria-controls="navAltDescription" aria-selected="false"><i class="fa-solid fa-language me-1"></i> ${settings.altContentTitle}</a>
            
            </div>
          </li>

          
        </ul>

       

        </div>
       
        <div id="descTab" class="tab-content">
          <div class="tab-pane fade mb-3 active show" id="navDescription" role="tabpanel" aria-labelledby="navDescription-tab" tabindex="0">
           <div class="white-space-pre-line">${data.topic.posts[0].content}</div>
          </div>
          <div class="tab-pane fade mb-3" id="navAltDescription" role="tabpanel" aria-labelledby="navAltDescription-tab" tabindex="0">
            ${m.placeDescriptionAlt}
          </div>
        </div>
        
        <script>$("#modal-place-title").html("<span style="color:${authorColor}">${authorAvatar} ${author.displayname || author.username}</span>")</script>`;

      data.topic.posts[0].content = `${topicMapDiv}${modifiedContent}${adminDebugConsole}`;
    }

  } catch (error) {
    // TODO error logging
  }

  return data;
};