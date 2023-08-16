'use strict';
define('forms/regionCreator', ['core/uacanadamap'], function(UacanadaMap) { 

   
    const citiesEl = $("#ua-custom-loc-form #datalistOptions")
    const provincesEl = $("#location-province")
   
    const {geographicalEntities,citiesData} = ajaxify.data.uacmp
   
    let citiesInnerHtml = ''
    let provincesInnerHtml = ''


    try {
        citiesData.split(',').forEach((city) => { 
            citiesInnerHtml+=`<option value="${city}"></option>`
         });
        citiesEl.html(citiesInnerHtml)

	} catch (error) {
		
		console.error(error);
	}


    try {
        geographicalEntities.forEach((i) => { 
            provincesInnerHtml+=`<option value="${i.province}">${i.province} - ${i.provinceTitle}</option>`
         });
         provincesEl.html(provincesInnerHtml)

	} catch (error) {
		
		console.error(error);
	}
})