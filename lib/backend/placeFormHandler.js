'use strict';
const winston = require.main.require('winston');
const utils = require.main.require('./src/utils');
const meta = require.main.require('./src/meta');
const db = require.main.require('./src/database');
const file = require.main.require('./src/file');
const posts = require.main.require('./src/posts');
const topics = require.main.require('./src/topics');
const privileges = require.main.require('./src/privileges');
const { uploadImage, resizeImage } = require.main.require('./src/image');
const inputValidator = require('./inputValidator');

async function handleAddPlaceRequest(req, res, helpers) {
    const notice = {}; // For collecting notifications and errors

    try {
        const settings = await meta.settings.get('uacanadamap')

        const fields = inputValidator.inspectForm(req.body, utils);

        if (!fields.placeTitle || !req.uid) {
           
            helpers.formatApiResponse(200, res, { error: "Fields are not valid!", details: fields });


            try {
                winston.warn(JSON.stringify(req.body));

            } catch (error) {
                
            }

            try {
                winston.warn(JSON.stringify(fields));
            } catch (error) {
                winston.warn('Fields and req.body is not Objects');
            }
            winston.warn('Invalid fields or UID is missing');
            return;
        }

        const topicTags = [settings.placeTopicTag, fields.city, fields.placeCategory];
        if (fields.socialtype) topicTags.push(fields.socialtype);
        if (fields.eventWeekDay) topicTags.push(fields.eventWeekDay);
        const topicData = { title: fields.placeTitle, content: fields.placeDescription, tags: topicTags };

        let topic;
        let oldFields;

        if (fields.tid) {
            notice.edit = 'Edit post';
            const editAttempt = await editTopic(fields.tid, topicData, req.uid);
            if (editAttempt.error) {
                notice.editerr = ' - ' + editAttempt.error;
            } else {
                topic = await topics.getTopicData(fields.tid);
                oldFields = await db.getObjectField('uacanadamap:places', fields.tid);
            }

            if (!topic) {
                helpers.formatApiResponse(200, res, { error: `Can't edit topic ${fields.tid}`, notice });
                winston.error(`Failed to edit topic: ${fields.tid}`);
                return;
            }

            fields.edited = Math.floor(Date.now() / 1000);
            fields.edited_by = req.uid;
            fields.placethumb = oldFields?.placethumb;
            fields.pic = oldFields?.pic;
            fields.image = oldFields?.image;
            

        } else {
            const cid = 29; // TODO: Retrieve from environment or other source
            const topicData = { title: fields.placeTitle, content: fields.placeDescription, tags: topicTags, cid, uid: req.uid };
            topic = await topics.post(topicData);
        }

        const { tid, timestamp, slug, user } = topic.topicData ? topic.topicData : topic;



        if (req.files && req.files.image) {
   
    
            file.upload(req, 'image', '/public/uploads/', function(err, uploadedFile) {
                if (err) {
                    winston.warn(err.message);
                }

                if (uploadedFile) {
                    // Supported image extensions
                    const allowedExtensions = [
                        '.jpg', '.jpeg', '.png', '.gif', '.webp', 
                        '.tiff', '.heic', '.bmp' /*, '.svg' */
                    ];
                
                    const imageFile = uploadedFile;
                    const fileExtension = file.typeToExtension(imageFile.mimetype).toLowerCase();
                    
                    notice.reqFile = uploadedFile;
                    notice.fileExtension = fileExtension;
                
                    if (!allowedExtensions.includes(fileExtension)) {
                        notice.notAllwedExtension = `${fileExtension} File type not allowed ${imageFile.mimetype}`;
                        return; // Early exit if file type isn't supported
                    }
                
                    const filename = `${Math.floor(Date.now() / 1000)}u${req.uid}t${tid}`;

                    async function adaptImage(){
                        try {
                            const uploaded = await uploadImage(`${filename}${fileExtension}`, 'files', imageFile);
                            const url = uploaded.url;
                            const imagePath = uploaded.path;
                            const thumbnailPath = imagePath.replace(fileExtension, `_thumb${fileExtension}`);
                            
                            // Resizing the image to generate a thumbnail
                            await resizeImage({
                                path: imagePath,
                                target: thumbnailPath,
                                width: 220,
                                height: 220,
                                quality: 90
                            });
                    
                            await topics.thumbs.associate({ id: tid, path: `/files/${filename}_thumb${fileExtension}` });
                            fields.placethumb = thumbnailPath;
                            fields.pic = url;
                            fields.image = url;
                        } catch (error) {
                            if (error.message.includes("resize")) {
                                notice.thumbErr = `thumbnail error ${error.toString()}`;
                                await topics.thumbs.associate({ id: tid, path: `/files/${filename}${fileExtension}` });
                            } else {
                                notice.uploadImgErr = `IMAGE UPLOADING ERROR ${error.toString()}`;
                            }
                        }
                    }

                    adaptImage()
                }
    
                
            });
        } 

       
        

        fields.created = timestamp;
        fields.tid = tid;
        fields.uid = req.uid;
        fields.postslug = slug;

        if (user) {
            fields.author = user.displayname;
            fields.userslug = user.userslug;
        }

        await topics.setTopicFields(tid, { mapFields: fields });
        await db.setObjectField(`uacanadamap:places`, tid, fields);


        helpers.formatApiResponse(200, res, { status: "success", tid, topic, notice, fields });
    } catch (error) {

// Log the error on server-side
            winston.error('Error in handleAddPlaceRequest: ', error);

            // Send a generic error message to the client
            helpers.formatApiResponse(500, res, { 
                error: 'An unexpected error occurred. Please try again later.', 
                notice 
            });

        
    }
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

module.exports = handleAddPlaceRequest;


// const topicModifier = require('./lib/backend/topicModifier');
// 
// const routeHelpers = require.main.require('./src/routes/helpers');
// 
// const nconf = require.main.require('nconf');
// const cache = require.main.require('./src/cache');
// const plugins = require.main.require('./src/plugins');
// const user = require.main.require('./src/user');
// const categories = require.main.require('./src/categories');
