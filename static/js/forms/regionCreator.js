'use strict';
define('forms/regionCreator', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
   UacanadaMap.form.createGeoEntities = () => {
        const citiesEl = $("#placeForm #datalistOptions")
        const provincesEl = $("#location-province")
        const {geographicalEntities,citiesData} = ajaxify.data.UacanadaMapSettings;
        let citiesInnerHtml = ''
        let provincesInnerHtml = ''
        try {
            citiesData.split(',').forEach((city) => { 
                citiesInnerHtml+=`<option value="${city}"></option>`
            });
            citiesEl.html(citiesInnerHtml)

        } catch (error) {
            
            UacanadaMap.console.error(error);
        }
        try {
            geographicalEntities.forEach((i) => { 
                provincesInnerHtml+=`<option value="${i.province}">${i.province} - ${i.provinceTitle}</option>`
            });
            provincesEl.html(provincesInnerHtml)

        } catch (error) {
            
            UacanadaMap.console.error(error);
        }
    }
})