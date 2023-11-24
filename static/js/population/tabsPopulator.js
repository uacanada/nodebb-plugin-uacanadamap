'use strict';
define('population/tabsPopulator', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

    const itemClass = "list-group-item";
    const getBySlug = (arr, slug) => arr.find(item => item.slug === slug);
    
    function getMatchedSlugs(placetags) {
        if(!placetags) return []
        return ajaxify.data.UacanadaMapSettings.tabCategories.filter(t => {
            let placeTags;
            if (t.placeByTagCollector && typeof t.placeByTagCollector === "string") {
                placeTags = t.placeByTagCollector.split(',');
                return placeTags.some(tag => placetags.includes(tag));
            }
            return false;
        }).map(t => t.slug);
    }
    
    function createLiElement({
        city,
        province,
        mainUsername,
        placeCategory,
        placeTitle,
        categoryName,
        tid,
        img
    }) {
        return `<li class="${itemClass}">
        <div class="location-item place-with-coordinates d-flex align-items-start" data-marker-id="${tid}">
            <div class="me-3">
                ${ img ? `<img src="${img}" alt="${mainUsername} profile image" class="rounded-circle" style="width: 50px; height: 50px;">`  : ""  }
            </div>
            <div>
                <div class="location-title fw-bold">${placeTitle ?? mainUsername}</div>
                <div>
                    <div class="location-username small">@${mainUsername} ${city ?? ""}, ${province ?? ""}</div>
                    <div class="location-category small">${categoryName ?? "main"} #${placeCategory}</div>
                </div>
            </div>
        </div>
    </li>
    `;
    }

    const eventCardHtml = ({ 
        dateDigit, 
        month, 
        eventName, 
        eventTitle, 
        everyWeek, 
        eventStartDate, 
        eventStartTime, 
        endTime, 
        eventCategory, 
        categoryName, 
        city, 
        province, 
        eventTimestamp, 
        tid, 
        gps, 
        notice
      }) => {
        return `<li class="${itemClass}">
          <div class="calendar-item place-with-coordinates" data-ua-event-ts="${eventTimestamp}" data-marker-id="${tid}">
            <div class="calendar-date p-3">
              <span class="calendar-day">${dateDigit}</span>
              <span class="calendar-month">${month}</span>
            </div>
            <div class="calendar-details p-3">
              <h3 class="calendar-title"><i class="fa-regular fa-calendar-check"></i> ${
                eventName || eventTitle || ""
              }</h3>
              <p class="calendar-time m-0"><i class="fa fa-clock"></i> <strong>${everyWeek}</strong> ${eventStartDate} at ${eventStartTime} - ${endTime}</p>
              ${eventCategory} ${categoryName} ${everyWeek}
              <p class="calendar-location"><i class="fa-solid fa-location-pin"></i> ${city}, ${province}</p>
              ${notice} 
            </div>
          </div>
        </li>`;
      };




    UacanadaMap.api.getExtendedPlace = (tid)=> {
            const place = UacanadaMap.allPlaces[Number(tid)].json
           const {
               eventStartDate,
               eventStartTime,
               eventWeekDay,
               eventEndDate,
               eventEndTime,
               placeCategory,
           } = place;
          
           let extendedPlace = {
               ...place,
               parentTabs: UacanadaMap.subCategoryRouterObject[placeCategory]?.tabs || []
           }
          try {
           if (eventStartDate) {
             const isToday = eventWeekDay === UacanadaMap.weekDay;
             const eventDate = new Date(`${eventStartDate} ${eventStartTime}`);
             const eventTimestamp = Math.floor(eventDate.getTime() / 1000);
             const month = UacanadaMap.months[eventDate.getMonth()];
             const eventDay = UacanadaMap.weekdays[eventDate.getDay()];
             const dateDigit = eventDate.getDate();
             const endTime = eventEndDate || eventEndTime  ? `${eventEndDate} ${eventEndTime ? ` at ${eventEndTime}` : ""}` : "";
             const everyWeek = eventWeekDay ? `<p class="calendar-recurrence m-0"><i class="fa-solid fa-rotate-right"></i> Every ${eventWeekDay} at ${eventStartTime}</p> ` : "";
   
             Object.assign(extendedPlace, {
               isToday,
               eventDate,
               eventTimestamp,
               month,
               eventDay,
               dateDigit,
               everyWeek,
               endTime,
               });
           }
         } catch (error) {
           console.log(error);
         }
   
         return extendedPlace;
    }



    UacanadaMap.api.sortPlacesForTabs = () => {


        UacanadaMap.TEMP.eventsArray.sort(
            (a, b) => a.eventTimestamp - b.eventTimestamp
        );
        
        UacanadaMap.TEMP.placesArray.sort(
            (a, b) => b.createdTimestamp - a.createdTimestamp
        );


    }
 

    function processFragments(tab,html){
      if(!tab || !html) return;
      UacanadaMap.fragment.createFragment(tab, html);
      UacanadaMap.fragment.manipulateFragment(tab, (fragment) => {
        const wrapper = document.createElement('ul');
        wrapper.classList.add('placesList','p-0', 'm-0');
        while (fragment.firstChild) {
          wrapper.appendChild(fragment.firstChild);
        }
        fragment.appendChild(wrapper);
      });
    }

  
    function processEvents() {
      const { timestampNow } = UacanadaMap;
  
      let nearestEventsCount = 0;
      let htmlUpcoming48h = "";
      let htmlUpcomingEvents = "";
      let htmlExpireEvents = "";
      let htmlRegularEvents = "";
  
      UacanadaMap.TEMP.eventsArray.forEach((x) => {
          const place = UacanadaMap.api.getExtendedPlace(Number(x.tid));
          if (!place) return;
  
          const {eventWeekDay, eventTimestamp, isToday } = place;
          const placeWithNotice = { ...place };
  
          if (timestampNow > eventTimestamp && !eventWeekDay) {
              placeWithNotice.notice = 'Outdated';
              htmlExpireEvents += eventCardHtml(placeWithNotice);
          }
  
          if (eventWeekDay) {
              placeWithNotice.notice = `Every ${eventWeekDay}`;
              htmlRegularEvents += eventCardHtml(placeWithNotice);
  
              if (isToday) {
                  placeWithNotice.notice = `Is Today! ${eventWeekDay}`;
                  htmlUpcoming48h += eventCardHtml(placeWithNotice);
              }
          }
  
          if (timestampNow < eventTimestamp) {
              if (eventTimestamp - timestampNow < 172800 && !isToday) {
                  placeWithNotice.notice = 'Next 48 hours!';
                  htmlUpcoming48h += eventCardHtml(placeWithNotice);
              } else {
                  placeWithNotice.notice = 'Soon';
                  htmlUpcomingEvents += eventCardHtml(placeWithNotice);
              }
          }
  
          nearestEventsCount++;
      });
  
      const liPrefix = `<li class="${itemClass}"><h6 class="mb-5">`
      const eventsHtml = [
          htmlUpcoming48h && `${liPrefix}Events In the Next 48 hours</h6></li>${htmlUpcoming48h}`,
          htmlRegularEvents && `${liPrefix}Weekly events</h6></li>${htmlRegularEvents}`,
          htmlUpcomingEvents && `${liPrefix}Upcoming events</h6></li>${htmlUpcomingEvents}`,
          htmlExpireEvents && `${liPrefix}Expired events:</h6></li>${htmlExpireEvents}`,
      ].filter(Boolean).join("");
  
      UacanadaMap.TEMP.tabPopulatorHtmlObj["events"] = eventsHtml;

      processFragments("tab-events",eventsHtml)

  }
  
      
      function processPlaces() {
        UacanadaMap.TEMP.placesArray.forEach((x) => {
          const extendedPlace = UacanadaMap.api.getExtendedPlace(Number(x.tid));
          if(extendedPlace){
            const {
              city,
              province,
              mainUsername,
              placeCategory,
              placeTitle,
              categoryName,
              tid,
              gps,
              pic,
              parentTabs,
              placetags,
            } = extendedPlace;

            const img = UacanadaMap.api.getProfileImage(extendedPlace)
        
            const li = createLiElement({
              city,
              province,
              mainUsername,
              placeCategory,
              placeTitle,
              categoryName,
              tid,
              gps,
              img
            });
        

            /**
           * Generate a unique array of tab slugs derived from two sources - parentTabs and placetags.
           * 'parentTabs' contains parent categories that can have associated locations.
           * 'placetags' holds tags that are associated with particular locations.
           * The function effectively avoids duplication of topics within categories.
           */

            const parentsTabsSlugs = Array.isArray(parentTabs) ? [...parentTabs] : [];
          //  const mathedSlugs =  [... new Set(getMatchedSlugs(placetags))]
            const tabsForPlace = [...new Set([...parentsTabsSlugs, ...getMatchedSlugs(placetags)])];
 
            tabsForPlace.forEach((tabSlug) => {
              if (UacanadaMap.TEMP.tabPopulatorHtmlObj[tabSlug]) {
                UacanadaMap.TEMP.tabPopulatorHtmlObj[tabSlug] += li;
              } else {
                UacanadaMap.TEMP.tabPopulatorHtmlObj[tabSlug] = li;
              }
            });
          }
      
         

          
        });
      }
      
      function processTabs() {
        for (const tabSlug in UacanadaMap.TEMP.tabPopulatorHtmlObj) {
          if (Object.hasOwnProperty.call(UacanadaMap.TEMP.tabPopulatorHtmlObj, tabSlug)) {
          const slug = tabSlug || 'all'
          const html = UacanadaMap.TEMP.tabPopulatorHtmlObj[slug];
          const tabInfo = getBySlug(ajaxify.data.UacanadaMapSettings.tabCategories, slug);
          if (!tabInfo) continue; 
          const {color, title, description, footer} = tabInfo;
          const tabHtmlContent = `
          <li class="list-group-item">
            <div class="p-3">
              <h2 class="title" style="color: ${color};">${title}</h2>
              <p>${description}</p>
            </div>
          </li>
          ${html}
          ${footer ? `
            <li class="list-group-item">
              <div class="p-3 tab-footer">${footer}</div>
            </li>` : ""}
          <li class="list-group-item tab-last-clearfix text-center mt-5 mb-3">
            <p class="newLocationOpenMarker btn btn-primary">
              Would you like to add your own location to the map?
            </p>
          </li>
        `;
        
       
        
          processFragments("tab-"+slug,tabHtmlContent)// TODO: WIP
          }
        }
      }
      

      UacanadaMap.api.populateTabs = () => {
        UacanadaMap.api.sortPlacesForTabs()
        
        $('#scrollableBottomPanel').css('display','none')

        processEvents();
        processPlaces();
        processTabs();

       // UacanadaMap.TEMP.tabPopulatorHtmlObj = null
      };
      
})
