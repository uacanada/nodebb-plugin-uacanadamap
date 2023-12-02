"use strict";
module.exports = (data, settings) => {
  try {
    const { topic } = data;
    const { mapFields } = topic || {};
    let gallerySwiper = null;
    
    if (mapFields?.placeTitle) {
      const isAdmin = data.caller.uid === 1; // TODO add edit button
      

      const m = mapFields;
      const latlngString = m.latlng.join(",");
      
      const createListElement = (icon, text, color = "") => {
        return `<li class="list-group-item text-truncate">
                  <i class="fa ${icon} pe-1" style="color:${color}"></i> ${text}
                </li>`;
      };

      const topicMapDiv = `<div id="topicMap" class="text-nowrap w-100 mb-3 rounded" style="height:12rem" data-ua-latlng="${m.latlng}"></div>`;
      const eventTime = `<p class="calendar-time m-0"><i class="fa fa-clock"></i> ${m.eventStartDate} at ${m.eventStartTime}</p> ${m.eventEndDate ? `<p class="calendar-time m-0"><i class="fa fa-regular fa-calendar-xmark"></i> ${m.eventEndDate}${m.eventEndTime ? ` at ${m.eventEndTime} ${m.endDayName}` : ` ${m.endDayName}`}</p>` : ""}`;
    const eventWeekDay = m.eventWeekDay ? `<p class="calendar-recurrence m-0"><i class="fa-solid fa-rotate-right"></i> Every ${m.eventWeekDay} at ${m.eventStartTime}</p>` : "";
        const eventCategory = m.eventCategory ? `<span class="badge text-bg-primary rounded-pill me-1">${(m.eventCategory) ? (m.eventCategoryName && m.eventCategoryName !== 'undefined') ? m.eventCategoryName : m.eventCategory : '' }</span>`:''
        const eventLocation = `<p class="calendar-location"><i class="fa-solid fa-location-pin"></i> ${m.city}, ${m.province}</p>`;
        const topicEventDiv = m.eventStartDate
          ? `<div id="topicEvent">
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
        

        const btnClasses = 'text-decoration-none me-2'
        const btnAttrs = 'type="button" role="tab" data-bs-toggle="tab"'
      const eventHtml = {
        button:topicEventDiv?`<a href="#" class="active ${btnClasses}" title="Show event details" id="navEvent-tab" data-bs-target="#navEvent" ${btnAttrs} aria-controls="navEvent" aria-selected="true"><i class="fa fa-solid fa-calendar-day"></i></a>`:'',
        tab:topicEventDiv?`<div class="tab-pane fade show active mb-3" id="navEvent" role="tabpanel" aria-labelledby="navEvent-tab" tabindex="0">${topicEventDiv}</div>`:'',
        contactsClass:topicEventDiv ? '' :'active',
        contactsAriaSelected:topicEventDiv ? 'false' :'true',
      }       
      const author = topic.posts[0].user
      const authorLetter = author["icon:text"] || ''
      const authorColor = author["icon:bgColor"] || ''
      const authorAvatar = author.picture || ''

      if(m.gallery && m.gallery[0]){
        try {
          let galleryitems = "";
          for(let imgsrc of m.gallery){ galleryitems += `<div class="swiper-slide"><img alt="Place Gallery Image" src="/assets/uploads/${imgsrc}"></div>` }
          gallerySwiper = `<div class="swiper topicPlaceGallery"><div class="swiper-wrapper">${galleryitems}</div></div>`
        } catch (error) {
          console.log(error,m.gallery)
        }
      }




      const modifiedContent = `<div class="placeTopicMetaWrapper">
      <nav id="placeTopicNav" class="pb-2 m-0">
        <div id="top-meta-tab" role="tablist">
            ${eventHtml.button}
            
            <a href="#" class="${eventHtml.contactsClass} ${btnClasses}" 
                    id="navProfile-tab" 
                    data-bs-target="#navProfile" 
                    title="Show social networks" 
                    aria-controls="navProfile" 
                    aria-selected="${eventHtml.contactsAriaSelected}" 
                    ${btnAttrs}>
                <i class="fa fa-solid fa-address-card"></i>
            </a>
    
            <a href="#" class="${btnClasses}" 
                    id="navAddress-tab" 
                    data-bs-target="#navAddress" 
                    title="Show full address" 
                    aria-controls="navAddress" 
                    aria-selected="false" 
                    ${btnAttrs}>
                <i class="fa fa-solid fa-map-location-dot"></i> Address
            </a>
        </div>
    </nav>
  
      <div id="metaTab" class="tab-content" data-authorcolor="${authorColor}" data-authoravatar="${authorAvatar}" data-authorname="${author.displayname || author.username}" data-authorletter="${authorLetter}">
           ${eventHtml.tab}
            <div class="tab-pane fade mb-3${eventHtml.contactsClass?' active show':''}" id="navProfile" role="tabpanel" aria-labelledby="navProfile-tab" tabindex="0">
              <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
                ${contactsList}
              </ul>
            </div>
            <div class="tab-pane fade mb-3" id="navAddress" role="tabpanel" aria-labelledby="navAddress-tab" tabindex="0">
                <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
                ${ m.city ? `<li class="list-group-item ">${m.city}, ${m.province}</li>` : "" }
                ${ m.streetAddress ? `<li class="list-group-item">${m.streetAddress}</li>`  : "" }
                ${ m.latlng && m.latlng.length === 2
                    ? `<li class="list-group-item"> <a title="google map" href="https://maps.google.com/?q=${latlngString}"><i class="fa-brands fa-google"></i> ${latlngString}</a></li>`
                    : ""
                }
              </ul>
            </div>
        </div>

        <ul class="list-unstyled fs-6 list-group list-group-flush mt-5 p-0">
       
          <li class="list-group-item">
              <div role="tablist">
                      
                    <a href="#" class="active me-3 text-decoration-none" title="Show article" id="navDescription-tab" data-bs-target="#navDescription" ${btnAttrs} aria-controls="navDescription" aria-selected="true"><i class="fa fa-solid fa-circle-info"></i></a>
                    <a href="#" class="text-decoration-none" title="Show alternative lang" id="navAltDescription-tab" data-bs-target="#navAltDescription" ${btnAttrs} aria-controls="navAltDescription" aria-selected="false"><i class="fa-solid fa-language me-1"></i> ${settings.altContentTitle}</a>
            
            </div>
          </li>

          
        </ul>

       

        </div>
       
        <div id="descTab" class="tab-content mb-5">
          <div class="tab-pane fade mb-3 active show" id="navDescription" role="tabpanel" aria-labelledby="navDescription-tab" tabindex="0">
           <div class="white-space-pre-line">${data.topic.posts[0].content}</div>
          </div>
          <div class="tab-pane fade mb-3" id="navAltDescription" role="tabpanel" aria-labelledby="navAltDescription-tab" tabindex="0">
          <div class="white-space-pre-line">${m.placeDescriptionAlt}</div>
          </div>
        </div>
        <div class="my-3"></div>
        
        
        <div class="place-ctx-buttons p-3">
          <div class="place-ctx-buttons-wrapper">
          
          <div class="btn-group dropup mb-2">
            <button type="button" title="Show contacts" class="btn circle-button dropdown-toggle text-bg-primary p-4" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa fa-solid fa-address-card"></i></buton> 
            <div class="dropdown-menu custom-ua-dropdown" data-popper-placement="top-end">
            
              <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
                ${contactsList}
              </ul>
                
            </div>
          </div>

          <div class="btn-group dropup mb-2">
          <button type="button" title="Show address" class="btn circle-button dropdown-toggle text-bg-primary p-4" data-bs-toggle="dropdown" aria-expanded="false"><i class="fa-solid fa-route"></i></buton> 
          <div class="dropdown-menu custom-ua-dropdown" data-popper-placement="top-end">
          
              <ul class="list-unstyled fs-6 list-group list-group-flush m-0 p-0">
                ${ m.city ? `<li class="list-group-item text-truncate">${m.city}, ${m.province}</li>` : "" }
                ${ m.streetAddress ? `<li class="list-group-item text-truncate">${m.streetAddress}</li>`  : "" }
                ${ m.latlng && m.latlng.length === 2
                    ? `<li class="list-group-item text-truncate"> <a title="google map" href="https://maps.google.com/?q=${latlngString}"><i class="fa-brands fa-google"></i> ${latlngString}</a></li>`
                    : ""
                }
              </ul>
          
          </div>
        </div>

       

          <a href="/topic/${m.tid}"  title="Comment this" type="button" class="btn circle-button go-to-comment mt-2 p-4 text-bg-primary"><i class="fa-regular fa-comment-dots"></i></a>
          </div>
        </div>
        `;

      data.topic.posts[0].content = ` ${gallerySwiper}${topicMapDiv}${modifiedContent}`;
    }

  } catch (error) {
    // TODO error logging
  }

  return data;
};