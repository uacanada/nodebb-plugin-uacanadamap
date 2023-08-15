'use strict';
define('uacanadamap/tabsPopulator', [ 'uacanadamap'], function(UacanadaMap) { 

    UacanadaMap.TEMP.tabPopulatorHtmlObj = {}

    const itemClass = "swiper-slide p-3 list-group-item";
    const getBySlug = (arr, slug) => arr.find(item => item.slug === slug);
    
    function getMatchedSlugs(placetags) {
        if(!placetags) return []
        return ajaxify.data.uacmp.tabCategories.filter(t => {
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
        gps,
        pic,
    }) {
        return `<li class="${itemClass}">
            <div class="location-item blogger-loc" data-marker-id="${tid}" data-blogger-loc="${gps}">
                ${
                    pic
                    ? `<img src="${pic}" alt="${mainUsername} profile image" class="profile-image">`
                    : ""
                }
                <div>
                    <div class="location-title">${placeTitle ?? mainUsername}</div>
                    <div class="location-geo">${city ?? ""}, ${province ?? ""}</div>
                    <div class="location-category">Category: ${categoryName ?? "main"}</div>
                    <div class="location-hashtag">Hashtag: #${placeCategory}</div>
                    <div class="location-username">Username: @${mainUsername}</div>
                </div>
            </div>
        </li>`;
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
          <div class="calendar-item blogger-loc" data-ua-event-ts=${eventTimestamp} data-marker-id=${tid} data-blogger-loc="${gps}">
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
        
            const li = createLiElement({
              city,
              province,
              mainUsername,
              placeCategory,
              placeTitle,
              categoryName,
              tid,
              gps,
              pic,
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
 
            console.log(tabsForPlace)
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
            const el = document.querySelector(`ul[data-ua-tab-cat="${slug}"]`);
      
            if (!el) continue; 

           const tabInfo = getBySlug(ajaxify.data.uacmp.tabCategories, slug);
      
            if (!tabInfo) continue; 
      
            const {color, title, description, footer} = tabInfo;
      
            const tabHtmlContent = `
                <li class="swiper-slide list-group-item slide-tab-header">
                    <div class="p-3">
                        <h2 style="color: ${color};">${title}</h2>
                        <p>${description}</p>
                    </div>
                </li>
                ${html}
                ${footer ? `<li class="swiper-slide list-group-item">
                                <div class="p-3 slide-tab-footer">${footer}</div>
                            </li>` : ""}
                <li class="swiper-slide list-group-item slide-tab-last-clearfix p-3 pb-5 pt-5 h-100">Add your own place!</li>
            `;
            el.innerHTML = tabHtmlContent;
          }
        }

        UacanadaMap.swipers.canActivateVertical = true;
      }
      


      
      UacanadaMap.api.populateTabs = () => {


        UacanadaMap.api.sortPlacesForTabs()

        processEvents();
        processPlaces();
        processTabs();
        
       
      };
      
})
