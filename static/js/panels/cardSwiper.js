 'use strict';
  define('panels/cardSwiper', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
      const {Swiper} = UacanadaMap
    
  UacanadaMap.api.animateCards = async (state) => {
     if(state==='open'){
       UacanadaMap.api.rotateCards(UacanadaMap.swipers.cardsCarousel.params.direction)
      $(UacanadaMap.placeCardDiv).removeClass('slider-closed').addClass('slider-opened')
     } else{
      $(UacanadaMap.placeCardDiv).removeClass('slider-opened').addClass('slider-closed')
     }
    }
  
    
  
  
  
    UacanadaMap.api.cleanMarkers = (forced) => {
      UacanadaMap.api.setContextCss()
     // $('.ua-marker-d').removeClass('ua-opened-marker');
      if(UacanadaMap.pointerMarker) {
        UacanadaMap.map.removeLayer(UacanadaMap.pointerMarker);
        UacanadaMap.pointerMarker = null
      }
     
      if(UacanadaMap.lastPlaceMarker){
        UacanadaMap.lastPlaceMarker.closePopup()
        //removeClassFromMarkerIcon(UacanadaMap.lastPlaceMarker, 'ua-opened-marker');
      }
  
      if(forced) {
        UacanadaMap.api.cardsOpened(false)
      }
  
     
    
    }
  
  UacanadaMap.api.pointerMarker = (tid,place) => {
     const {map,L} = UacanadaMap
       UacanadaMap.api.cleanMarkers()
      if(!tid)return false  
      const markerImg = UacanadaMap.api.getProfileImage(place.json)
      const pointerMarkerIcon = L.divIcon({className: 'pointer-marker', html: `<div class="pointer-marker-icon rounded-circle" style="background: url(${markerImg}) center center / cover no-repeat white; animation:ua-shake-element 600ms ease-in-out both"></div>`, iconSize: [64, 64], iconAnchor: [32, 32],  popupAnchor:  [0, -33]});
      UacanadaMap.pointerMarker = L.marker(place.gps, {icon: pointerMarkerIcon});
      UacanadaMap.pointerMarker.bindPopup(place.marker._popup._content);
      UacanadaMap.pointerMarker.setZIndexOffset(88888);
      //place.marker.setZIndexOffset(88880)
  
  
      
  
      const slide = $('div[data-slide-tid="'+Number(tid)+'"]')
      const slideId = slide.attr('data-slide-index')
      
  
      UacanadaMap.pointerMarker.on('click', (e)=> {    
        
        try {
          UacanadaMap.swipers.cardsCarousel.slideTo(Number(slideId)) 
          UacanadaMap.map.setView(place.gps,map.getZoom()+1);   
          UacanadaMap.pointerMarker.openPopup(); 
        } catch (error) {
          
        }
       
      
      });
      
    
        if(!UacanadaMap.pointerMarker) return 
  
  
       
  
           let openedMarkerCss = place.neighborsCount ?`.ua-topic-${Number(tid)} { font-weight: bold; opacity: 1!important;}` : `.ua-topic-${Number(tid)} {opacity:0!important}`
           openedMarkerCss+=` div[data-slide-tid="${Number(tid)}"] .ua-topic-link .place-pic { width: 4rem!important} div[data-slide-tid="${Number(tid)}"] .card-title{ font-weight: bold;} div[data-slide-tid="${Number(tid)}"] .ua-place-card-inner {0px 6px 8px 0px rgba(0, 0, 0, 0.5)}`
           UacanadaMap.api.setContextCss(openedMarkerCss)
           UacanadaMap.api.cardsOpened(true)
          
       //   addClassToMarkerIcon(place.marker, 'ua-opened-marker');
        //  if(place.neighborsCount) addClassToMarkerIcon(place.marker,"has-neighbors");
          UacanadaMap.api.fitElementsPosition(place.gps)
          UacanadaMap.pointerMarker.addTo(UacanadaMap.map).openPopup()
          //$('.ua-topic-'+tid).addClass('ua-opened-marker');
         
         // UacanadaMap.api.setContextCss('.ua-marker-default.ua-topic-'+Number(tid)+'{opacity:0!important}')
          //UacanadaMap.api.setContextCss('.ua-marker-default{max-width:5rem!important;}')
           // $(place.marker._icon).addClass("ua-opened-marker");
          
          // if(place.marker.__parent?.spiderfy){
          //   //place.marker.__parent.spiderfy()
          // }
     
  }
  
  
  UacanadaMap.api.openMarker=(tid)=>{
    if(!tid)return
    const {map} = UacanadaMap
      const place = UacanadaMap.allPlaces[Number(tid)];
      if(place && place.marker){
        UacanadaMap.previousTid=Number(tid)
        const isVisibleEl = UacanadaMap.allPlaces[Number(tid)].marker.getElement()
        const currentZoom = map.getZoom()
        UacanadaMap.lastPlaceMarker = place.marker;
        const zoom_level = isVisibleEl && currentZoom > 13  ? map.getZoom() : 16;
        const latlng = place.gps
        map.setView(latlng, zoom_level);
        UacanadaMap.api.pointerMarker(Number(tid),place)
      }
  };
  
  
  
  UacanadaMap.api.openCarousel = async (places, autoplay) =>{
      const {L} = UacanadaMap
      UacanadaMap.api.animateCards('closed')
      const card = $(UacanadaMap.placeCardDiv);
      const cat = $('#location-category-filter').val();
      const { isDesktop } = UacanadaMap.api.getDivSizes();
      const onlyOneItem = places.length <= 1;
      let html = `<button id="cardsDown" aria-hidden="true"><i class="fa-solid fa-angle-down"></i></button> <div id="ua-cards-slider" class="swiper pb-3 desktop-${isDesktop}${onlyOneItem ? ' only-one-item pe-1' : ' ps-2'}"> <div class="swiper-wrapper">`;
    
      places.forEach((placedata, index) => {
        html += `<div data-slide-index="${index}" data-slide-tid="${placedata.tid}" class="swiper-slide${onlyOneItem ? ' p-2' : ' me-3'}">${placedata.html}</div>`;
      });
  
      const slideTreshold = $(window).innerWidth() > 480 ? Math.floor($(window).innerWidth() / 650) + 1 : 1;
       if (places.length > slideTreshold && cat) {
       html += `<div class="swiper-slide me-3">
                <ul id="last-incat-slide" class="bg-primary p-2 shadow rounded list-group list-group-flush">
                    <li class="list-group-item">
                        <i class="fas fa-info-circle"></i> 
                        End of the line for <span class="badge text-bg-light rounded-pill">${UacanadaMap.api.getCatName(cat)}</span> places
                    </li>
                    <li class="list-group-item">
                        <i class="fas fa-plus-circle"></i> 
                        Fancy adding a spot?
                    </li>
                    <li class="list-group-item show-all-places">
                        <i class="fas fa-globe-americas"></i> 
                        Clear filters & Explore all places
                    </li>
                    
                </ul>
            </div>`;
      }
    
      if (places.length > slideTreshold) {
       html += '<div class="swiper-slide me-3"><div id="last-slide" class="p-2 ua-blue-gradient shadow rounded"><div class="dynamictext p-0">Find more</div>In our blogs</div></div>';
      }
  
      try {
        const ads = cat ? UacanadaMap.api.findMatchedAdv(cat,places[0].json.placetags) : places.length > slideTreshold ? ajaxify.data.UacanadaMapSettings.advMarkers:[]
        for (const ad of ads) {
          html += `<div class="swiper-slide${onlyOneItem ? ' p-2' : ' me-3'}" data-adv-id="${ad.id}" data-latlng-target="${ad.latlng}"><div class="ua-place-card-inner ms-0 me-0 p-3 position-relative">${ad.card}</div></div>`;
        }
      } catch (error) {
        UacanadaMap.console.log(error)
      }
        
  
  
      html += '</div></div>'
      places.length
  
      UacanadaMap.api.contextButtonText({text:'Open '+places.length+' places... '+UacanadaMap.api.getCatName(cat),delay:1300,to:UacanadaMap.contextButton.router.cards})
  
  
      await sleep(33);
      card.html(html);
      UacanadaMap.api.openPlacesSwiper(places,autoplay);
      UacanadaMap.api.hideElements(true)
      await sleep(33);
      UacanadaMap.api.animateCards("open");
      var cardDivId = L.DomUtil.get(UacanadaMap.placeCardDiv.replace("#", ""));
      L.DomEvent.disableScrollPropagation(cardDivId);
      L.DomEvent.disableClickPropagation(cardDivId);
      
  
      
  }
  
  UacanadaMap.api.openPlaceModal = async (tid) => {
  
        if(!tid){
          tid = Number($('.swiper-slide-active .ua-place-card-inner').attr('data-ua-tid'))
        }
  
        const p = UacanadaMap.allPlaces[tid].json
        const fa_icon = UacanadaMap.allPlaces[tid].marker?.icon
        const placeModal = document.getElementById('ua-place-modal')
        const modalTitle = placeModal.querySelector('#modal-place-title')
        const modalBodyInput = placeModal.querySelector('#ua-place-modal .dyn-content')
        modalTitle.innerHTML = `${fa_icon} ${p.placeTitle}`
        const img = UacanadaMap.api.getProfileImage(p)
        const latlngSrting = p.latlng.join(',')
        modalBodyInput.innerHTML = `<div style="background:url(${img}) center center;background-size:cover;width:5rem" class="me-2 mb-1 ratio ratio-1x1 rounded-circle"></div>
        <div class="white-space-pre-line">
        ${p.placeDescription}  ${p.placeDescriptionAlt?`<p class="w-100 d-flex justify-content-center"><i class="fa-solid fa-language"></i><p>${p.placeDescriptionAlt}`:''}
        </div>
  
        <ul class="list-group mt-3">
        ${p.mainUsername ? `<li class="list-group-item">${fa_icon} ${p.mainUsername}</li>` : ''}
        ${p.placeExternalUrl ? `<li class="list-group-item">🔗 ${p.placeExternalUrl}</li>` : ''}
        ${p.categoryName ? `<li class="list-group-item">🔖 ${p.categoryName}</li>` : ''}
        ${p.city && p.province ? `<li class="list-group-item">🌆 ${p.city}, ${p.province}</li>` : ''}
        ${p.streetAddress ? `<li class="list-group-item">📮 ${p.streetAddress}</li>` : ''}
        ${p.subaddress ? `<li class="list-group-item">${p.subaddress}</li>` : ''}
        <li class="list-group-item text-truncate"><i class="fa-brands fa-google"></i> <a title="google map" href="https://maps.google.com/?q=${latlngSrting}">${latlngSrting}</a></li>
        </ul>
      <div id="place-modal-comments"></div>
      `
        $("#ua-place-modal").offcanvas("show");
  
        const topicFromApi = await fetch(`/api/topic/${tid}`); // TODO add /1 in settings for comment sorting
        const topic = await topicFromApi.json();
        if(!topic || !topic.posts[0]) return
  
        let comments = `<ul id="recent_posts" class="mt-5 list-group" data-numposts="${topic.posts.length}" data-cid="${topic.cid}">`; // TODO chnage id="recent_posts" to anothe because this id loads comments from widget 
        topic.posts.forEach((comment) => {
          
        const avatar = comment.user.picture? 
        `<img alt="${comment.user.fullname}" title="${comment.user.fullname}" class="avatar avatar-tooltip not-responsive avatar-rounded" component="avatar/picture" src="${comment.user.picture}" style="width:3rem" onerror="this.remove();" itemprop="image">`: 
        `<span alt="${comment.user.fullname}" title="${comment.user.fullname}" data-uid="${comment.user.userslug}" loading="lazy" class="avatar avatar-tooltip not-responsive avatar-rounded" component="avatar/icon" style="--avatar-size: 24px; background-color: #009688;">UA</span>`;
        
  
        comments += `
          <li  class="list-group-item" data-pid="${comment.pid}">
          
              <a class="text-decoration-none float-start me-3 mb-3" href="/user/${comment.user.userslug}">  ${avatar} </a>
              ${comment.content} <a class="float-end" href="/post/${comment.pid}">  <i class="fa-regular fa-comment-dots"></i>  </a>
            
            
          </li>
        `;
      });
  
      comments += `</ul> <p class="w-100 d-flex justify-content-center"> <a id="modal-place-link" href="/topic/${tid}"> read more </a> </p>`;
  
      $("#place-modal-comments").html(comments)
  
  
  }
  
  
  
  UacanadaMap.api.openPlacesSwiper = (places,autoplay) => {
  
    let direction = UacanadaMap.swipers.cardsCarousel.params?.direction || (window.innerWidth<1000?"horizontal":"vertical")
    let freeMode = {
        enabled: true,
        sticky: true,
      }

    UacanadaMap.swipers.cardsCarousel = new Swiper('#ua-cards-slider', {
        direction,
        freeMode,
        slidesPerView: 'auto',
        mousewheel: { invert: false, sensitivity: 0.25, eventsTarget: '#ua-cards-slider' }, // TODO: move sensitivity option to ACP
        autoplay: autoplay ? { delay: 4200, disableOnInteraction: false } : false,
      }).on('slideChangeTransitionEnd', (e) => handleSlideChange(e, places, UacanadaMap)).on('click', (J, event) => handleClick(J, event, UacanadaMap))

     
        
}
  
  
  
  UacanadaMap.api.closestMarkerAddress=()=>{
      var loc_string = localStorage.getItem("uamaplocation");
      if(loc_string){
        var [lat,lng] = JSON.parse(loc_string);
        var nearest_markers = UacanadaMap.api.sortMarkers( {_latlng:{lat:lat, lng:lng}} , 'distance' );
        var near = nearest_markers[0].json;
        return near.placeTitle+', '+near.city;
        
      }else{
        return '';
      }
    
    }
  
  
    UacanadaMap.api.nearestByDistance = (firstMarker, locations) => {
      const tid = firstMarker.tid;
      const distanceTo = { lat: firstMarker._latlng.lat, lng: firstMarker._latlng.lng };
    
      // define local constants for frequently used functions
      const asin = Math.asin;
      const cos = Math.cos;
      const sin = Math.sin;
      const PI_180 = Math.PI / 180;
    
      function hav(x) {
        const s = sin(x / 2);
        return s * s;
      }
    
      function relativeHaversineDistance(lat1, lon1, lat2, lon2) {
        const aLatRad = lat1 * PI_180;
        const bLatRad = lat2 * PI_180;
        const aLngRad = lon1 * PI_180;
        const bLngRad = lon2 * PI_180;
        const ht =
          hav(bLatRad - aLatRad) + cos(aLatRad) * cos(bLatRad) * hav(bLngRad - aLngRad);
        // since we're only interested in relative differences,
        // there is no need to multiply by earth radius or to sqrt the squared differences
        return asin(ht);
      }
    
      let sorted = locations.sort((a, b) => {
        const distanceA = relativeHaversineDistance(a.lat, a.lng, distanceTo.lat, distanceTo.lng);
        const distanceB = relativeHaversineDistance(b.lat, b.lng, distanceTo.lat, distanceTo.lng);
    
        if (a.tid === tid) {
          return -1; // tid first
        } else if (b.tid === tid) {
          return 1; 
        } else {
          return distanceA - distanceB; 
        }
      });
    
      return sorted;
  };
    
  
  
  
    UacanadaMap.api.sortMarkers = (firstMarker,sort_by,markers) => {
      const allMarkers = (markers) ? markers : UacanadaMap.currentSortedMarkers;
      const s = sort_by ? sort_by : $('#location-sort').val()
  
      if(!firstMarker){
        const markerInMemory = UacanadaMap.api.closestMarkerLatLng()
        firstMarker = (markerInMemory) ? markerInMemory : {_latlng:{lat:allMarkers[0].lat, lng:allMarkers[0].lng}}
      }
      
      if(s==='distance') {
        return UacanadaMap.api.nearestByDistance(firstMarker, allMarkers)
      } else if(s==='latest'){
        return allMarkers.sort((a, b) => b.json.created - a.json.created);
      } else if(s==='oldest'){
        return allMarkers.sort((a, b) => a.json.created - b.json.created);
      } else if(s==='category'){ 
        // TODO : fix logic when spiderfy
        // actually only same category in same city
        var sameCatSameCity = [];
        var otherMarkers = [];
    
        for (const markerDist of allMarkers) {
          if(markerDist && firstMarker?.tid && markerDist.json.placeCategory === UacanadaMap.allPlaces[firstMarker.tid]?.json.placeCategory && markerDist.json.city === UacanadaMap.allPlaces[firstMarker.tid].json.city){
            sameCatSameCity.push(markerDist)
          } else {
            otherMarkers.push(markerDist)
          }
        }
    
        return [...sameCatSameCity, ...otherMarkers];
    
      } else if(s==='event'){
        return allMarkers.sort((a, b) => {
          var sort_criteriaA = (a.json.eventStartDate) ? Math.floor(Date.parse(a.json.eventStartDate+' '+(a.json.eventStartTime||''))/1000)+1e5 : a.json.created;
          var sort_criteriaB = (b.json.eventStartDate) ? Math.floor(Date.parse(b.json.eventStartDate+' '+(b.json.eventStartTime||''))/1000)+1e5 : b.json.created;
  
          return sort_criteriaB-sort_criteriaA;
        
        });
      }else{
       return allMarkers;
      }
  }
  
  
  
  UacanadaMap.api.openCards = async (topic_id,sort_by,autoplay) => {

    UacanadaMap.api.scrollableBottomPanel.close()

       if($('body').hasClass('addPlaceMode')){
        return  UacanadaMap.api.shakeElements([".newLocationCancelButton"],'ua-shake-vert');
       } 

      const offCanvasPanel =  $('#ua-bottom-sheet') 
      let tid = Number(topic_id)
      let thisMarker=null
      let markersTemp=null
      let s = sort_by ? sort_by : $('#location-sort').val();
  
      if(tid > 0){
        UacanadaMap.api.openMarker(tid)
        offCanvasPanel.offcanvas('hide');
        thisMarker = UacanadaMap.allPlaces[tid].marker
        if(!thisMarker) return console.log(`no marker ${tid}`)
        markersTemp = UacanadaMap.api.sortMarkers(thisMarker,'distance',null); // If open cards for certain marker - sort others only by distance
        if(s==='category') markersTemp = UacanadaMap.api.sortMarkers(thisMarker,'category',markersTemp)
        if( $('#location-sort').val()!=='distance'); $('#location-sort').val('distance');
      } else {
        markersTemp = UacanadaMap.api.sortMarkers(null,s,null)
        tid = Number(markersTemp[0].tid);
        UacanadaMap.api.openMarker(tid)
        thisMarker = UacanadaMap.allPlaces[tid].marker;
      }
      // UacanadaMap.console.log('DEBUG :: ',{ activecard:$('#ua-cards-slider li.is-active .ua-place-card-inner').attr('data-ua-tid'),topic_id,tid,s,sort_by},Number(topic_id)>0,markersTemp.length)
    
      UacanadaMap.api.openCarousel(markersTemp,autoplay)
      UacanadaMap.currentSortedMarkers = markersTemp 
      await UacanadaMap.api.animateScroll()
      UacanadaMap.api.fitElementsPosition()             
  };
  
  
  
  
  UacanadaMap.api.removeCards = async () => { 
      UacanadaMap.api.contextButtonText({text:'',delay:100,to:0})
      UacanadaMap.api.rotateCards('horizontal');
      UacanadaMap.api.animateCards('close')
      UacanadaMap.api.hideElements(false)
      UacanadaMap.api.cleanMarkers(true)
      UacanadaMap.api.animateScroll()
      UacanadaMap.api.cardsOpened(false)
      
      setTimeout(() => {
        UacanadaMap.api.fitElementsPosition();
        UacanadaMap.api.setCategory('');
        UacanadaMap.api.filterMarkers(false)
        
        $(UacanadaMap.placeCardDiv).html('')
      }, 200);
      
      
  };
  
  UacanadaMap.api.cardsOpened=(y)=>{
      
    const b = $('body')
    const c = 'cards-opened'
    if(y && !b.hasClass(c))  b.addClass(c);
    if(!y && b.hasClass(c))  b.removeClass(c);
  
    // UacanadaMap.swipers.contextButton.slideTo(1)
   // if($(window).innerWidth()<500){}
  }
  
  
  UacanadaMap.api.rotateCards = (direction) => { 
   
    if(!UacanadaMap.swipers.cardsCarousel?.changeDirection || UacanadaMap.swipers.cardsCarousel.destroyed) return
  
    const crds = $('#cardsSwiperPlaceholder')
   
   
  
    if(direction){
      UacanadaMap.swipers.cardsCarousel.changeDirection(direction)
      if(direction==='vertical') crds.addClass('verticalCards')
      else crds.removeClass('verticalCards')
    
    } else{
      if(crds.hasClass('verticalCards')){
        crds.removeClass('verticalCards')
        UacanadaMap.swipers.cardsCarousel.changeDirection('horizontal')
      
    
      }else{
        crds.addClass('verticalCards')
        UacanadaMap.swipers.cardsCarousel.changeDirection('vertical')
      
      }
    }
    
    setTimeout(() => {
      UacanadaMap.swipers.cardsCarousel.update()
    }, 1000);
    UacanadaMap.api.fitElementsPosition()
  
    
  
  
  
  }
  

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  function addClassToMarkerIcon(marker, className) {
    $('.leaflet-marker-icon').removeClass(className)
    if(!marker)return false
    const icon = marker.getIcon();
    const classNames = icon.options.className.split(' ');
  
    // Check if the class already exists
    if (!classNames.includes(className)) {
      classNames.push(className);
      icon.options.className = classNames.join(' ');
  
      // Update the marker's icon with the modified icon object
      marker.setIcon(icon);
    }
  }
  
  function removeClassFromMarkerIcon(marker, className) {
   if(!marker)return false
    
    const icon = marker.getIcon();
    const classNames = icon.options.className.split(' ');
  
    // Find the index of the class
    const index = classNames.indexOf(className);
  
    // If the class exists, remove it
    if (index !== -1) {
      classNames.splice(index, 1);
      icon.options.className = classNames.join(' ');
  
      // Update the marker's icon with the modified icon object
      marker.setIcon(icon);
    }
  }
  
  
  function handleClick(J, event, UacanadaMap) {
    const slide = $(J.clickedSlide)
    const tid = Number(slide.find('.ua-place-card-inner').attr('data-ua-tid'));
    const advId =  slide.attr('data-adv-id')
    const sameTarget = UacanadaMap.previousTid === tid

    const isCloseButton = $(event.target).hasClass('removeCards') || $(event.target.parentElement).hasClass('removeCards')
    const isEditButton = $(event.target).hasClass('edit-place') || $(event.target.parentElement).hasClass('ua-edit-link')
    if(isCloseButton || isEditButton) return
   
    if(sameTarget) {
      UacanadaMap.api.openPlaceModal(tid)
    } else if(tid){
        UacanadaMap.api.openMarker(tid)
    } else if(advId){
        UacanadaMap.api.openAdvMarker(advId,slide.attr('data-latlng-target'))
    } else {
        UacanadaMap.console.log(J, event)
    }


    UacanadaMap.console.log({sameTarget,previousTid:UacanadaMap.previousTid,tid})

}

function handleSlideChange(e, places, UacanadaMap) {
       
    const tid = places[e.activeIndex] ? places[e.activeIndex].tid : null;
    if (tid) {
        
        if(UacanadaMap.swipers.cardsCarousel.params?.direction==='vertical'){

        }else{
            UacanadaMap.api.openMarker(tid)
        }
        
        
       

    } else {
      UacanadaMap.api.pointerMarker(false)
      UacanadaMap.map.zoomOut(4)
      UacanadaMap.api.shakeElements(['#location-category-filter', '#ua-place-buttons button.active'],'accent-animation');
    }
}
  
  })
  