'use strict';
const path = require('path');
const fs = require('fs')

// const fsp = require('fs').promises;

const utils = require.main.require('./src/utils');
const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const cache = require.main.require('./src/cache');
const file = require.main.require('./src/file');
const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');
const privileges = require.main.require('./src/privileges');
const routeHelpers = require.main.require('./src/routes/helpers');
const { uploadImage, resizeImage } = require.main.require('./src/image');



// const controllers = require('./lib/backend/controllers');
const inputValidator = require('./lib/backend/inputValidator');
const topicModifier = require('./lib/backend/topicModifier');



/*
const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const plugins = require.main.require('./src/plugins');
const user = require.main.require('./src/user');
const categories = require.main.require('./src/categories');
*/


const multer = require('multer');

const upload = multer({dest: 'public/uploads/'});
const Plugin = module.exports;

 
let settings; 


async function getSettings(fresh){
	if(settings?.templateName && !fresh){
		return settings
	} else {
		try {
			const freshSettings = await meta.settings.get('uacanadamap')
			return freshSettings
		} catch (error) {
			return {}
		}
		
	}

}



function getTid(str) {
    const regex = /^\d+$/;

    if (regex.test(str)) {
        const num = parseInt(str, 10);
        if(num > 0){
			return num;
		};
    }
    
    return false;
}
  
  
async function editTopic(tid, topicData, uid) {
	return new Promise(async (resolve, reject) => {
	  try {
		const topic = await topics.getTopicData(tid);
		
		
		if (!topic?.mainPid) {
		  resolve({ error: 'Topic not found' });
		  return;
		}
  
		const canEdit = await privileges.posts.canEdit(topic.mainPid, uid);
		if (!canEdit) {
		  resolve({ error: 'You are not allowed to edit this post' });
		  return;
		}
  
		

		// topic.title = topicData.title;
		// topic.content = topicData.content; 
		// topic.tags = topicData.tags;

		await topics.setTopicFields(tid, topicData)
		await posts.edit({
			uid: uid,
			pid: topic.mainPid,
			content: topicData.content
		});

        resolve(topic);
	  } catch (error) {
		resolve({ error });
	  }
	});
}
  





