

let tabRouteObject = {};

'use strict';
define('uacanadamap/methods', [ 'uacanadamap'], function(UacanadaMap) { 

	const { L, map, Swiper } = UacanadaMap;

	// TODO REFACTOR
	UacanadaMap.api.mainFrameShow=(Y)=>{
		const currentOpacity = $('#ua-mainframe').css('opacity')
		if( Y && currentOpacity !=='1') {$('#ua-mainframe').css('opacity',1);}
		if(!Y && currentOpacity !=='0.2') {$('#ua-mainframe').css('opacity',0.2);}
	}

	UacanadaMap.api.detectMapViewport=()=>{
		const mapH = $('#uacamap').outerHeight();
		const scrollTop = document.documentElement.scrollTop || document.body.scrollTop || 0;
		if(mapH>500){
		 if(scrollTop && scrollTop > Math.floor(mapH*0.70) ){
		  UacanadaMap.api.mainFrameShow(false)
		  } else {
			UacanadaMap.api.mainFrameShow(true)
		  }
	  
		} else{
		  UacanadaMap.api.mainFrameShow(true)
		}
	  }

	UacanadaMap.api.smoothScroll = (target, duration) => {
		let start = window.scrollY;
		let distance = target - start;
		let startTime = null;
	
		function animation(currentTime) {
			if(startTime === null) startTime = currentTime;
			let timeElapsed = currentTime - startTime;
			let run = ease(timeElapsed, start, distance, duration);
			window.scrollTo(0,run);
			if(timeElapsed < duration) requestAnimationFrame(animation);
		}
	
		// Ease function for smooth animation
		function ease(t, b, c, d) {
			t /= d / 2;
			if (t < 1) return c / 2 * t * t + b;
			t--;
			return -c / 2 * (t * (t - 2) - 1) + b;
		}
	
		requestAnimationFrame(animation);
	}
	UacanadaMap.api.animateScroll = (offset,panel,duration) => {
		const currentScroll = document.documentElement.scrollTop || document.body.scrollTop || 0;
	  
	  
		console.log(offset,panel,duration)
		
		return new Promise((resolve, reject) => {
		  if(!offset && !currentScroll){
			resolve({scrolled:0})
		  } else {
			const el = panel||document.getElementById('ua-dragger')
		  //  el.classList.remove('bounce-scroll');
			$("html, body").animate({ scrollTop: Math.min(Math.max(offset||0, 0), 1e12) }, duration||300 , 'swing', ()=> {
		   //   el.classList.add('bounce-scroll');
			 // gestureDone = true;
			  resolve({scrolled:offset||0})
			}); 
		  }
						   
		})
	  };

	

	UacanadaMap.api.setCategory = (category) => {
		if (category) {
			$('#ua-filter-places option[value="' + category + '"]').prop(
				"selected",
				true
			);
			$('#location-category-filter option[value="' + category + '"]').prop(
				"selected",
				true
			);
			$("#location-category-filter").val(category).addClass("filter-active");
			$("#ua-filter-places").val(category);

			UacanadaMap.api.setButton(category, "active");

			if (UacanadaMap.showCtxButtonOnFilter)
				ctxButton({ show: true, reason: "resetCategory" });
		} else {
			$('#ua-filter-places option[value=""]').prop("selected", true);
			$('#location-category-filter option[value=""]').prop("selected", true);
			$("#location-category-filter").removeClass("filter-active").val("");
			$("#ua-filter-places").val("");
			UacanadaMap.api.setButton(false);
			if (UacanadaMap.showCtxButtonOnFilter) ctxButton({ show: false });
		}
		UacanadaMap.api.shakeElements(["#location-category-filter"],'accent-animation');
	};

	
	

	UacanadaMap.api.ctxButton = ({ show, reason, action }) => {
		var el = $("#ua-ctx-button");

		var CTX_BUTT_REASONS = {
			resetCategory: {
				html: '<div class="button-subtitle">Press to remove filter</div>',
				trigger: "show_all_category",
			},
			addPlace: {
				html: '<i class="fa-solid fa-map-pin"></i> Add new place',
				trigger: "add_new_place",
			},
			signUpRequire: {
				html: '<i class="fa-solid fa-user-plus"></i> Create account',
				trigger: "sign_up",
			},
			setLocation: {
				html: '<i class="fa-solid fa-location-crosshairs"></i> Set Location',
				trigger: "set_location",
			},
		};
		var additionalContext = "";
		if (reason === "resetCategory") {
			var catName =
				UacanadaMap.categoryMapper[$("#location-category-filter").val()];
			if (!catName) return;
			additionalContext =
				"<b>" + catName + '</b> <i class="fa-solid fa-delete-left"></i></span>';
		}

		if (show && reason) {
			el.html(CTX_BUTT_REASONS[reason].html + additionalContext);
			el.attr("data-ua-trigger", CTX_BUTT_REASONS[reason].trigger);

			el.addClass("ctx-shown");
			UacanadaMap.api.shakeElements(["#ua-ctx-button"],'accent-animation');
		} else {
			//} else if(!action) {
			el.removeClass("ctx-shown");
		}

		if (action === "show_all_category") {
			UacanadaMap.api.rewriteTabsOnCatChange("");
		}

		if (action === "add_new_place") {
			UacanadaMap.api.addNewPlace();
		}

		if (action === "sign_up") {
			window.location.assign(window.location.origin + "/register");
		}

		if (action === "set_location") {
			UacanadaMap.api.tryLocate({ fornewplace: false });
		}
	};

	UacanadaMap.api.tryLocate = ({ fornewplace }) => {
		const {map}=UacanadaMap
		map
			.locate({ setView: true, maxZoom: 15 })
			.on("locationfound", function (ev) {
				if (fornewplace) createMarkerButton(ev, false);
			})
			.on("locationerror", function (e) {
				map.setView(UacanadaMap.latestLocation.latlng, 12);
				if (UacanadaMap.currentmarker) map.removeLayer(UacanadaMap.currentmarker);
				UacanadaMap.currentmarker = L.marker(UacanadaMap.latestLocation.latlng, {
					icon: UacanadaMap.errorMarker,
				})
					.addTo(map)
					.bindPopup(UacanadaMap.settings.locationSharingErrorAlert)
					.openPopup();

					UacanadaMap.api.showToast(
						"Location Required ",
						'You have not enabled geolocation, but <b>you can manage without it</b>, just move the map until you find the desired point. Make a long tap on the point <i class="fa-regular fa-hand-point-down"></i>',
						"location error"
					);

				UacanadaMap.api.shakeElements([
					".leaflet-control-geocoder-icon",
					".leaflet-control-locate",
				],'ua-shake-element');
			});
	};

	UacanadaMap.api.addNewPlace = () => {
		UacanadaMap.api.expandMap(`addNewPlace`);
		UacanadaMap.api.closeMapSidebar(true);
		UacanadaMap.api.removeCards();
		UacanadaMap.api.tryLocate({ fornewplace: true });
	};

	UacanadaMap.api.loadHtmlTemplates = async () => {
		UacanadaMap.uaEventPartFormHTML = $("#ua-form-event-holder").html();
		UacanadaMap.recoveredOldButtons = ""; //$('#ua-form-event-holder').html();

		$("select#location-category option").each(function (index) {
			var optText = $(this).text();
			var optVal = $(this).val();
			if (optVal) {
				UacanadaMap.categoryMapper[optVal] = optText;
				UacanadaMap.markerGroups[optVal] = []; // Category Named Storage for marker groups
				$("select#ua-filter-places").append(
					'<option value="' + optVal + '">' + optText + "</option>"
				);
			} else {
				if (UacanadaMap.adminsUID) console.log("no opt val", $(this));
			}
		});

		$("select#location-province option").each(function (index) {
			var optText = $(this).text();
			var optVal = $(this).val();
			if (optVal) {
				UacanadaMap.provinceMapper[optText] = optVal;
			}
		});

		$("select#event-location-category option").each(function (index) {
			var optText = $(this).text();
			var optVal = $(this).val();
			if (optVal) {
				UacanadaMap.eventCatMapper[optVal] = optText;
			}
		});

		$("ul.sidepanel-tabs li").each(function (index) {
			var tabNumber = index + 1;
			var markerIcon = $(this).find("i").attr("class");
			UacanadaMap.markersIconsmapper[tabNumber] = markerIcon;
			UacanadaMap.tabTitles[tabNumber] = $(this).find("a").attr("title");
			UacanadaMap.mapTabsCount++;
		});

		if (UacanadaMap.allPlaces) {
			// initUaMap({offline:true})
		} else {
			//initUaMap({offline:false});
			UacanadaMap.api.onMapFirstLaunch();
		}

		return UacanadaMap.mapTabsCount;
	};

	UacanadaMap.api.saveMyLocation = () => {
		if (UacanadaMap.userDeniedGeo) return;
		UacanadaMap.map
			.locate({ setView: true, maxZoom: 15 })
			.on("locationfound", function (e) {
				var { lat, lng } = e.latlng;
				localStorage.setItem("uamaplocation", JSON.stringify([lat, lng]));
			})
			.on("locationerror", function (e) {
				console.log("location error", e);
				//  $('.leaflet-control-locate').addClass('accent-animation')
				if (e.message.includes("User denied Geolocation")) {
					UacanadaMap.userDeniedGeo = true;
					//  showToast('You denied geolocation! ', 'We cannot find your location because you have blocked this option. Check your browser settings',  'location error');
				}
			});
	};

	
	UacanadaMap.api.createMarkerButton = (e, fromAddress) => {
		if (UacanadaMap.currentmarker) {
			UacanadaMap.currentmarker.bindPopup("Detecting address... ").openPopup();
		}
		const {map} = UacanadaMap

		var { lat, lng } = e.latlng;
		UacanadaMap.choosedLocation = [lat, lng];
		localStorage.setItem(
			"uamaplocation",
			JSON.stringify(UacanadaMap.choosedLocation)
		);
		map.setView(e.latlng, 14);

		UacanadaMap.api.clearFormFields();
		$("#ua-latlng-text").val(lat + "," + lng);
		if (UacanadaMap.userRegistered) {
			if (!fromAddress)
				UacanadaMap.hiddenControls.geocoder.options.geocoder.reverse(
					e.latlng,
					map.options.crs.scale(map.getZoom()),
					function (results) {
						UacanadaMap.api.showPopupWithCreationSuggest(results[0]);
					}
				);
			else UacanadaMap.api.showPopupWithCreationSuggest(fromAddress);
		} else {
			UacanadaMap.currentmarker = L.marker(e.latlng, { icon: UacanadaMap.errorMarker })
				.addTo(map)
				.bindPopup(UacanadaMap.settings.unregisteredUserAlert)
				.openPopup();
			window.location.assign(window.location.origin + "/register");
		}
		UacanadaMap.api.closeMapSidebar(true);
		UacanadaMap.api.hideBrandTitle(true);
		if (UacanadaMap.isFullscreenMode) map.toggleFullscreen();
	};

	UacanadaMap.api.showPopupWithCreationSuggest = (r) => {
		const {map} = UacanadaMap
		var { lat, lng } = r.center;
		var {
			address,
			text,
			neighborhood,
			place,
			postcode,
			district,
			region,
			country,
		} = r.properties;
		var popupHtml = "";
		if (country === "Canada") {
			var addressIcon = address ? "📮 " : "📍 ";
			var addressLine = r.name; // (address||'')+' '+text+', '+place+' '+postcode;
			var subAdress = (neighborhood || "") + " " + district + ", " + region;
			popupHtml =
				'<div class="ua-popup-codes mt-3">' +
				"<code>" +
				addressIcon +
				addressLine +
				"</code></br>" +
				"<code>🗺️ " +
				subAdress +
				"</code></br>" +
				"<code>🧭 " +
				lat.toString().substring(0, 8) +
				"," +
				lng.toString().substring(0, 10) +
				"</code>" +
				"</div>" +
				'<p style="font-size:0.75rem">To create a location at different coordinates: move the map to the desired location and make a long tap or right-click. If you know the exact address, use the search box and enter the address directly there!</p> ' +
				'<button id="uaAddNewLoc" type="button" class="btn btn-link" data-bs-toggle="offcanvas" data-bs-target="#place-creator-offcanvas">Yes, here!</button>';

			$("#uaMapAddress").val(addressLine);
			$("#subaddress").val(subAdress);
			if (place) $("#ua-newplace-city").val(place);

			if (region && UacanadaMap.provinceMapper[region])
				$(
					'#location-province option[value="' +
						UacanadaMap.provinceMapper[region] +
						'"'
				).prop("selected", true);
		} else {
			popupHtml =
				"<b>⁉️ Looks like the location you provided is not in Canada: </br><code>" +
				country +
				" " +
				place +
				" " +
				neighborhood +
				" " +
				region +
				"</code></br>Correct your choice on the map!</b></br>It must be a Canadian place";
		}

		if (UacanadaMap.currentmarker) map.removeLayer(UacanadaMap.currentmarker);
		UacanadaMap.currentmarker = L.marker(r.center, { icon: UacanadaMap.newPlaceMarker })
			.addTo(map)
			.bindPopup(popupHtml)
			.openPopup();
		UacanadaMap.api.removeCards();
	};


	UacanadaMap.api.rewriteTabs = (criteria) => {
		let items = [];
		const {map}=UacanadaMap
		
		if (UacanadaMap.adminsUID) {
		  console.log(`rewriteTabs(${criteria})`);
		}
		if (!UacanadaMap.allPlaces) {
		  return console.log(`No places!!!`);
		}
		if (UacanadaMap.pointerMarker) {
		  map.removeLayer(UacanadaMap.pointerMarker);
		}
		
		const mustBeInCategory = $("#ua-filter-places").val();
		
		UacanadaMap.allPlacesArray = []; // clean up
		const allMarkersObj = UacanadaMap.allPlaces;
		let placesLength = 0;
		
		const anyLocation = criteria === "anyLocation";
		UacanadaMap.showOnlyArea = anyLocation ? false : true;


		UacanadaMap.TEMP.tabHtmlObj = {}; // clean up
		UacanadaMap.TEMP.tabEventsArray = []; // clean up
		UacanadaMap.TEMP.tabItemsArray = []; // clean up TODO
		for (const key in allMarkersObj) {
		  if (Object.hasOwnProperty.call(allMarkersObj, key)) {
			
			const element = allMarkersObj[key];
			const item = element.json;
			const isOnMap = UacanadaMap.api.isPlaceVisibleOnMap(map, element.gps);
			const tid =  Number(item.tid)
			if (!mustBeInCategory || mustBeInCategory === item.placeCategory) {
			  UacanadaMap.allPlacesArray.push({
				tid: tid,
				lat: element.marker._latlng.lat,
				lng: element.marker._latlng.lng,
				json: item,
				html: element.marker.uaMarkerCardHTML,
			  });
			}
			
			if (isOnMap || anyLocation) {
			  items.push({
				tabs: element.tab_ids,
				item,
				index: placesLength,
				icon: element.marker.icon,
			  });
			  placesLength++;


			// TODO WIP 
			
			const eventDate = item.eventStartDate? new Date(`${item.eventStartDate} ${item.eventStartTime}`):0;
			const eventTimestamp = eventDate? Math.floor(eventDate.getTime() / 1000):0;
			if (eventTimestamp > 0) {
				UacanadaMap.TEMP.tabEventsArray.push({tid, eventTimestamp,everyWeek: item.eventWeekDay, category: item.placeCategory});
			}else{
				UacanadaMap.TEMP.tabItemsArray.push({ tid, createdTimestamp: item.created, category: item.placeCategory });
			}
			
			




			} else {
			}
		  }
		}
		



		UacanadaMap.api.populateTabsNew();









		UacanadaMap.tabEventsArray = []; // clean up
		UacanadaMap.tabItemsArray = []; // clean up
	
		
		for (const x of items) {
		  const { tabs, item, index, icon } = x;
		  
		  for (const tab of tabs) {
			let lineIcon = `${icon} `;
			let lineTitle = item.placeTitle || item.mainUsername;
			let eventTimestamp = 0;
			let calendarItem = "";
			const bloggersTabClass = tab === UacanadaMap.tab_numerator.youtube ? ` ua-blogger-${item.socialtype}` : "";
			const listClassName = `${UacanadaMap.markersClasses[tab]} ua-list-topic${item.tid}${bloggersTabClass}`;
			
			if (tab === UacanadaMap.tab_numerator.events && item.eventStartTime) {
			  const eventDate = new Date(`${item.eventStartDate} ${item.eventStartTime}`);
			  eventTimestamp = Math.floor(eventDate.getTime() / 1000);
			  const month = UacanadaMap.months[eventDate.getMonth()];
			  const dateDigit = eventDate.getDate();
			  const eventDay = UacanadaMap.weekdays[eventDate.getDay()];
			  const everyWeek = item.eventWeekDay ? `<p class="calendar-recurrence m-0"><i class="fa-solid fa-rotate-right"></i> Every ${item.eventWeekDay} at ${item.eventStartTime}</p> ` : "";
			  const startTime = `<span title="${eventDate}">${item.eventStartDate} at ${item.eventStartTime} ${eventDay}</span></br>`;
			  const endTime = item.eventEndDate || item.eventEndTime ? `${item.eventEndDate}${item.eventEndTime ? ` at ${item.eventEndTime}` : ""}` : "";
			  const schedule = item.eventWeekDay ? everyWeek : `${startTime}${endTime}`;
			  lineIcon = `<div class="event-date-sq"><b>${dateDigit}</b> ${month}</div>`;
			  lineTitle = `${item.eventName}</br>${UacanadaMap.eventCatMapper[item.eventCategory]}</br>${schedule}`;
			  calendarItem = `
				<li class="blogger-loc ${listClassName}" data-ua-event-ts=${eventTimestamp} data-marker-id=${item.tid} data-blogger-loc="${item.gps}">
				  <div class="calendar-item">
					<div class="calendar-date p-3">
					  <span class="calendar-day">${dateDigit}</span>
					  <span class="calendar-month">${month}</span>
					</div>
					<div class="calendar-details p-3">
					  <h3 class="calendar-title"><i class="fa-regular fa-calendar-check"></i> ${item.eventName}</h3>
					  <p class="calendar-time m-0"><i class="fa fa-clock"></i> <strong>${eventDay}</strong> ${item.eventStartDate} at ${item.eventStartTime} - ${endTime}</p>
					  ${UacanadaMap.eventCatMapper[item.eventCategory]} ${everyWeek}
					  <p class="calendar-location"><i class="fa-solid fa-location-pin"></i> ${item.city}, ${item.province}</p>
					</div>
				  </div>
				</li>`;
			}
			
			const userLine = `
			  <li class="text-truncate blogger-loc ${listClassName}" data-ua-event-ts=${eventTimestamp} data-marker-id=${item.tid} data-blogger-loc="${item.gps}">
				${lineIcon}
				${lineTitle} <span class="float-end ms-1">${item.city}, ${item.province}</span>
			  </li>
			`;
			
			if (eventTimestamp > 0) {
			  UacanadaMap.tabEventsArray.push({
				eventTimestamp,
				targetDiv: `#ua-peoples-target-${tab}`,
				userLine: calendarItem,
				everyWeek: item.eventWeekDay,
				category: item.placeCategory,
			  });


			

			} else {
			  UacanadaMap.tabItemsArray.push({
				createdTimestamp: item.created,
				targetDiv: `#ua-peoples-target-${tab}`,
				userLine,
				category: item.placeCategory,
			  });

			  

			}
		  }
		}
		
		UacanadaMap.api.populateTabs();
		
		UacanadaMap.api.showCatSelector(mustBeInCategory);
		
		
		if (items[0]) {

			
			UacanadaMap.api.showOnMapOnlyChoosen({  category: $("#ua-filter-places").val() });

			$("#ua-sidebar-warn-placeholder").html("");

		  
		} else { /* Warn if empty */
			$("#ua-sidebar-warn-placeholder").html(`<div class="nomanlands-overlay">There is nothing to be found!</div>`);
			let suggestions = `<li style="color: #383838;background: #ffe1e1;padding: 1rem;margin-top: 1rem;"><i class="fa-solid fa-magnifying-glass-minus"></i> Keep moving the map or zoom out (or press <b style="cursor:pointer" class="show-all-places">Show All</b>)</li>`;
			
			if (mustBeInCategory) {
			  suggestions += `<li style="color: #383838;background: #ffe1e1;padding: 1rem;margin-top: 1rem;"><i class="fa-solid fa-filter-circle-xmark"></i> Note that you are using the category <b>${UacanadaMap.api.getCatName(mustBeInCategory)}</b> as a filter! To see more results - set the filter to <b>All Places</b></li>`;
			}
			
			$(UacanadaMap.ALL_ITEMS_DIV).html(suggestions);
		}
		
		if (criteria === "onlyVisibleArea") {
		  $("#show-only-map-items").addClass("only-on-map");
		} else {
		  $("#show-only-map-items").removeClass("only-on-map");
		}
	  };
	  

	UacanadaMap.api.showOnMapOnlyChoosen = ({ category }) => {
		

		try {
			
			const mrks = UacanadaMap.mapLayers.markers.getLayers()
			UacanadaMap.mapLayers.markers.removeLayers(mrks)
			UacanadaMap.api.cleanMarkers()
			
		} catch (error) {
			if(adminsUID)console.log(error)
		
		}
		

		for (const m of UacanadaMap.allPlacesArray) {
			try {
				UacanadaMap.mapLayers.markers.addLayer(UacanadaMap.allPlaces[m.tid].marker);
				
			} catch (error) {
				if(adminsUID)console.log(`mapLayers.markers.addLayer error: `,error)
			}
			
		}

		UacanadaMap.mapLayers.markers.addTo(map)
	




	};

	

	

	UacanadaMap.api.populateTabs = () => {
		var isToday;
		var newItems = "";
		var nearestEventsCount = 0;
		var placescounter = 0;
		tabRouteObject = {};
		var htmlUpcoming48h = "";
		var htmlUpcomingEvents = "";
		var htmlExpireEvents = "";
		var htmlRegularEvents = "";
		tabRouteObject[UacanadaMap.ALL_ITEMS_DIV] = ""; // prevent undefined word in ul li
		UacanadaMap.tabEventsArray.sort((a, b) => a.eventTimestamp - b.eventTimestamp);
		UacanadaMap.tabItemsArray.sort(
			(a, b) => b.createdTimestamp - a.createdTimestamp
		);

		for (var event of UacanadaMap.tabEventsArray) {
			isToday = event.everyWeek === UacanadaMap.weekDay;
			if (UacanadaMap.timestampNow > event.eventTimestamp && !event.everyWeek) {
				htmlExpireEvents += event.userLine;
			}

			if (event.everyWeek) {
				htmlRegularEvents += event.userLine;
				if (isToday) {
					htmlUpcoming48h += event.userLine;
					// nearestEventsCount++
				}
			}

			if (UacanadaMap.timestampNow < event.eventTimestamp) {
				if (event.eventTimestamp - UacanadaMap.timestampNow < 172800 && !isToday) {
					htmlUpcoming48h += event.userLine;

					// nearestEventsCount++
				} else {
					htmlUpcomingEvents += event.userLine;
				}
			}

			if (UacanadaMap.api.filterByCategory(event.category))
				tabRouteObject[UacanadaMap.ALL_ITEMS_DIV] += event.userLine;
			//  placescounter++;
			nearestEventsCount++;
		}

		for (var mapItem of UacanadaMap.tabItemsArray) {
			if (mapItem.targetDiv !== UacanadaMap.ALL_ITEMS_DIV) {
				if (tabRouteObject[mapItem.targetDiv]) {
					tabRouteObject[mapItem.targetDiv] += mapItem.userLine;
				} else {
					tabRouteObject[mapItem.targetDiv] = mapItem.userLine;
				}
			} else {
				if (UacanadaMap.api.filterByCategory(mapItem.category)) {
					tabRouteObject[UacanadaMap.ALL_ITEMS_DIV] += mapItem.userLine;
				}
				newItems += mapItem.userLine;
				placescounter++;
			}
		}

		for (const div in tabRouteObject) {
			if (Object.hasOwnProperty.call(tabRouteObject, div)) {
				const html = tabRouteObject[div];
				$(div).html(html);
			}
		}

		var eventHtml = [
			htmlUpcoming48h
				? "<li><h6>Events In the Next 48 hours</h6></li>" + htmlUpcoming48h
				: "",
			htmlRegularEvents
				? '<li><h6 class="mt-5">Weekly events</h6></li>' + htmlRegularEvents
				: "",
			htmlUpcomingEvents
				? '<li><h6 class="mt-5">Upcoming events</h6></li>' + htmlUpcomingEvents
				: "",
			htmlExpireEvents
				? '<li><h6 class="mt-5">Expired events:</h6></li>' + htmlExpireEvents
				: "",
		];

		$("#ua-peoples-target-" + UacanadaMap.tab_numerator.events).html(
			eventHtml.join("")
		);

		$("#placescounter").text(placescounter + "+");

		if (nearestEventsCount > 0) {
			$("#eventscounter")
				.text(nearestEventsCount + "+")
				.css("visibility", "visible");
		} else {
			$("#eventscounter").css("visibility", "hidden");
		}

		if (!tabRouteObject[UacanadaMap.ALL_ITEMS_DIV]) {
			UacanadaMap.api.showNotFoundOnSummaryTab();
		}

		$("#ua-news-list").html(htmlUpcoming48h + newItems);
	};


	UacanadaMap.api.setCategoryAndOpenCards = (category) => {
		UacanadaMap.api.rewriteTabsOnCatChange(category);
		UacanadaMap.api.openCards(null, null);
	};

	UacanadaMap.api.onTabChange = ({ tab }) => {
		if (!tab) return 0;
		if (tab === UacanadaMap.ALL_ITEMS_TAB_ID) {
			// todo toggle notice about category filter
		} else {
			UacanadaMap.api.openSidebarForCat(false);
		}
	};

	

	UacanadaMap.api.closeMapSidebar = (force) => {
		if (!force && $(window).innerWidth() > 1899) return false
		if (!UacanadaMap.api.sidebarIsOpened()) return false
		$("#ua-sidepanel").removeClass("opened").addClass("closed")
		
			UacanadaMap.api.foldSidebar(false)
			UacanadaMap.api.resetGeoFilter()
			UacanadaMap.api.hideBottomsAndBlockScroll(false)
			UacanadaMap.api.fitElementsPosition()
		
		return true
	};

	UacanadaMap.api.resetGeoFilter = () => {
		UacanadaMap.showOnlyArea = false;
		UacanadaMap.api.rewriteTabs("anyLocation");
		$("#show-only-map-items").removeClass("only-on-map");
	};

	UacanadaMap.api.rewriteTabsOnCatChange = (category) => {
		$("#location-visible").removeClass("show-top-buttons");
		$("#location-category-filter").removeClass("show-top-buttons");

		UacanadaMap.api.setCategory(category);
		if (UacanadaMap.showOnlyArea) {
			UacanadaMap.api.rewriteTabs("onlyVisibleArea");
			// $('#location-visible').addClass('show-top-buttons')
			UacanadaMap.api.showToast(
				"Area filter",
				"In this mode you see a list of only those locations that are visible on the map",
				"Advisory"
			);
		} else {
			UacanadaMap.api.rewriteTabs("anyLocation");
			// $('#location-visible').removeClass('show-top-buttons')
		}

		if (category) {
			$("#location-category-filter").addClass("show-top-buttons");
		} else {
			$("#location-category-filter").removeClass("show-top-buttons");
		}
	};

	UacanadaMap.api.openSidebarForCat = (category) => {
		UacanadaMap.api.rewriteTabsOnCatChange(category);
		if (category) {
			UacanadaMap.api.openMapSidebar(1);
		}
	};

	UacanadaMap.api.openMapSidebar = (tab) => {
		if (tab && Number(tab) > UacanadaMap.mapTabsCount) return; //openMapSidebar(1); // Kinda loop
		map.setView(map.getCenter(), 13);
		//UacanadaMap.api.expandMap();
		UacanadaMap.api.hideBrandTitle(true);
		UacanadaMap.api.fitElementsPosition();
		UacanadaMap.api.hideBottomsAndBlockScroll(true);
		UacanadaMap.api.animateScroll();
		if (tab) {
			$(".sidepanel-content .sidebar-tab-link").removeClass("active");
			$("#ua-sidepanel").removeClass("closed").addClass("opened");

			for (var tabId = 1; tabId < UacanadaMap.mapTabsCount + 1; tabId++) {
				if (tabId === tab) {
					$('[data-tab-content="tab-' + tabId + '"]').addClass("active");
					$('[data-tab-link="tab-' + tabId + '"]').addClass("active");
					UacanadaMap.api.onTabChange({ tab: tabId });
				} else {
					$('[data-tab-content="tab-' + tabId + '"]').removeClass("active");
					$('[data-tab-link="tab-' + tabId + '"]').removeClass("active");
				}
			}
		}
	};

	UacanadaMap.api.foldSidebar = (fold) => {
		if (fold) {
			$("#ua-sidepanel").addClass("folded-sidebar");
			$("#fold-mapsidepanel")
				.attr("data-ua-fold", "unfold")
				.html('<i class="fa-solid fa-up-right-and-down-left-from-center"></i>');

			UacanadaMap.isSidebarFolded = true;
		}
		if (!fold) {
			$("#ua-sidepanel").removeClass("folded-sidebar");
			$("#fold-mapsidepanel")
				.attr("data-ua-fold", "fold")
				.html('<i class="fa-solid fa-angle-down"></i> Show map zone');

			UacanadaMap.isSidebarFolded = false;
		}
		return UacanadaMap.api.fitElementsPosition();
	};

	UacanadaMap.api.openCardsOnStartup = () => {
		if (!isMainPage && $("#ua-cards-slider")[0]) {
			UacanadaMap.api.removeCards();
			console.log("openCardsOnStartup removeCards ", { isMainPage });
		}
		setTimeout(() => {
			if (
				$("body").hasClass("map-touched") ||
				$("#ua-cards-slider")[0] ||
				!UacanadaMap.api.isMainPage()
			)
				return;
			// var closestMarker = closestMarkerAddress();
			// if(closestMarker) $('.nearest-on-map').html('Nearest place: '+closestMarker)
			// niceShown()
			$("#location-sort").val("latest");
			UacanadaMap.api.openCards(null, "latest", true);
		}, 950);
	};

	UacanadaMap.api.moveMarkerToTop = (c, markerOffset) => {
	   const {map,showOnlyArea}	= UacanadaMap
		if (showOnlyArea) {
			console.log(`Marker not move cause showOnlyArea=true`);
			// TODO
			return;
		}
		var latlng = c.lat ? c : { lat: c[0], lng: c[1] };
		map.setView(latlng, map.getZoom());
		var zoom = map.getZoom();
		var point = map.project(latlng, zoom);
		point.y = point.y + markerOffset;
		var newlatlng = map.unproject(point, zoom);
		map.panTo(new L.LatLng(newlatlng.lat, newlatlng.lng));
	};

	UacanadaMap.api.detectUrlParam = () => {
		const {map}	= UacanadaMap
		$("body").removeClass("post-with-map").removeClass("linked-location");
		var tid = location.search.split("place=")[1] || "";
		if (UacanadaMap.adminsUID) console.log("detectUrlParam() :: ", location.search);

		if (
			map &&
			tid &&
			Number(tid) > 1 &&
			UacanadaMap.allPlaces[tid] &&
			UacanadaMap.allPlaces[tid].gps &&
			UacanadaMap.allPlaces[tid].marker
		) {
			UacanadaMap.api.expandMap(`detectUrlParam`);
			UacanadaMap.api.animateScroll();
			setTimeout(() => {
				var maxZoom = 14;
				map.setView(UacanadaMap.allPlaces[tid].gps, maxZoom);
				$("body").addClass("linked-location");
				UacanadaMap.lastPlaceMarker = UacanadaMap.allPlaces[tid].marker.openPopup();
				UacanadaMap.api.openCards(Number(tid), "distance");
			}, 300);
		} else if (
			!tid &&
			map &&
			UacanadaMap.api.isMainPage() &&
			!$("#ua-cards-slider-list")[0]
		) {
			return; // openCards(null,'latest');
		} else {
			return false;
		}
	};

	UacanadaMap.api.reloadMainPage = () => {
		// TODO need refactoring

		if (!UacanadaMap.preventMultiCall && UacanadaMap.api.isMainPage()) {
			window.location.reload(true);
			location.reload(true);
		}
	};

	

	UacanadaMap.api.createStories = () => {

		return; // TODO REMOVE
		
	};

	UacanadaMap.api.createShortsSelfHosted = (storieCardIndex) => {
		return; // TODO REMOVE
		
	};

	UacanadaMap.api.uncluster = (y) => {};

	return UacanadaMap;
})
