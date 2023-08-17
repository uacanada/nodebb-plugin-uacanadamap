'use strict';
define('core/interactions', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 

    console.log(UacanadaMap) // TODO remove

    if(!UacanadaMap.api) return console.log('No api')

    UacanadaMap.api.getLatestLocation = () => {
    let latlng = localStorage.getItem("uamaplocation");

    try {
        latlng = latlng? JSON.parse(latlng) : UacanadaMap.defaultLatLng;
    } catch (error) {
        latlng = UacanadaMap.defaultLatLng;
    }

    const zoom = 11 // latlng ? 11 : 10;

    return { latlng, zoom };
};


UacanadaMap.latestLocation = UacanadaMap.api.getLatestLocation();

})