Plugin.addRoutes = async ({ router, middleware, helpers }) => {

	const middlewares = [ middleware.ensureLoggedIn, upload.single('image')];
	const middlewaresForAdmin =  [middleware.ensureLoggedIn,middleware.admin.checkPrivileges]

    //HOW_CHECK_ADMIN_HERE? TODO

	routeHelpers.setupApiRoute(router, 'get', '/map/delete_all_places/:pincode',middlewaresForAdmin, async (req, res) => {
		
			try {
				const result = await db.delete('uacanadamap:places');
				helpers.formatApiResponse(200, res, { deleted:true, result:result  });
			} catch (error) {
				helpers.formatApiResponse(200, res, { error });
			}
		
		
	});

	routeHelpers.setupApiRoute(router, 'get', '/map/flush_settings/:pincode',middlewaresForAdmin, async (req, res) => {
	
			try {
				

				const sets = await meta.settings.get('uacanadamap')
				for (let key in sets) {
					if (sets.hasOwnProperty(key)) {
						if (Array.isArray(sets[key])) {
							// if the setting is an array, we need to delete the sorted set
							const numItems = await db.sortedSetCard(`settings:uacanadamap:sorted-list:${key}`);
							const deleteKeys = [`settings:uacanadamap:sorted-list:${key}`];
							for (let x = 0; x < numItems; x++) {
								deleteKeys.push(`settings:uacanadamap:sorted-list:${key}:${x}`);
							}
							await db.deleteAll(deleteKeys);
							await db.setRemove(`settings:uacanadamap:sorted-lists`, key);
						} else {
							// if the setting is not an array, we can just delete the field
							await db.deleteObjectField('settings:uacanadamap', key);
						}
					}
				}
				await cache.del('settings:uacanadamap');


				const updated = await meta.settings.get('uacanadamap')
				

				helpers.formatApiResponse(200, res, { sets,updated });
			} catch (error) {
				helpers.formatApiResponse(200, res, { error:error.toString() });
			}
		
		
	});



	routeHelpers.setupApiRoute(router, 'post', '/map/addplace', middlewares, async (req, res) => {
		
		let notice = {};
		let topic;
		let fields;
		let oldFields;
		settings = await getSettings(true)
		
		try {
			
			fields = inputValidator.inspectForm(req.body,utils)
			if(!fields.placeTitle || !req.uid){
				helpers.formatApiResponse(200, res, { error: "fields not valid! ", details: fields  });
			} else {
				
	              
	
				  const cid = 29;// Number(fields.category), get router from UCM_ENV.subCategories TODO !!!!!!!!!!
				  const topicTags = [settings.placeTopicTag, fields.city, fields.placeCategory]
				  if(fields.socialtype) topicTags.push(fields.socialtype)
				  if(fields.eventWeekDay) topicTags.push(fields.eventWeekDay)
				  const topicData = { title: fields.placeTitle, content: fields.placeDescription, tags: topicTags };

				 if(fields.tid){
						notice.edit = 'Edit post';
						const editAttempt = await editTopic(fields.tid, topicData, req.uid); 
						if(editAttempt.error){
							notice.editerr = ' - '+editAttempt.error
						}else{
							
							topic = await topics.getTopicData(fields.tid)
							oldFields = await db.getObjectField('uacanadamap:places', fields.tid);
							
						}

						if(!topic){
							helpers.formatApiResponse(200, res, { error: "Can't edit topic "+fields.tid, notice });
							return
						}else{


							fields.edited =  Math.floor(Date.now() / 1000)
							fields.edited_by = req.uid
							fields.placethumb = oldFields.placethumb
							fields.pic =  oldFields.pic
							fields.image =  oldFields.image
						}
					
				 } else {
					topicData.cid = cid
					topicData.uid = req.uid
					
					topic = await topics.post(topicData);
				 }

				  



				  const {tid,timestamp,slug,user} = topic.topicData ? topic.topicData : topic;
				  
				
				
				  if (req.file) {
					try {
					const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.heic'];
					const imageFile = req.file;
					const fileExtension = file.typeToExtension(imageFile.mimetype).toLowerCase();

					// TODO req.file.size

					notice.reqFile = req.file
					notice.fileExtension = fileExtension
					
					if (!allowedExtensions.includes(fileExtension)) {
					  notice.notAllwedExtension = fileExtension+' File type not allowed '+imageFile.mimetype;
					} else {

						const filename = Math.floor(Date.now() / 1000) + 'u' + req.uid + "t" +tid;
						const uploaded = await uploadImage(filename+fileExtension, 'files', imageFile);
						notice.uploaded = uploaded
						const url =  uploaded.url
						const imagePath = uploaded.path
						const placeThumbPath = url.replace(fileExtension, '_thumb' + fileExtension) // 'files/' + filename+'_thumb'+fileExtension
						notice.logDebuGImg = '||| img  '+fileExtension+' '+imageFile.mimetype+' '+imagePath+' |||'
						try {
							const thumbnailPath = imagePath.replace(fileExtension, '_thumb' + fileExtension);
							const resultResize = await resizeImage({ path: imagePath,   target: thumbnailPath,   width: 220,    height: 220,   quality: 90 });
							
							await topics.thumbs.associate({ id: tid, path: '/files/'+filename+'_thumb'+fileExtension});
							fields.placethumb = placeThumbPath
							notice.tryThumb = {imagePath,thumbnailPath,placeThumbPath, resultResize}
						} catch (error) {
							notice.thumbErr = 'thumbnail err '+error.toString()
							await topics.thumbs.associate({ id: tid, path: '/files/'+filename+fileExtension});
						}
						
						fields.pic = url
						fields.image = url
						
					}
					} catch (error) {
						notice.uploadImgErr = 'IMAGE UPLOADING ERROR '+error.toString()
					
					}
					
				  }
				  
				  fields.created = timestamp // TODO CHANGE IF NEED to x/1000
				  fields.tid = tid
				  fields.uid = req.uid
				  fields.postslug = slug

				  if(user){
					fields.author = user.displayname
					fields.userslug = user.userslug
				  }
				 
				 // try { fields.placetags = fields.placetags ? String(fields.placetags).split(',') : [];  } catch (error) {  }
				 

				  // TODO get topic fields and made some compare, like images



				  await topics.setTopicFields(tid, {mapFields:fields});
				  await db.setObjectField(`uacanadamap:places`, tid, fields);
				  helpers.formatApiResponse(200, res, { status: "success", tid,topic,notice,fields});
			}
			
		
		} catch (error) {

			let reason = error.toString(); /// TODO !!! HIDE SERVER SIDE ERRORS FROM CLIENT SIDE
			if(error.toString().includes('Duplicate entry')){ reason += 'Duplicate entry'; }
 			if(error.toString().includes('content-too-short')){ reason += 'Content too short'; }
			notice.errors = reason;
			helpers.formatApiResponse(200, res, { error: reason, topic,notice});
		}
	});


	routeHelpers.setupApiRoute(router, 'get', '/map/getplace/:tid', [], async (req, res) => {
		try {
			// const mapFields = await db.getObjectField(`topic:${req.params.tid}`, 'mapFields');
			// const place = mapFields ? mapFields.json : {};
			const tid = Number(req.params.tid);
			//const place = await topics.getTopicField(tid, 'mapFields')
			const place = await topics.getTopicField(tid, 'mapFields');
			//const customFields = req.params?.tid ? await topics.getTopicFields(req.params.tid) : {};
		    helpers.formatApiResponse(200, res, { status: "success", placeOnMap:place, tid });
		} catch (error) {
		  	helpers.formatApiResponse(500, res, { error: 'Something went wrong' });
		}
	  });


	  routeHelpers.setupApiRoute(router, 'get', '/map/getplaces/', [], async (req, res) => {
		try {
		  	const places = await db.getObject(`uacanadamap:places`);
			const placesArray =  Object.values(places)
			helpers.formatApiResponse(200, res, { status: "success", placesArray });
		} catch (error) {
		  	helpers.formatApiResponse(500, res, { error: 'Something went wrong' });
		}
	  });
};



