// TODO:The plugin.json field "library" is deprecated. Please use the package.json field "main" instead.

'use strict';
const Plugin = module.exports;


const path = require('path');
const fs = require('fs')
const multer = require('multer');
const winston = require.main.require('winston');
const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const cache = require.main.require('./src/cache');
const nconf = require.main.require('nconf');
const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');
const privileges = require.main.require('./src/privileges');
const routeHelpers = require.main.require('./src/routes/helpers');

const handleAddPlaceRequest = require('./lib/backend/placeFormHandler');
const topicModifier = require('./lib/backend/topicModifier');



// const { uploadImage, resizeImage } = require.main.require('./src/image');



// const controllers = require('./lib/backend/controllers');
// const inputValidator = require('./lib/backend/inputValidator');






/*
const utils = require.main.require('./src/utils');
const file = require.main.require('./src/file');

const winston = require.main.require('winston');
const plugins = require.main.require('./src/plugins');
const user = require.main.require('./src/user');
const categories = require.main.require('./src/categories');
*/


//const upload = multer({dest: path.join('public', 'uploads')});

//const upload = multer({dest: 'public/uploads/'});
// const upload = multer({
//     dest: path.join(nconf.get('base_dir'), 'public/uploads/')
// });




// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
// 		winston.warn('Multer destination function called\n\n\n\n\n\n');
//         const uploadPath = path.join(nconf.get('base_dir'), 'public/uploads/uaplaces');

//         // Логирование пути загрузки
//         winston.info('Upload Path: ', uploadPath);

//         // Проверка на существование директории
//         if (!fs.existsSync(uploadPath)) {
//             winston.warn('Upload directory does not exist. Trying to create...');

//             // Попытка создания директории
//             try {
//                 fs.mkdirSync(uploadPath, { recursive: true });
//                 winston.info('Upload directory created successfully.');
//             } catch (error) {
//                 winston.error('Error creating upload directory: ', error);
//                 return cb(error);
//             }
//         }

//         // Проверка прав на запись в директорию
//         fs.access(uploadPath, fs.constants.W_OK, (err) => {
//             if (err) {
//                 winston.error('No write permissions for upload directory:', err);
//                 return cb(err);
//             }

//             // Все в порядке, передаем директорию multer
//             cb(null, uploadPath);
//         });
//     },
//     filename: function(req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         const ext = path.extname(file.originalname);
        
//         const fileName = file.fieldname + '-' + uniqueSuffix + ext;
        
//         winston.info('Generated Filename: ', fileName);
//         cb(null, fileName);
//     }
// });




const upload = multer({ dest: path.join(nconf.get('base_dir'), 'public/uploads/') });



// function checkMultipartFormData(req, res, next) {
//     const contentType = req.headers['content-type'];
    
//     if (!contentType || !contentType.startsWith('multipart/form-data')) {
       
// 		winston.warn('Error: Expected multipart/form-data content type');
//     } else {
// 		winston.warn(contentType);
// 	}

//     next();
// }



function handleUploadErrors(err, req, res, next) {
	
	
    if (err instanceof multer.MulterError) {
        // Errors specific to multer
        winston.warn('Multer error (ignored): ', err);
       
    } else if (err) {
        // Other errors
        winston.error('Server error during file upload: ', err);
		winston.error('Server error req.body: '+JSON.stringify(req.body));
	}
   

	next(); // move to the next middleware
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
  
  

  





Plugin.addRoutes = async ({ router, middleware, helpers }) => {

	// upload.single('image')
	const middlewares = [upload.single('image'), middleware.ensureLoggedIn, handleUploadErrors];
	const middlewaresForAdmin =  [middleware.ensureLoggedIn,middleware.admin.checkPrivileges]

	routeHelpers.setupApiRoute(router, 'post', '/map/addplace', middlewares, async (req, res) => {
		 winston.warn(':::::::::::::: '+ req.uid+' base_dir: '+ path.join(nconf.get('base_dir'), 'public/uploads/'));
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