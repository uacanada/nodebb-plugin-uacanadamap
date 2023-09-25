"use strict";
module.exports = (data, settings) => {
  try {
    if (data.topic?.mapFields?.placeTitle) {
      const logDiv =
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

      const altDescription = `<div class="accordion-item">
                                  <div class="accordion-header" id="placeAltDescAccordion">
                                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#placeAltDescAccordionCollapse" aria-expanded="false" aria-controls="placeAltDescAccordionCollapse">
                                      <i class="fa-solid fa-language me-3"></i> ${settings.altContentTitle}
                                      </button>
                                  </div>
                                  <div id="placeAltDescAccordionCollapse" class="accordion-collapse collapse" aria-labelledby="placeAltDescAccordion">
                                      <div class="accordion-body p-0" style="white-space: pre-line;">
                                          ${m.placeDescriptionAlt}
                                      </div>
                                  </div>
                              </div>`;

      const accordionPlace = `<div class="accordion text-nowrap m-0 p-0 my-3" id="placeFields">
              ${m.placeDescriptionAlt ? altDescription : ""}
              <div class="accordion-item">
                  <div class="accordion-header" id="placeFirstFieldSetItem">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#placeFirstFieldSetItemCollapse" aria-expanded="true" aria-controls="placeFirstFieldSetItemCollapse">
                          <i class="fa fa-${m.socialtype} pe-1"></i> ${
        m.mainUsername
      }
                  </button>
                  </div>
                  <div id="placeFirstFieldSetItemCollapse" class="accordion-collapse collapse show" aria-labelledby="placeFirstFieldSetItem">
                  <div class="accordion-body p-0">
                      <ul class="list-group list-group-flush m-0 p-0">
                          ${
                            m.mainUsername
                              ? `<li class="list-group-item"><i class="fa fa-${m.socialtype} pe-1"></i> ${m.mainUsername}</li>`
                              : ""
                          }
                          ${
                            m.placeExternalUrl
                              ? `<li class="list-group-item"><i class="fa-brands fa-chrome"></i> ${m.placeExternalUrl}</li>`
                              : ""
                          }
                          ${
                            m.linkedin
                              ? `<li class="list-group-item"><i class="fa-brands fa-linkedin pe-1"></i> ${m.linkedin}</li>`
                              : ""
                          }
                          ${
                            m.telegram
                              ? `<li class="list-group-item"><i class="fa fa-telegram pe-1" style="color:#4faaca"></i> ${m.telegram}</li>`
                              : ""
                          }
                          ${
                            m.facebook
                              ? `<li class="list-group-item"><i class="fa fa-facebook pe-1" style="color:#0065ff"></i> ${m.facebook}</li>`
                              : ""
                          }
                          ${
                            m.instagram
                              ? `<li class="list-group-item"><i class="fa fa-instagram pe-1" style="color:#f5996e"></i> ${m.instagram}</li>`
                              : ""
                          }
                          ${
                            m.youtube
                              ? `<li class="list-group-item"><i class="fa fa-youtube-play pe-1" style="color:red"></i> ${m.youtube}</li>`
                              : ""
                          }
                          ${
                            m.placeEmail
                              ? `<li class="list-group-item"><i class="fa fa-mail pe-1" style="color:green"></i> ${m.placeEmail}</li>`
                              : ""
                          }
                          ${
                            m.phone
                              ? `<li class="list-group-item"><i class="fa fa-phone pe-1" style="color:green"></i> ${m.phone}</li>`
                              : ""
                          }
                      </ul>
                      </div>
                  </div>
              </div>
              <div class="accordion-item">
                  <div class="accordion-header" id="placeSecondFieldSetItem">
                  <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#placeSecondFieldSetItemCollapse" aria-expanded="true" aria-controls="placeSecondFieldSetItemCollapse">
                  ${m.streetAddress || m.city + ", " + m.province}
                  </button>
                  </div>
                  <div id="placeSecondFieldSetItemCollapse" class="accordion-collapse collapse show" aria-labelledby="placeSecondFieldSetItem">
                  <div class="accordion-body p-0">
                  
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
                  </div>
              </div>
          </div>
          
          
          
          
          
          
        <ul class="nav nav-tabs" id="myTab" role="tablist">
        <li class="nav-item" role="presentation">
          <button class="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Home</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Profile</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="contact-tab" data-bs-toggle="tab" data-bs-target="#contact-tab-pane" type="button" role="tab" aria-controls="contact-tab-pane" aria-selected="false">Contact</button>
        </li>
        <li class="nav-item" role="presentation">
          <button class="nav-link" id="disabled-tab" data-bs-toggle="tab" data-bs-target="#disabled-tab-pane" type="button" role="tab" aria-controls="disabled-tab-pane" aria-selected="false" disabled>Disabled</button>
        </li>
      </ul>
      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabindex="0">...</div>
        <div class="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabindex="0">...</div>
        <div class="tab-pane fade" id="contact-tab-pane" role="tabpanel" aria-labelledby="contact-tab" tabindex="0">...</div>
        <div class="tab-pane fade" id="disabled-tab-pane" role="tabpanel" aria-labelledby="disabled-tab" tabindex="0">...</div>
      </div>
          
          
          
          
          
          `;

      const placeDiv = accordionPlace;
      data.topic.content =
        topicMapDiv + logDiv + topicEventDiv + placeDiv + data.topic.content;
      data.topic.posts[0].content =
        topicMapDiv +
        logDiv +
        topicEventDiv +
        data.topic.posts[0].content +
        placeDiv;
    }
  } catch (error) {
    // TODO error logging
  }

  return data;
};
