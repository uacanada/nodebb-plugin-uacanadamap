'use strict';
define('core/interactions', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    if(!UacanadaMap.api) return console.log('No api')

    UacanadaMap.api.getLatestLocation = () => {
        const settings = ajaxify.data.UacanadaMapSettings;
        let latlng;
    
        if (settings?.alwaysUseDefaultLocation === 'on' && settings?.initialCoordinates) {
            latlng = settings.initialCoordinates.split(',').map(coord => coord.trim());
        } else {
            const storedLocation = localStorage.getItem("uamaplocation");
    
            try {
                latlng = storedLocation ? JSON.parse(storedLocation) : settings?.initialCoordinates.split(',').map(coord => coord.trim());
            } catch (error) {
               
                latlng = ['49.282690', '-123.120861']; // Vancouver
            }
        }
    
        return { latlng };
    };
    




})