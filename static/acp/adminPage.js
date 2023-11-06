'use strict';
define('admin/plugins/uacanadamap', ['hooks','settings', 'uploader', 'iconSelect', 'benchpress', 'bootbox', 'categorySelector','ace/ace',  'admin/modules/instance'], function(hooks,settings, uploader, iconSelect, Benchpress, bootbox, categorySelector, ace, instance) {
		
	let ACP = {};
	let loadedSettings;
	
	ACP.init = function () {
		setupUploader();
		
		settings.load('uacanadamap', $('.uacanadamap-settings'), function (err, currentSettings) { 

			if(err||!currentSettings){
				bootbox.alert('Load default settings. Check the browser console for errors.');
				console.error(err,currentSettings)
				
			}

			loadedSettings = currentSettings

			if(Object.keys(currentSettings).length === 0){

				bootbox.confirm('The settings are empty. Click  "Confirm" to load the default settings.', function (confirm) {
					if (confirm) {
						loadSettingsFromDefault()
					}
				});

				
			}
			
			try {
				if(loadedSettings.citiesData){
					const cities = loadedSettings.citiesData.split(',')
					cities.forEach(function(tag) { $('#citiesData').tagsinput('add', tag); });
				} else {
					$('#citiesData').tagsinput('add', 'Vancouver');
				}
				
			} catch (error) {
				console.log(error)
			}
			const parentOptionsHtml = createOptionsHtml(currentSettings)
			Benchpress.registerHelper('renderParentsOptions', function() {
			 return parentOptionsHtml;
			});


			$('.ace-editor-textarea').each((i, el) => {
				const elementId = $(el).attr('id'); 
				const mode =  $(el).attr('data-ace-mode') || 'html';
				initACE(elementId + 'Editor', mode, '#' + elementId);
			});

		//	setTimeout(() => { $('form[data-sorted-list-object="subCategories"]').each((i,el)=>{ fillBrokenSubCatValues(i,el) })  }, 2000);


		    if(currentSettings.mapBoxApiKey?.length < 30){
				typingEffect(document.getElementById('msg-about-api'), document.getElementById('msg-about-api').innerHTML, 5);
			}
		    
		      

			$('#console_log').on('click', logConsoleSettings);
		});




		Benchpress.registerHelper('tagsFromString', function(input) {
			let tagsArray;
			
			// Check if input is a JSON-formatted string
			if (typeof input === 'string' && input.startsWith('[') && input.endsWith(']')) {
				try {
					tagsArray = JSON.parse(input);
				} catch (e) {
					console.error("Invalid JSON input to 'tagsFromString'. Error: ", e);
					return;
				}
			} else if (typeof input === 'string') {
				tagsArray = input.split(",");
			} else if (Array.isArray(input)) {
				tagsArray = input;
			} else {
				console.error("Invalid input to 'tagsFromString'. Expected JSON-formatted string, string or array, received: ", typeof input);
				return;
			}
			
			let tagsHtml = '';
			tagsArray.forEach(function (tag) {
				tagsHtml += '<span class="badge px-1 rounded bg-primary me-2 text-sm"> <i class="fa-solid fa-retweet me-1"></i> ' + tag + ' </span>';
			});
			
			return tagsHtml;
		});


		Benchpress.registerHelper('setParentCatOptions', function(slug,input) {
			
			let tagsArray;
			if (typeof input === 'string' && input.startsWith('[') && input.endsWith(']')) {
				try {
					tagsArray = JSON.parse(input);
				} catch (e) {
					
					return '';
				}
			} else if (typeof input === 'string') {
				tagsArray = input.split(",");
			} else if (Array.isArray(input)) {
				tagsArray = input;
			} else {
				
				return '';
			}
			
			const parentsArray = tagsArray.join();
			return parentsArray
		});
		

		
		$(document).on('click', '#exportJson', exportSettingsJson);
		$(document).on('click', '#resetSettings', resetSettings);
		$(document).on('click', '#save', saveSettings);

		// TODO add off for eventListeners

		categorySelector.init($('[component="category-selector"]'));
		
		hooks.on('action:settings.sorted-list.modal', function ({ modal }) {
			
			
			setupColorInputs(modal);
			var uuid =  modal.find('form').attr('data-sorted-list-uuid')
			var tagInputEl = modal.find('div.bootstrap-tagsinput')
		    var savedListItem = $('[data-type="sorted-list"]').find('li[data-sorted-list-uuid="'+uuid+'"]')

			

			modal.find('input[data-action="upload"]').each(function () {
				var uploadBtn = $(this);
				var savedImage = $(savedListItem).find('.markerImage').attr('src')

				console.log(`
				
				$('[data-type="sorted-list"]').find('li[data-sorted-list-uuid="${uuid}"]')

				`,{savedImage},uploadBtn.attr('data-target'))

				modal.find('#' + uploadBtn.attr('data-target')).val(savedImage);
				uploadBtn.on('click', function () {
					uploader.show({
						route: config.relative_path + '/api/admin/upload/file',
						params: {
							folder: 'uacanadamap',
						},
						accept: 'image/*',
					}, function (image) {
						modal.find('#' + uploadBtn.attr('data-target')).val(image);
					});
				});
			});

			
		

			var acpParentTabs = modal.find('select#acpParentTabsSelector')
			var dialogOpened= { tabs: modal.find('form#acpPlaceCategory').length>0, subCategories: acpParentTabs.length>0, markers:modal.find('form#advMarkers').length>0 }
			var subCategories = loadedSettings.subCategories
			var modalSlug =  $(savedListItem).attr('data-item-slug') || modal.find('#acpSubCategorySlug').val()
			var savedIconClass = $(savedListItem).find('i[data-icon-class]').attr('data-icon-class')
			var icon = savedIconClass ? savedIconClass : 'fa-icons'
			var iconButton = modal.find('#iconPickerButton')
			$(iconButton).find('i').attr('class','fa fas '+icon)
				
			iconButton.on('click', function() {
					setupIconPicker(modal);
					
				});

			if (dialogOpened.markers || dialogOpened.tabs) {
				var tagsInputField = tagInputEl.find('input[data-field-type="tagsinput"]');
				var currentTags = tagsInputField.val();
				tagsInputField.val('');
				tagInputEl.html('<div class="spinner-border" role="status"> <span class="visually-hidden">Loading...</span> </div>')
				tagInputEl.html('<input data-field-type="tagsinput" type="text" id="'+tagsInputField.attr('id')+'" name="'+tagsInputField.attr('id')+'"  placeholder="tag,tag..."/>');
				
				
				var tagsElement = tagInputEl.find('input[data-field-type="tagsinput"]')
					tagsElement.tagsinput({ tagClass: "badge bg-info", confirmKeys: [13, 44], trimValue: true});
				var recovered = currentTags ? currentTags.split(',') : [];
						recovered.forEach(function(tag) {
							tagsElement.tagsinput('add', tag);
						});



			}

			if(dialogOpened.subCategories){ 
				var category = findItemBySlug(modalSlug,subCategories)
				// ITERATE THIS MODAL AND ALSO HIDDEN FORM 
				$('form[data-sorted-list-uuid="'+uuid+'"]').each((i,el)=>{ fillBrokenSubCatValues(i,el) }) 
				
				function onCategorySelected(c){ 
					modal.find('#acpRouteCid').val(Number(c.cid)) 
					modal.find('#acpRouteCidName').val(c.name)
					
				}

				var selector = categorySelector.init(modal.find('[component="category-selector"]'),{ onSelect: onCategorySelected, privilege: 'moderate'});
				if(category && category.cid){
				selector.selectCategory(Number(category.cid));
				modal.find('[component="category-selector-selected"]').html(
					'<b>Category ID:'+category.cid+' [  '+category.cidname+' ]</b>' 
				);
					
				}	
			}
		})

		
		
	
	};


	function createOptionsHtml(loadedSettings){
		let optionsHtml = ''
		try {
			loadedSettings.tabCategories?.forEach((cat)=>{
				optionsHtml+= '<option value="'+cat.slug+'">'+cat.title+'</option>'
			})
		} catch (error) {
			optionsHtml+='ERROR'
		}
		return optionsHtml
	}
	
	async function logConsoleSettings(){
		
		const allsettings = await settings.get('uacanadamap');
		const testsettings = await settings.get('harmony-settings');


		console.log({allsettings,testsettings})
	}


	function fillBrokenSubCatValues(i,formItem) {
		   try {
				const uuid = $(formItem).attr('data-sorted-list-uuid')
				const listItem = $('div[data-sorted-list="subCategories"] li[data-sorted-list-uuid="'+uuid+'"]')
				const subcat = listItem.attr('data-item-slug')
				const parents = listItem.find('[data-parents-for="'+subcat+'"]').text().split(',')
				const selector = $(formItem).find('select#acpParentTabsSelector')
				console.log({uuid,subcat,parents})
				selector.val(parents)

				if(!parents[0]){
					bootbox.alert(`Please configure at least one parent for "${subcat}" sub-category.`);
				}

				
			} catch (error) {
				bootbox.alert('Please configure at least one parent and sub-category. See console for errors');
				console.log(error)
			}
			
		
	};
	
	function findItemBySlug(slug,data) {
		return data.find(item => item.slug === slug);
	}



	function exportSettingsJson(){
		$('#exportedJson').html(utils.escapeHTML(JSON.stringify(loadedSettings,null,6)))
		console.log(loadedSettings)
	}

	function loadSettingsFromDefault(){
			fetch("/api/v3/plugins/uacanadamap/setdefaults", { method: 'GET'})
			  	.then(response => response.json())
			  	.then(data => {
				console.log("Default settings loaded:", data);
				instance.rebuildAndRestart();
				

				 bootbox.alert({
					title: 'Settings',
					message: 'Default settings loaded, the forum will now be rebuilt with the default settings. Please, reload this page after the forum rebuilding and restarting process is complete.',
					closeButton: false,
					onEscape: false,
					buttons: {
						ok: {
							label: 'Reload Page',
							classname: 'btn-primary',
						},
					},
					callback: function () {
						ajaxify.go('/admin/plugins/uacanadamap');
					},
				});

			  })
			  .catch((error) => {
				bootbox.alert('Failed to load default settings, please check the browser console logs.');
				console.log("Error:", error);
			  });		
	}

	async function resetSettings(){
		settings.save('uacanadamap', $('<form></form>'))
		const confirmationInput = document.getElementById("resetSettingsConfirmation").value;
		if ( ["I confirm the deletion of settings",
		"I confirm the resetting and recreation of settings from defaultSettings.json",
		"I confirm the deletion of ALL settings AND ALL PLACES" ].includes(confirmationInput)) {
			bootbox.confirm('Click "Confirm" if you want to perfom this action: "'+confirmationInput+'". Caution, we recommend copying your current JSON settings as a backup copy.', async function (confirm) {
				if (confirm) {

					const config = await fetch("/api/config");
            if (!config.ok) throw new Error("Failed to fetch config for CSRF token");
            const configJson = await config.json();
			const csrfToken = configJson.csrf_token;
				fetch('/api/v3/plugins/uacanadamap/flushsettings', { method: 'POST', headers: {'Content-Type': 'application/json','x-csrf-token': csrfToken}, body: JSON.stringify({  confirmation: confirmationInput })  })
				.then(response => response.json())
			  	.then(data => {


				console.log("Try flush settings:", {data, confirmationInput});

				if(data.response){
					instance.rebuildAndRestart();
					bootbox.alert('Settings have been flushed.');
				} else {
					bootbox.alert('ERROR');
				}

				
			  })
			  .catch((error) => {
				bootbox.alert('Failed to delete settings, please check the browser console logs.');
				console.log("Error:", error);
			  });
				}
			});
			} else {
			bootbox.alert('Incorrect confirmation text for resetting settings.');
		}
		
	}
    
	

	function setupIconPicker(modal) {
		
		iconSelect.init(modal.find('#acp-ua-icon'), function(el, newIconClass) {
			$('#iconPickerButton i.fa').attr('class', 'fa fas '+newIconClass)
			modal.find('#acp-ua-icon').val(newIconClass);
		});
	}
	 
	  

	function saveSettings() {
		Promise.all([
				new Promise((resolve, reject) => {
					settings.save('uacanadamap', $('.uacanadamap-settings'), (err,s) => (!err ? resolve(s) : reject(err)));
				}),
			]).then((s) => {
				

				bootbox.confirm('Settings have been saved. Now, you need to rebuild the forum. Please confirm rebuild and restart by clicking the button below.', function (confirm) {
					if (confirm) {
						instance.rebuildAndRestart();
					}
				});


				//  bootbox.alert({
				// 	title: '',
				// 	message: '',
				// 	closeButton: false,
				// 	onEscape: false,
				// 	buttons: {
				// 		ok: {
				// 			label: '',
				// 			classname: 'btn-primary',
				// 		},
				// 	},
				// 	callback: function () {
						
				// 	},
				// });

			}).catch(error => {
				console.error(error)
				bootbox.alert('Error: ' + error.message);
			  });
		
	}

	function setupColorInputs(modal) {
		$(modal).on('change', '[data-settings="colorpicker"]', function() { updateColors(modal); });
	}
	
	function updateColors(modal) {
		$(modal).find('[data-settings="colorpicker"]').each(function() {
			var colorInput = $(this);
			var color = colorInput.val();
			var previewId = $(colorInput).attr('data-preview-target');
			var previewProp = $(colorInput).attr('data-preview-prop');
			$(modal).find('#' + previewId).css({ [previewProp]: color});
			console.log(previewId,color);
		});
	}
	

	

	function setupUploader() {
		$('#content input[data-action="upload"]').each(function () {
			var uploadBtn = $(this);
			uploadBtn.on('click', function () {
				uploader.show({
					route: config.relative_path + '/api/admin/upload/file',
					params: {
						folder: 'uacanadamap',
					},
					accept: 'image/*',
				}, function (image) {
					$('#' + uploadBtn.attr('data-target')).val(image);
				});
			});
		});
	}

	function initACE(aceElementId, mode, holder) {
		const editorEl = ace.edit(aceElementId, {
			mode: 'ace/mode/' + mode,
			theme: 'ace/theme/twilight',
			maxLines: 30,
			minLines: 10,
			fontSize: 12,
		});

		if(mode==='json'){
			try {

			let extraJson = JSON.parse(loadedSettings.customExtraSettings)
			  editorEl.setValue(JSON.stringify(extraJson, null, '\t'));
			} catch (error) {
				console.log(error)
			}
		} else {
			 editorEl.setValue($(holder).val())
		}
		
		editorEl.on('change', function () {
			app.flags = app.flags || {};
			app.flags._unsaved = true;
			$(holder).val(editorEl.getValue());
		});
	}



	function typingEffect(element, fullHtml, typingSpeed) {
		let charIndex = 0;
		let htmlBuffer = '';
		element.innerHTML = '';
		element.classList.remove('d-none');
	
		function typeChar() {
			if (charIndex < fullHtml.length) {
				// Check if current char is the start of a tag
				if (fullHtml[charIndex] === '<') {
					// Find the end of the tag
					let tagEnd = fullHtml.indexOf('>', charIndex);
					if (tagEnd !== -1) {
						// Append the tag to the buffer
						htmlBuffer += fullHtml.substring(charIndex, tagEnd + 1);
						charIndex = tagEnd;
						element.innerHTML = htmlBuffer;
					}
				} else {
					// Append any text outside of tags char by char
					htmlBuffer += fullHtml[charIndex];
					element.innerHTML = htmlBuffer;
				}
				charIndex++;
				// Wait a bit before adding the next character
				setTimeout(typeChar, typingSpeed);
			}
		}
	
		typeChar();
	}
	

	return ACP;
});