Plugin.onTopicBuild = async (data) => {
	/* Modify topic data here: */
 
		return data;
}

Plugin.addPlaceFieldsToTopic = async (data) => {
	settings = await getSettings(false);
	data = topicModifier(data,settings)
	return data;
};







Plugin.onEachRender = async (data) => {
	try {
		
		settings = await getSettings(false);

		if(settings && settings.templateName && settings.mapTriggerClass){
			const { templateData, templateData: { template: { name } } } = data;
			templateData.bodyClass += name === settings.templateName ? ` ${settings.mapTriggerClass}` : '';
	
			data.templateData.UacanadaMapSettings = settings
			
	 
			if(templateData.mapFields){
				
			}
		}
		
		

	  
		//fs.writeFile('./DEL-DEBUG-onEachRender.json', JSON.safeStringify(data), (err) => { }); TODO
	} catch (error) {
		//fs.writeFile('./DEL-DEBUG-onEachRenderERRROR.json', error.toString(), (err) => { });
	}


  return data;
};

Plugin.modifyTemplates = async (hookData) => {
	return hookData // todo
}



Plugin.defineWidgetAreas = async (areas) => { areas = areas.concat([ { name: 'UCM Pull-Up Panel', template: 'global', location: 'ucm-pull-up-panel' } ]); return areas; };
Plugin.addAdminNavigation = (header) => { header.plugins.push({ route: '/plugins/uacanadamap', icon: 'fa-compass-drafting', name: 'UACanadaMap' }); return header;};







Plugin.activate = async (data) => {
	settings = await getSettings(true);
    const settingsExist =settings?.debuginfo?.activation; // TODO

  
  let newSettings = {  debuginfo: { activation: Math.floor(Date.now() / 1000),  } };

  if (!settingsExist) {
	try {
		const defaultSettingsPath = path.join(__dirname, 'settings', 'defaultSettings.json');
		const defaultSettings = JSON.parse(fs.readFileSync(defaultSettingsPath, 'utf8'));
		newSettings = { ...defaultSettings, debuginfo: newSettings.debuginfo };
	} catch (error) {
		newSettings.errorLog = error.toString()
	}
    
  }

  await meta.settings.set('uacanadamap', newSettings);
}



Plugin.init = async (params) => {
    const { router , middleware, controllers  } = params;
    settings = await getSettings(true);
    const customRoute = settings?.mapPageRouter || '/map'; 

    routeHelpers.setupPageRoute(router, customRoute, [(req, res, next) => {  setImmediate(next); }], (req, res) => {
		if(settings.mapTitle && settings.mapTriggerClass){
			res.render(settings.templateName, { title:settings.mapTitle, browserTitle: settings.mapTitle, uid: req.uid });
		} else {
			res.render('tos', { termsOfUse:'<h2>First You need setup plugin!</h2> Deactivate & Activate Again, then restart forum' });
		}
		
    });

	routeHelpers.setupPageRoute(router, customRoute+'/:username', [(req, res, next) => {  setImmediate(next); }], (req, res) => {
        const mapUsername = req.params?.username || 0
		const needOpenPlaceTid = getTid(mapUsername)
		const uacanadamap = { needOpenPlaceTid, mapUsername }
		res.render(settings.templateName, { title: mapUsername+" | "+settings.mapTitle, browserTitle:  mapUsername+" "+mapTitle, uid: req.uid, uacanadamap });
    });

	
	routeHelpers.setupAdminPageRoute(router,  '/admin/plugins/uacanadamap',  [(req, res, next) => {  setImmediate(next); }], (req, res) => {
		res.render('admin/plugins/uacanadamap', {title:'UACANADAMAP SETTINGS', settings}); // TODO
 	});

	
	


};