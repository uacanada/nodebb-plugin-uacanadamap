'use strict';
define('topics/topicPost',["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    const { L } = UacanadaMap;
/* Create post header ONLY WHEN INSIDE TOPIC VIEW !*/
UacanadaMap.api.setLocationCardtoPost = () => {
    var inpostCardHolder;
    var isTopic = $("body").hasClass("page-topic");
    var classes = $("body").attr("class");
    if (isTopic) {
        var tidSearch = classes.match(/(page-topic-[0-9]{2,20})/);
        var tid = tidSearch[0]
            ? Number(tidSearch[0].replace("page-topic-", ""))
            : 0;
        var showClass = "show-pagination-block";
        var hideClass = "hide-pagination-block";
        var pagination = $(".pagination-block");
        pagination.removeClass(showClass).removeClass(hideClass);
        if (tid && !$("#ua-inpost-map-card").outerHeight()) {
            if (UacanadaMap.allPlaces[tid]) {
                inpostCardHolder = "inpostCardHolder";
                $(
                    '<div id="' +
                        inpostCardHolder +
                        '" style="min-height:10rem">  ... </div>'
                ).insertAfter("#content .topic-info");
            }
            UacanadaMap.scrolListenerExist = $(window).on(
                "optimizedScroll",
                function () {
                    if (!tid || !$("#ua-inpost-map-card").outerHeight()) return;
                    var scrollTop = $(window).scrollTop();
                    var scrollH =
                        $("#ua-inpost-map-card").outerHeight() +
                        $("#ua-inpost-map-card").offset().top;
                    if (scrollTop > scrollH) {
                        if (pagination.hasClass(hideClass))
                            pagination.addClass(showClass).removeClass(hideClass);
                    } else {
                        if (pagination.hasClass(showClass))
                            pagination.removeClass(showClass).addClass(hideClass);
                    }
                }
            );

            UacanadaMap.api.drawPostCard = () => {
                $(".page-topic").addClass("post-with-map");
                pagination.addClass(hideClass);

                if ($("#ua-inpost-map-card").outerHeight())
                    return console.log("Map exist");

                var { json, marker, gps } = UacanadaMap.allPlaces[tid];
                if (UacanadaMap.adminsUID) console.log("PLACE: ", json);

                var eventHtml = UacanadaMap.allPlaces[tid].json.eventStartDate
                    ? `<div class="mb-3 ticket-wrapper pe-md-3">
        <main class="ticket-system">
          <div class="top">
          
          <div class="printer" />    </div>
          <div class="receipts-wrapper">
              <div class="receipts">
                <div class="receipt"> 
                🇺🇦 UACANADA.ORG
                    <div class="route">
                      <h2>${json.eventName}</h2>
                    </div>
                    <div class="details">
                     
                      <div class="item">
                          <span>Start date</span>
                          <h3>${json.eventStartDate}</h3>
                      </div>
                      <div class="item">
                          <span>Start time</span>
                          <h3>${json.eventStartTime}</h3>
                      </div>
  
                      <div class="item">
                          <span>End date</span>
                          <h3>${json.eventEndDate || ""}</h3>
                      </div>
                      <div class="item">
                          <span>End time</span>
                          <h3>${json.eventEndTime || ""}</h3>
                      </div>
  
                      <div class="item">
                          <span>Day</span>
                          <h3>${json.eventWeekDay || ""}</h3>
                      </div>
  
                     
                      <div class="item">
                          <span>Location</span>
                          <h3>${json.placeTitle}</h3>
                          <small>${json.streetAddress} ${json.city} ${
                            json.province
                      }</small>
  
                        
                      </div>
                    </div>
                </div>
                <div class="receipt qr-code">
                    <svg class="qr" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29.938 29.938">
                      <path d="M7.129 15.683h1.427v1.427h1.426v1.426H2.853V17.11h1.426v-2.853h2.853v1.426h-.003zm18.535 12.83h1.424v-1.426h-1.424v1.426zM8.555 15.683h1.426v-1.426H8.555v1.426zm19.957 12.83h1.427v-1.426h-1.427v1.426zm-17.104 1.425h2.85v-1.426h-2.85v1.426zm12.829 0v-1.426H22.81v1.426h1.427zm-5.702 0h1.426v-2.852h-1.426v2.852zM7.129 11.406v1.426h4.277v-1.426H7.129zm-1.424 1.425v-1.426H2.852v2.852h1.426v-1.426h1.427zm4.276-2.852H.002V.001h9.979v9.978zM8.555 1.427H1.426v7.127h7.129V1.427zm-5.703 25.66h4.276V22.81H2.852v4.277zm14.256-1.427v1.427h1.428V25.66h-1.428zM7.129 2.853H2.853v4.275h4.276V2.853zM29.938.001V9.98h-9.979V.001h9.979zm-1.426 1.426h-7.127v7.127h7.127V1.427zM0 19.957h9.98v9.979H0v-9.979zm1.427 8.556h7.129v-7.129H1.427v7.129zm0-17.107H0v7.129h1.427v-7.129zm18.532 7.127v1.424h1.426v-1.424h-1.426zm-4.277 5.703V22.81h-1.425v1.427h-2.85v2.853h2.85v1.426h1.425v-2.853h1.427v-1.426h-1.427v-.001zM11.408 5.704h2.85V4.276h-2.85v1.428zm11.403 11.405h2.854v1.426h1.425v-4.276h-1.425v-2.853h-1.428v4.277h-4.274v1.427h1.426v1.426h1.426V17.11h-.004zm1.426 4.275H22.81v-1.427h-1.426v2.853h-4.276v1.427h2.854v2.853h1.426v1.426h1.426v-2.853h5.701v-1.426h-4.276v-2.853h-.002zm0 0h1.428v-2.851h-1.428v2.851zm-11.405 0v-1.427h1.424v-1.424h1.425v-1.426h1.427v-2.853h4.276v-2.853h-1.426v1.426h-1.426V7.125h-1.426V4.272h1.426V0h-1.426v2.852H15.68V0h-4.276v2.852h1.426V1.426h1.424v2.85h1.426v4.277h1.426v1.426H15.68v2.852h-1.426V9.979H12.83V8.554h-1.426v2.852h1.426v1.426h-1.426v4.278h1.426v-2.853h1.424v2.853H12.83v1.426h-1.426v4.274h2.85v-1.426h-1.422zm15.68 1.426v-1.426h-2.85v1.426h2.85zM27.086 2.853h-4.275v4.275h4.275V2.853zM15.682 21.384h2.854v-1.427h-1.428v-1.424h-1.427v2.851zm2.853-2.851v-1.426h-1.428v1.426h1.428zm8.551-5.702h2.853v-1.426h-2.853v1.426zm1.426 11.405h1.427V22.81h-1.427v1.426zm0-8.553h1.427v-1.426h-1.427v1.426zm-12.83-7.129h-1.425V9.98h1.425V8.554z"/>
                    </svg>
                    <div class="description">
                      <h2 class="socialtype-${json.socialtype}">${
                            UacanadaMap.socialMediaIcons[json.socialtype]
                      } ${json.mainUsername}</h2>
                      
                      <p>${json.placeExternalUrl}</p>
                    </div>
                </div>
              </div>
          </div>
        </main>
      </div>`
                    : ``;

                var imgFigure = json.pic
                    ? ` <figure class="figure mt-2">  <img src="${json.pic}" style="max-height: 25rem;" class="figure-img img-fluid rounded" alt="Image about ${json.placeTitle}"> </figure>`
                    : ``;

                var colClass = UacanadaMap.allPlaces[tid].json.eventStartDate
                    ? "row-cols-1 row-cols-md-2"
                    : "row-cols-1";
                var html = `<div id="ua-inpost-map-card" class="mt-md-3 row g-0 mb-1 ${colClass}">
          ${eventHtml}
  
          <div id="ua-minimap-wrapper" class="rounded mb-3 position-relative ua-light-shadow">
            
              <div id="ua-post-minimap" style="min-height:18rem"  class="h-100 w-100"> 
                <div class="ua-minimap-overlay p-2 position-absolute top-0 end-0">
                  <span class="badge rounded-pill text-bg-fancy">${
                                          UacanadaMap.api.getCatName(json.placeCategory)
                                        }</span>
                  ${
                                            UacanadaMap.eventCatMapper[json.eventCategory]
                                                ? '<span class="ms-2 badge rounded-pill text-bg-primary">' +
                                                  UacanadaMap.eventCatMapper[json.eventCategory] +
                                                  "</span>"
                                                : ""
                                        }
                  <span class="ms-2 badge rounded-pill text-bg-primary">${
                                            UacanadaMap.socialMediaIcons[json.socialtype]
                                        } ${json.mainUsername}</span>
                </div>  
              </div> 
            
            <div id="ua-post-location-desc" class="ua-linear-blue w-100 position-absolute bottom-0 start-0">
              <div class="ua-place-card-inner p-2 position-absolute rounded">
                <i class="fa fa-signs-post"></i> ${json.streetAddress}</br>
                <i class="fa fa-mountain-city"></i> ${json.city}, ${
                    json.province
                }</br>
                <a target="_blank" title="GPS ${
                                        json.gps
                                    }" href="https://maps.google.com/?q=${
                    json.gps
                }"><i class="fa-solid fa-location-arrow"></i> Google ${
                    json.gps
                }</a></br>
                <a href="/?place=${
                                        json.tid
                                    }"><i class="fa-solid fa-star"></i> Uacanada.org?place=${
                    json.tid
                }</a>
              </div>
            </div>
          </div>
          </div>
          
          
          `;

                var contacts =
                    '<div class="ua-inpost-contacts">' +
                    UacanadaMap.socialMediaIcons[json.socialtype] +
                    " " +
                    json.mainUsername;
                contacts += json.facebook
                    ? '</br><i class="fa-brands fa-facebook"></i> ' + json.facebook
                    : "";
                contacts += json.instagram
                    ? '</br><i class="fa-brands fa-instagram"></i> ' + json.instagram
                    : "";
                contacts += json.telegram
                    ? '</br><i class="fa-brands fa-telegram"></i> ' + json.telegram
                    : "";
                contacts += json.phone
                    ? '</br><i class="fa-solid fa-square-phone"></i> ' + json.phone
                    : "";
                contacts += json.placeExternalUrl
                    ? '</br><a target="_blank" href="https://' +
                      json.placeExternalUrl.replace("https://", "") +
                      '"><i class="fa-brands fa-chrome"></i> ' +
                      json.placeExternalUrl +
                      "</a>"
                    : "";
                contacts += json.searchquery
                    ? '</br><a target="_blank" href="/search?in=posts&timeFilter=newer&sortBy=timestamp&sortDirection=desc&showAs=posts&term=' +
                      json.searchquery +
                      '"><i class="fa fa-search"></i> Search comment about ' +
                      json.searchquery +
                      "</a>"
                    : "";
                contacts += "</div>";

                // $('.posts li[data-index="0"] .post-container .content').prepend(html)

                html +=
                    '<div class="w-100 text-center position-relative" style="z-index: 900; "><i id="scrolldown-offset" class="fa fa-chevron-down bounce-scrolldown" aria-hidden="true"></i></div>';

                if (inpostCardHolder) {
                    $("#" + inpostCardHolder).html(html);
                } else {
                    $(html).insertAfter("#content .topic-info");
                }

                $('.posts li[data-index="0"] .post-container .content').append(
                    imgFigure + contacts
                );

                var pinMarkerIcon = L.divIcon({
                    className: "ua-pin-icon",
                    html:
                        '<div class="position-relative"><span class="mini-latlng-inpost position-absolute">' +
                        json.placeTitle +
                        '</span><span class="ua-bounce-animated-pin">📍</span></div>',
                    iconSize: [25, 25],
                    iconAnchor: [15, 30],
                    popupAnchor: [5, -5],
                });

                var mapbox = L.tileLayer.provider("MapBox", {
                    id: "mapbox/streets-v11",
                    accessToken: ajaxify.data.UacanadaMapSettings.mapBoxApiKey,
                });
                var minimap = L.map("ua-post-minimap", {
                    attributionControl: true,
                    scrollWheelZoom: false,
                    dragging: false,
                    paddingBottomRight: [50, 0],
                    contextmenu: false,
                    center: gps,
                    zoom: 13,
                    layers: [mapbox],
                    tap: false,
                    minZoom: 8,
                    zoomControl: true,
                });
                L.marker(gps, { icon: pinMarkerIcon }).addTo(minimap);

                var zoom = minimap.getZoom();
                var point = minimap.project(gps, zoom);
                point.y = point.y + 40;
                var newlatlng = minimap.unproject(point, zoom);
                minimap.panTo(new L.LatLng(newlatlng.lat, newlatlng.lng));
                UacanadaMap.api.addAtrribution("#ua-post-minimap");

                //  $("html, body").animate({ scrollTop:  $('#ua-inpost-map-card').offset().top - 15 });

                UacanadaMap.api.animateScroll($("#ua-inpost-map-card").offset().top - 15);
            };

            /* Create post header ONLY WHEN INSIDE TOPIC VIEW !*/
            var attempts = 0;
            var waitForMap = setInterval(() => {
                var isReady = UacanadaMap.allPlaces[tid];
                if (isReady) {
                    clearInterval(waitForMap);
                    UacanadaMap.api.drawPostCard();
                    attempts++;
                }
                if (attempts > 1000) clearInterval(waitForMap);
            }, 100);
        } else {
            if (UacanadaMap.adminsUID) console.log(tid, classes);
        }
    } else {
        if (UacanadaMap.adminsUID) console.log(classes);
    }

    // var hasPlaceholder = $("#ua-inpost-location-card").length > 0;  if(hasPlaceholder){  var tid = $("#ua-inpost-location-card").attr('data-place-id')  } else return false;
};
})