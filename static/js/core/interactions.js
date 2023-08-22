'use strict';
define('core/interactions', ["core/variables" /*   Global object UacanadaMap  */], function(UacanadaMap) { 
    if(!UacanadaMap.api) return console.log('No api')

    UacanadaMap.api.getLatestLocation = () => {
        const settings = ajaxify.data.UacanadaMapSettings;
        let latlng;
        
        const parseCoordinates = (coordinatesStr) => {
            return coordinatesStr.split(',').map(coord => parseFloat(coord.trim()));
        };
    
        if (settings?.alwaysUseDefaultLocation === 'on' && settings?.initialCoordinates) {
            latlng = parseCoordinates(settings.initialCoordinates);
        } else {
            const storedLocation = localStorage.getItem("uamaplocation");
        
            try {
                latlng = storedLocation ? JSON.parse(storedLocation) : (settings?.initialCoordinates ? parseCoordinates(settings.initialCoordinates) : null);
                if(!Array.isArray(latlng) || latlng.length !== 2) {
                    throw new Error("Invalid location format");
                }
            } catch (error) {
                latlng = [49.282690, -123.120861]; // Vancouver
            }
        }
        
        return { latlng };
    };
    
    




})