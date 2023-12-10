'use strict';
const inputValidator = module.exports;

inputValidator.inspectForm = (input, utils) => {


  function formatToArrayOfNumbers(str, maxLength) {
    try {
      if (maxLength && str.length > maxLength) {
        return [];
      }
      
      // Remove extra characters like [, ], ", and ' 
      str = str.replace(/[\[\]"']/g, "");
      
      // Split string by comma
      const arr = str.split(",");
      
      // Filter and map array to keep only positive numbers
      const result = arr.reduce((acc, item) => {
        const num = parseInt(item);
        // Check if it's a number and is greater than 0
        if (!isNaN(num) && num > 0) {
          acc.push(num);
        }
        return acc;
      }, []);
    
      const uniqResult = [...new Set(result)];
      return uniqResult;
    } catch (error) {
      return [];
    }
  }
  


  function checkTags(value) {
    if(!value) return []
    try {
      const tags = String(value).split(',');
      const cleanedTags = [];

      for (const tag of tags) {
        const cleanedTag = utils.cleanUpTag(tag, 25);
        cleanedTags.push(cleanedTag.toLowerCase());
      }

      const uniqueTags = [...new Set(cleanedTags)];

      return uniqueTags;
    } catch (error) {
      return [];
    }
}


  function checkString(text, maxLength) {
    try {
      if (text) {
        let cleanedText = text.replace(/[<>'`=]/g, '_');

        cleanedText = utils.rtrim(cleanedText);

        if (maxLength && cleanedText.length > maxLength) {
          cleanedText = cleanedText.slice(0, maxLength);
        }

        return cleanedText;
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }

  function checkUserName(text, maxLength) {
    try {
      if (text) {
        let cleanedText = text.replace(/[<>'`=]/g, '_');

        cleanedText = cleanedText.replace(/[@!%]/g, '');
        cleanedText = cleanedText.replace(/[\u202E,\/#!$^*;{}=`<>'"~()?|]/g, '');

        cleanedText = cleanedText.trim();

        if (maxLength && cleanedText.length > maxLength) {
          cleanedText = cleanedText.slice(0, maxLength);
        }

        return cleanedText;
      } else {
        return 'noname';
      }
    } catch (error) {
      return 'noname';
    }
  }

  function simpleString(str, maxLength) {
    try {
      if (str) {
        str = str.replace(/(https?:\/\/)?(www\.)?/gi, '');  
        str = str.replace(/,/g, ''); 
        str = str.replace(/[<>]/g, '');
        str = str.replace(/[^a-z0-9/?=.!&$#@]/gi, '');
        
    
        return str.slice(0, maxLength);;

        
      } else {
        return '';
      }
    } catch (error) {
      return '';
    }
  }

  function checkMail(mail) {
    if(!mail) return ''
    const email = checkString(mail, 80);
    if (email && utils.isEmailValid(email)) return email;
    else return 'emailnotvalid';
  }

  function checkText(text, maxLength) {
    if (text) {
      const allowedTags = ['p', 'b', 'h2', 'hr', 'br', 'code', 'pre'];
      const regex = new RegExp(`<(?!\\/?(?:${allowedTags.join('|')}))[^>]+>`, 'gi');
      let cleanedText = text.replace(regex, '');
      cleanedText = utils.rtrim(cleanedText);
      if (maxLength && cleanedText.length > maxLength) {
        cleanedText = cleanedText.slice(0, maxLength);
      }
      return cleanedText;
    } else {
      return '';
    }
  }

  function sanitizeExternalUrl(url, maxLength) {
    try {
      url = url.trim();
      url = url.replace(/^(https?:)?\/\//i, '');
      const parts = url.split('?');
      url = parts[0];
      const segments = url.split('/');
      url = segments[0];
      url = segments.map(segment => segment.replace(/[<>"]/g, '')).join('/');
      if (maxLength && url.length > maxLength) {
        url = url.slice(0, maxLength);
      }
      return url;
    } catch (error) {
      return '';
    }
  }
  
  

  function sanitizeDateString(dateString) {
    if(!dateString) return '';
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const sanitizedString = dateString.trim();
    return regex.test(sanitizedString) ? sanitizedString : '';
  }

  function sanitizeTimeString(timeString) {
    if(!timeString) return '';
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
    const sanitizedString = timeString.trim();
    return regex.test(sanitizedString) ? sanitizedString : '';
  }

  function sanitizeWeekdayString(weekdayString) {
    if(!weekdayString) return '';
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const sanitizedString = weekdayString.trim();
    return weekdays.includes(sanitizedString) ? sanitizedString : '';
  }

  function convertToPositiveNumberInRange(value,max) {
    const number = value? Number(value):0;  // parseInt(value, 10)
    if(isNaN(number)) return 0;
    const convertedNumber = Math.abs(number);
    return convertedNumber >= 1 && convertedNumber <= max ? convertedNumber : 0;
  }

  function sanitizeLatLng(value) {
    if(!value) return []
    const sanitizedValue = value.replace(/[^0-9.,\-]/g, '');
    const decimalParts = sanitizedValue.split('.');
  
    if (decimalParts.length > 1) {
      decimalParts[1] = decimalParts[1].slice(0, 52); // Adjust the precision as needed
    }
  
    let sanitizedDecimal = decimalParts.join('.');
  
    try {
      const [lat, lng] = sanitizedDecimal.split(',').map(Number);
  
      if (isValidLatitude(lat) && isValidLongitude(lng)) {
        return [lat, lng];
      }
    } catch (error) {
      return [];
    }
  
    return [];
  }
  
  function isValidLatitude(value) {
    return typeof value === 'number' && !isNaN(value) && value >= -90 && value <= 90;
  }
  
  function isValidLongitude(value) {
    return typeof value === 'number' && !isNaN(value) && value >= -180 && value <= 180;
  }
  

  const placeFields = {
    placeTitle: checkString(input.placeTitle, 200),
    placeCategory: simpleString(input.placeCategory, 33),
    categoryName:checkString(input.categoryName,100),
    city: simpleString(input.city, 50),
    province: simpleString(input.province, 10),
    streetAddress: checkString(input.streetAddress, 200),

    socialtype: simpleString(input.socialtype, 30),
    mainUsername: checkUserName(input.mainUsername, 33),
    placeExternalUrl: sanitizeExternalUrl(input.placeExternalUrl, 100),
    telegram: simpleString(input.telegram, 100),
    facebook: simpleString(input.facebook, 100),
    instagram: simpleString(input.instagram, 100),
    youtube: simpleString(input.youtube, 100),
    linkedin: simpleString(input.linkedin, 100),
    placeEmail: checkMail(input.placeEmail),
    phone: checkString(input.phone, 30),
    
    fullname: checkString(input.fullname, 200),
    placeDescription: checkText(input.placeDescription, 10000),
    placeDescriptionAlt: checkText(input.placeDescriptionAlt, 10000),
    placetags: checkTags(input.placetags),
    forcedpicture: sanitizeExternalUrl(input.forcedpicture, 200),
    classesFromAdmin: simpleString(input.classesFromAdmin, 100),
    tid: convertToPositiveNumberInRange(input.tid, 9999999), // Increase once the userbase expanse
    latlng: sanitizeLatLng(input.latlng),
    searchquery: checkString(input.searchquery, 100),
    subaddress: checkString(input.subaddress,200),
    relatedPlaces:formatToArrayOfNumbers(input.relatedPlaces,300),
    mainImage:convertToPositiveNumberInRange(input.mainImage,70)
  };

  const eventFields = {
    eventSwitcher: simpleString(input.eventSwitcher, 5),
    eventName: checkString(input.eventName, 200),
    eventCategory: simpleString(input.eventCategory, 33),
    eventStartDate: sanitizeDateString(input.eventStartDate),
    eventStartTime: sanitizeTimeString(input.eventStartTime),
    eventEndDate: sanitizeDateString(input.eventEndDate),
    eventEndTime: sanitizeTimeString(input.eventEndTime),
    eventWeekDay: sanitizeWeekdayString(input.eventWeekDay),
    eventCategoryName:checkString(input.eventCategoryName,40),
    startMonth: checkString(input.startMonth, 20),
    startDayName:sanitizeWeekdayString(input.startDayName),
    startDayDigit:convertToPositiveNumberInRange(input.startDayDigit,31),
    endMonth:checkString(input.endMonth,8),
    endDayName:sanitizeWeekdayString(input.endDayName),
    endDayDigit:convertToPositiveNumberInRange(input.endDayDigit,31),

  }

  if(input.eventCategory && input.eventStartDate){
    const fields = {...placeFields, ...eventFields};
    return fields;
  }else{
    return placeFields;
  }


  

  
};
