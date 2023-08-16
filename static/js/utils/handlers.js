'use strict';
define('utils/handlers',['core/uacanadamap'], function(UacanadaMap) { 

   
  UacanadaMap.utils = {
    tagsParseJSON: (jsonString) => {
      try {
        let parsed = JSON.parse(jsonString);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    },
  };
  
  
  UacanadaMap.api.onMapFirstLaunch=()=>{
        setTimeout(() => {
          $('#ua-news-modal').modal('show');
        }, 12000);
      
        setTimeout(() => {
          if(!localStorage.getItem("uamaplocation"))  ctxButton({show:true,reason:'setLocation'})
        }, 21000);
      
      }
    
      UacanadaMap.api.isFloodedCall=()=>{
        if(UacanadaMap.blockFlood){   UacanadaMap.blockFloodInterval = setTimeout(() => {  UacanadaMap.blockFlood = false;  clearTimeout(UacanadaMap.blockFloodInterval); }, 1000); 
          return true;  }else{  UacanadaMap.blockFlood=true; return false; }
    };
    
    UacanadaMap.api.setClassWithFarawayZoom=(level)=>{
    
        if(level < Number(UacanadaMap.settings.zoomThreshold)){
          $('body').addClass('far-away-zoom');
        } else {
          $('body').removeClass('far-away-zoom');
        }
        
      }
    
      UacanadaMap.api.cleanUp=()=>{
        UacanadaMap.allPlaces = {};
      }
    
      UacanadaMap.api.getCatName=(slug) =>{
        const catName = UacanadaMap.subCategoryRouterObject[slug] ? UacanadaMap.subCategoryRouterObject[slug].name : slug;
        return catName
      }
    
    
      UacanadaMap.api.showNotFoundOnSummaryTab=()=>{
        $(UacanadaMap.ALL_ITEMS_DIV).html('<li style="color: #383838;background: #ffe1e1;padding: 1rem;margin-top: 1rem;"><i class="fa-solid fa-magnifying-glass-minus"></i> Nothing found, select another category or press <b style="cursor:pointer" class="show-all-places">Show All</b></li>');
      };
    
    
      UacanadaMap.api.addAtrribution=(mapDiv)=>{
        var attribution = $(mapDiv+' .leaflet-control-attribution').html();
        $('.leaflet-control-attribution').html('')
        //$(mapDiv).prepend('<div id="mapattribution"><div class="mapbox-logo"></div> <span data-bs-toggle="modal" data-bs-target="#attribution-modal"><i class="fa-solid fa-circle-info"></i></span></div>');
        $('#attribution-text').html(attribution);
      };
      
    
      UacanadaMap.api.filterByCategory=(cat)=>{
        UacanadaMap.categoryFilterTemp = $('#ua-filter-places').val();
        var matchCategory = UacanadaMap.categoryFilterTemp === cat;
        var anotherTab = $('[data-tab-link="tab-'+UacanadaMap.ALL_ITEMS_TAB_ID+'"]').hasClass('active') ? false : true;
        var isNoFilter = UacanadaMap.categoryFilterTemp ? false : true; 
      
        if(isNoFilter || anotherTab || matchCategory ){
          return true;
        } else {
          return false;
        }
      
      }
    
    
    
      UacanadaMap.api.hideBrandTitle=(needHide)=>{ 
        var titleBrand = $(".container.brand-container");
        if(needHide){
          if(titleBrand.hasClass('ua-hide-title')) return true;
          titleBrand.addClass('ua-hide-title');
         
          
          return true;
        } else {
          if(titleBrand.hasClass('ua-hide-title')){
            titleBrand.removeClass('ua-hide-title');
          } 
          return false;
        }
      };
    
    
    
    
    
    
      UacanadaMap.api.harmonizeSnippet=({text,lineslimit,maxchars})=>{
        var maxlines = lineslimit -1
        var bodyCommentFull = text.replace(/\n\s*\n/g, '\n').replace(/\r/g,'');
        var bodyComment =  bodyCommentFull.substring(0,maxchars)
        var lineSplitted = bodyComment.split('\n');
        var harmonizeText = ""
         if (maxlines > lineSplitted.length){
            return bodyComment;
        } else {
         for (var index = 0; index < maxlines; index++) {
            const p = lineSplitted[index];
            var last = index === maxlines-1;
            var suffix = (last) ?' ': '\n' ;
            harmonizeText += p.replace(/\n\s*\n/g, '').replace(/\r/g,'')  + suffix; 
          }
          return harmonizeText;
        }
      };
      UacanadaMap.api.isMainPage=()=>{ return $('body').hasClass( UacanadaMap.mapRoomClass ) };
      UacanadaMap.api.isMapExist=()=>{ return  $("#uacamap").length > 0 && $("#uacamap").hasClass('leaflet-container') };
     
    
      UacanadaMap.api.setButton=(cat,state)=>{
    
        const buttonClassList = 'btn btn-sm rounded-pill position-relative me-2'
        $('#ua-place-buttons li button').attr("aria-pressed","false").attr('class','btn-light '+buttonClassList)
        if(cat && state){
    
          let button = $('[data-cat-trigger="'+cat+'"]');
          let parentLi = button.closest('li'); 
          let index = parentLi.index();
          button.attr("aria-pressed","true").attr('class',state+' btn-primary '+buttonClassList)
          UacanadaMap.horizontalButtons.slideTo(index)
        }
      }
    
    
      
      
      UacanadaMap.api.hideBottomsAndBlockScroll=(hide)=>{
        if(hide){
           $('.bottombar').addClass('ua-bottom-bar-hide');
           $('main#panel').addClass('ua-hide-down');
           $('html').addClass('ua-noscroll');
         } 
         else {
           $('.bottombar').removeClass('ua-bottom-bar-hide');
           $('main#panel').removeClass('ua-hide-down');
           $('html').removeClass('ua-noscroll');
         }
       };
       UacanadaMap.api.closestMarkerLatLng=()=>{
        var loc_string = localStorage.getItem("uamaplocation");
        if(loc_string){
          var [lat,lng] = JSON.parse(loc_string);
          if(UacanadaMap.adminsUID) console.log(loc_string)
          return {_latlng:{lat:lat, lng:lng}} 
        }else{
          return null;
        }
      
      }
    
    
    
    
      UacanadaMap.api.isPlaceVisibleOnMap = (map,latlng) => {
        const overlayDivHeight = document.getElementById("ua-sidepanel").offsetHeight;
        const mapHeight = document.getElementById("uacamap").offsetHeight;
        const overlayRatio = overlayDivHeight / mapHeight;
      
        let boundsEdges = map.getBounds();
        boundsEdges._southWest.lat += (boundsEdges._northEast.lat - boundsEdges._southWest.lat) * overlayRatio;
      
        const [lat, lng] = latlng;
        return Number(lat) < boundsEdges._northEast.lat &&
               Number(lat) > boundsEdges._southWest.lat &&
               Number(lng) > boundsEdges._southWest.lng &&
               Number(lng) < boundsEdges._northEast.lng;
      };
      
      UacanadaMap.api.showToast=(title,body,meta)=>{
          $('#error-toast .toast-title').html(title);
          $('#error-toast .toast-body').html(body);
          $('#error-toast .toast-meta').html(meta);
          $('#error-toast').toast('show');
      }
      
    
      
    
      
    
      
      
      
      // TODO
      
      UacanadaMap.api.guideHowCreatePlace=()=>{
         
        
        
        
        
      }
      
      
      
    
    
        return UacanadaMap
    })