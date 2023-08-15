'use strict';
define('uacanadamap/swipeDetectors', [ 'uacanadamap'], function(UacanadaMap) { 

	const handleTabCategories = (UacanadaMap, tab, index) => {
		const { placeByTagCollector, slug, color, icon } = tab;
	
		const tagCollector = placeByTagCollector?.length > 0 ? placeByTagCollector.split(",") : [];
		tagCollector.forEach((tag) => {
			UacanadaMap.tabCollectorTags[tag] = UacanadaMap.tabCollectorTags[tag]?.length > 0
				? UacanadaMap.tabCollectorTags[tag].push(slug)
				: [slug];
		});
	
		UacanadaMap.swipers.buttonsSlider.appendSlide(UacanadaMap.swipers.createButtonSlide(tab, index));
		UacanadaMap.swipers.tabsSlider.appendSlide(UacanadaMap.swipers.createContentSlide(tab, index));
		UacanadaMap.parentCategoriesObject[slug] =  {color, icon, tagCollector}
	};
	
	
	
	
	
	const createSubCategories = () =>{
	
		
		const selectEl = $("#location-category")
		let optionsElements = ''
	
		const handleSubCategories = (category, index) => {
			try {
				const {slug,cid,cidname,parents,name,icon} = category
				const tabs = UacanadaMap.utils.tagsParseJSON(parents)
				optionsElements += `<option value="${slug}">${name}</option>`

				UacanadaMap.subCategoryRouterObject[slug] = {tabs,name,cid,icon,cidname,total:0}
			} catch (error) {
				console.error(error);
			}
		}
	
		try {
			
			ajaxify.data.uacmp.subCategories.forEach((category, index) => { handleSubCategories(category, index); });
			selectEl.html(optionsElements)
	
		} catch (error) {
			
			console.error(error);
		}
	}
	
	
	
	const createEventCategories = () => {
	
	   
		const selectEl = $("#event-location-category")
		let optionsElements = ''
	
		const handleEventCategories = (category, index) => {
				const {slug,name} = category
				optionsElements += `<option value="${slug}">${name}</option>`
		}
	
		try {
			
			ajaxify.data.uacmp.eventCategories.forEach((category, index) => { handleEventCategories(category, index); });
			selectEl.html(optionsElements)
	
		} catch (error) {
			
			console.error(error);
		}
	}
	
	
	
	
	const createTabs = () => {
		try {
			
			UacanadaMap.tabCollectorTags = {}
			ajaxify.data.uacmp.tabCategories.forEach((tab, index) => { handleTabCategories(UacanadaMap, tab, index); });
		} catch (error) {
			
			console.error(error);
		}
	}

    

	UacanadaMap.api.countFilledCategories=(cat)=>{

		if(UacanadaMap.subCategoryRouterObject[cat]?.total > 0){
			UacanadaMap.subCategoryRouterObject[cat].total = UacanadaMap.subCategoryRouterObject[cat].total+1;
		}else if(UacanadaMap.subCategoryRouterObject[cat]){
			UacanadaMap.subCategoryRouterObject[cat].total = 1;
		}else{
			console.log("no category in subCategoryRouterObject")
		}
	}



	UacanadaMap.api.createCategories = () => {
		UacanadaMap.parentCategoriesObject = {}
		UacanadaMap.subCategoryRouterObject = {}

		createTabs();
		createSubCategories();
		createEventCategories();
	}






})