'use strict';
const Plugin = module.exports;


const path = require('path');
const fs = require('fs')

// const fsp = require('fs').promises;


const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const cache = require.main.require('./src/cache');

const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');
const privileges = require.main.require('./src/privileges');
const routeHelpers = require.main.require('./src/routes/helpers');
// const { uploadImage, resizeImage } = require.main.require('./src/image');



// const controllers = require('./lib/backend/controllers');
// const inputValidator = require('./lib/backend/inputValidator');
const topicModifier = require('./lib/backend/topicModifier');

const winston = require.main.require('winston');



/*
const utils = require.main.require('./src/utils');
const file = require.main.require('./src/file');
const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const plugins = require.main.require('./src/plugins');
const user = require.main.require('./src/user');
const categories = require.main.require('./src/categories');
*/

const handleAddPlaceRequest = require('./lib/backend/placeFormHandler');
const multer = require('multer');
//const upload = multer({dest: path.join('public', 'uploads')});

const upload = multer({dest: 'public/uploads/'});




function handleUploadErrors(err, req, res, next) {
    if (err instanceof multer.MulterError) {
        // Errors specific to multer
        winston.warn('Multer error (ignored): ', err);
        next(); // move to the next middleware
    } else if (err) {
        // Other errors
        winston.error('Server error during file upload: ', err);
		winston.error('Server error req.body: '+JSON.stringify(req.body));
        return res.status(500).json({ error: 'Server error during file upload.' });
    } else {
        next(); // move to the next middleware if no error
    }
}


function debugPostForm(err, req, res, next)  {
	try {
		winston.warn('Headers: ', req.headers);
		winston.warn('Body: ', req.body);
		winston.warn('File: ', req.file);
	} catch (error) {
		winston.warn('debugPostForm: ', error);
	}

	next();
}


 
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

	const middlewares = [middleware.ensureLoggedIn, upload.single('image'), handleUploadErrors];
	const middlewaresForAdmin =  [middleware.ensureLoggedIn,middleware.admin.checkPrivileges]

	routeHelpers.setupApiRoute(router, 'post', '/map/addplace', middlewares, async (req, res) => {
		winston.warn(':::::::::::::::req.uid: ', req.uid);
		 await handleAddPlaceRequest(req, res, helpers); 
	});

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