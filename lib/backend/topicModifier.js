"use strict";
module.exports = (data, settings) => {
  try {
    if (data.topic?.mapFields?.placeTitle) {
      const adminDebugConsole =
        data.caller.uid === 1
          ? `<script>console.log(${JSON.stringify(data)})</script>`
          : "";
      const m = data.topic.mapFields;
      const latlngSrting = m.latlng.join(",");
      const topicMapDiv = `<div id="topicMap" class="text-nowrap w-100 mb-3 rounded" style="height:12rem" data-ua-latlng="${m.latlng}"></div>`;
      const topicEventDiv = m.eventStartDate
        ? `<div id="topicEvent" class="text-nowrap">
                              ${m.eventName ? `<h3>${m.eventName}</h3>` : ""}
                              <div class="calendar-item">
                                  <div class="calendar-date p-3">
                                      <span class="calendar-day">${
                                        m.startDayDigit
                                      }</span>
                                      <span class="calendar-month">${
                                        m.startMonth
                                      }</span>
                                  </div>
                                  <div class="calendar-details p-3">
                                      <h3 class="calendar-title"><i class="fa-regular fa-calendar-check"></i> ${
                                        m.eventName ||
                                        m.eventTitle ||
                                        m.fullname ||
                                        m.placeTitle ||
                                        ""
                                      }</h3>
                                      <p class="calendar-time m-0">
                                          <i class="fa fa-clock"></i> ${
                                            m.eventStartDate
                                          } at ${m.eventStartTime} - 
                                          ${
                                            m.eventEndDate
                                              ? `${m.eventEndDate}${
                                                  m.eventEndTime
                                                    ? ` at ${m.eventEndDate} ${m.eventEndTime} ${m.endDayName}`
                                                    : `${m.endDayName}`
                                                }`
                                              : ""
                                          }
                                      </p>
                                      
                                      ${
                                        m.eventWeekDay
                                          ? `<p class="calendar-recurrence m-0"><i class="fa-solid fa-rotate-right"></i> Every ${m.eventWeekDay} at ${m.eventStartTime}</p> `
                                          : ""
                                      }
                                      ${m.categoryName} ${
            m.eventCategoryName || ""
          }
                                      <p class="calendar-location"><i class="fa-solid fa-location-pin"></i> ${
                                        m.city
                                      }, ${m.province}</p>
                              
                                  </div>
                              </div>
                      
                  </div>`
        : "";

      const altDescription = m.placeDescriptionAlt? `<p><i class="fa-solid fa-language me-3"></i> ${settings.altContentTitle}</p>${m.placeDescriptionAlt}`:'';

      const postAddon = `<nav class="p-0 m-0" style="white-space: normal;">
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" id="nav-home-tab" data-bs-toggle="tab" data-bs-target="#nav-home" type="button" role="tab" aria-controls="nav-home" aria-selected="true">About</button>
            <button class="nav-link" id="nav-profile-tab" data-bs-toggle="tab" data-bs-target="#nav-profile" type="button" role="tab" aria-controls="nav-profile" aria-selected="false">Contacts</button>
            <button class="nav-link" id="nav-contact-tab" data-bs-toggle="tab" data-bs-target="#nav-contact" type="button" role="tab" aria-controls="nav-contact" aria-selected="false">Address</button>
          </div>
        </nav>
        <div class="tab-content" id="nav-tabContent" style="white-space: normal;">
          <div class="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab" tabindex="0">${topicEventDiv}</div>
          <div class="tab-pane fade" id="nav-profile" role="tabpanel" aria-labelledby="nav-profile-tab" tabindex="0">
                        <ul class="list-group list-group-flush m-0 p-0">
                        ${
                          m.mainUsername
                            ? `<li class="list-group-item">
                                 <i class="fa fa-${m.socialtype} pe-1"></i> ${m.mainUsername}
                               </li>`
                            : ""
                        }
                        ${
                          m.placeExternalUrl
                            ? `<li class="list-group-item">
                                 <i class="fa-brands fa-chrome"></i> ${m.placeExternalUrl}
                               </li>`
                            : ""
                        }
                        ${
                          m.linkedin
                            ? `<li class="list-group-item">
                                 <i class="fa-brands fa-linkedin pe-1"></i> ${m.linkedin}
                               </li>`
                            : ""
                        }
                        ${
                          m.telegram
                            ? `<li class="list-group-item">
                                 <i class="fa fa-telegram pe-1" style="color:#4faaca"></i> ${m.telegram}
                               </li>`
                            : ""
                        }
                        ${
                          m.facebook
                            ? `<li class="list-group-item">
                                 <i class="fa fa-facebook pe-1" style="color:#0065ff"></i> ${m.facebook}
                               </li>`
                            : ""
                        }
                        ${
                          m.instagram
                            ? `<li class="list-group-item">
                                 <i class="fa fa-instagram pe-1" style="color:#f5996e"></i> ${m.instagram}
                               </li>`
                            : ""
                        }
                        ${
                          m.youtube
                            ? `<li class="list-group-item">
                                 <i class="fa fa-youtube-play pe-1" style="color:red"></i> ${m.youtube}
                               </li>`
                            : ""
                        }
                        ${
                          m.placeEmail
                            ? `<li class="list-group-item">
                                 <i class="fa fa-mail pe-1" style="color:green"></i> ${m.placeEmail}
                               </li>`
                            : ""
                        }
                        ${
                          m.phone
                            ? `<li class="list-group-item">
                                 <i class="fa fa-phone pe-1" style="color:green"></i> ${m.phone}
                               </li>`
                            : ""
                        }
                        
                      </ul>
          </div>
          <div class="tab-pane fade" id="nav-contact" role="tabpanel" aria-labelledby="nav-contact-tab" tabindex="0">
              <ul class="list-group list-group-flush m-0 p-0">
              ${
                m.city
                  ? `<li class="list-group-item">${m.city}, ${m.province}</li>`
                  : ""
              }
              ${
                m.streetAddress
                  ? `<li class="list-group-item">${m.streetAddress}</li>`
                  : ""
              }
              ${
                m.latlng && m.latlng.length === 2
                  ? `<li class="list-group-item"> <a title="google map" href="https://maps.google.com/?q=${latlngSrting}"><i class="fa-brands fa-google"></i> ${latlngSrting}</a></li>`
                  : ""
              }
          </ul>
      </div>
          
        </div>`;
      data.topic.posts[0].content = topicMapDiv + postAddon + data.topic.posts[0].content + altDescription + adminDebugConsole;
    }
  } catch (error) {
    // TODO error logging
  }

  return data;
};
