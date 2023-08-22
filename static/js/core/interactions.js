'use strict';
define('core/interactions', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    if(!UacanadaMap.api) return console.log('No api')

    UacanadaMap.api.getLatestLocation = () => {
    let latlng = localStorage.getItem("uamaplocation");

    try {
        latlng = latlng ? JSON.parse(latlng) : ajaxify.data.UacanadaMapSettings.initialCoordinates.split(',');
    } catch (error) {
        latlng = ['49.282690', ' -123.120861']
    }

    const zoom = 11 

    return { latlng, zoom };
    };




})