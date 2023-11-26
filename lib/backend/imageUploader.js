'use strict';
const winston = require.main.require('winston');
const topics = require.main.require('./src/topics');
const file = require.main.require('./src/file');
const { uploadImage,resizeImage } = require.main.require('./src/image');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.heic', '.bmp'];
const THUMB_WIDTH = 220
const THUMB_HEIGHT = THUMB_WIDTH
const THUMB_QUALITY = 90
const FOLDER = 'ucplaces' // TODO: create ACP entity

module.exports = async function(req, tid) {
    if (!req.files || !req.files.image) {
        winston.warn("NO FILES");
        return;
    }

    winston.verbose("Initiating file upload process...");

    const subfolder = FOLDER+'/'+tid

    try {
        const imageFile = req.files.image;
        winston.verbose('Process image: '+imageFile.name);
        const fileExtension = getFileExtension(imageFile.type);
        if(!fileExtension){
            winston.warn(`Error getting fileExtension`);
            return null
        }
        winston.verbose(`File extension: ${fileExtension}`);
        validateFileExtension(fileExtension);

        const filename = generateFilename(req, tid);
        winston.verbose(`Generated filename: ${filename}`);

        // Use uploadImage instead of saveFileToLocal
        const uploaded = await uploadImage(filename + fileExtension, subfolder, imageFile);
        winston.verbose(`File uploaded. Path: ${uploaded.path}  ; URL: ${uploaded.url}`);

        const result = await adaptImage(filename, fileExtension, uploaded, tid);
        return result;
    } catch (error) {
        winston.warn(`Process error: ${error.message}`);
        return null
    }
};



module.exports = async function(req, tid) {
    if (!req.files || !req.files.image) {
        winston.warn("NO FILES");
        console.log(req.files)
        return;
    }

    winston.verbose("Initiating file upload process...");

    const subfolder = FOLDER + tid;
    const results = [];

    for (const [index, imageFile] of req.files.image.entries()) {
        try {
            winston.verbose('Process image: ' + imageFile.name);
            const fileExtension = getFileExtension(imageFile.type);
            if (!fileExtension) {
                winston.warn(`Error getting fileExtension for ${imageFile.name}`);
                continue;
            }
            winston.verbose(`File extension for ${imageFile.name}  #${index}: ${fileExtension}`);
            validateFileExtension(fileExtension);

            const filename = generateFilename(req, tid, index);
            winston.verbose(`Generated filename for ${imageFile.name}: ${filename}`);

            const uploaded = await uploadImage(filename + fileExtension, subfolder, imageFile);
            winston.verbose(`File uploaded for ${imageFile.name}. Path: ${uploaded.path}  ; URL: ${uploaded.url}`);

            const result = await adaptImage(filename, fileExtension, uploaded, tid);
            results.push(result);
        } catch (error) {
            winston.warn(`Process error for ${imageFile.name}: ${error.message}`);
        }
    }
    return results;
};


function generateFilename(req, tid, index) {
    const filename = `${index}at${Date.now()}u${req.uid}t${tid}`;
    winston.verbose(`Generated filename: ${filename}`);
    return filename;
}


function getFileExtension(mimetype) {
    /* NodeBB image.js already have  this... */
    try {
        const extension = file.typeToExtension(mimetype).toLowerCase();
        winston.verbose(`MIME type ${mimetype} resolved to extension: ${extension}`);
        return extension;
    } catch (error) {
        winston.warn(`getFileExtension error ${error.message} \${nmimetype} :: ${extension}`);
        return null
    }
   
}

function validateFileExtension(fileExtension) {
    if (!allowedExtensions.includes(fileExtension)) {
        winston.warn(`Invalid file extension: ${fileExtension}`);
        throw new Error(`${fileExtension} File type not allowed`);
    }
}



function generateThumbnailPath(imagePath, fileExtension) {
    const thumbpath = imagePath.replace(fileExtension, `_thumb${fileExtension}`);
    winston.verbose(`Converted ${imagePath} to thumbnail path: ${thumbpath}`);
    return thumbpath;
}

async function adaptImage(filename, fileExtension, uploadedFile, tid) {
    winston.verbose("Adapting image...");

    const imagePath = uploadedFile.path;
    winston.verbose(`Using imagePath: ${imagePath}`);

    const thumbnailPath = generateThumbnailPath(imagePath, fileExtension);
    winston.verbose(`Generated thumbnail path: ${thumbnailPath}`);
    const subfolder = FOLDER+tid
    try {
        await resizeImage({  path: imagePath,  target: thumbnailPath,  width: THUMB_WIDTH,  height: THUMB_HEIGHT,  quality: THUMB_QUALITY });
        winston.verbose(`Image resized to: ${thumbnailPath}`);
        await topics.thumbs.associate({ id: tid, path: `/${subfolder}/${filename}_thumb${fileExtension}` });
        winston.verbose(`Successfully associated thumbnail for topic id ${tid} [${filename}_thumb${fileExtension}]`);

        return {thumb: `/${subfolder}/${filename}_thumb${fileExtension}`, pic:`/${subfolder}/${filename}${fileExtension}`}
        
    } catch (error) {
        winston.warn(`Thumbnail generation error: ${error.message}`);
        await topics.thumbs.associate({ id: tid, path:`/${subfolder}/${filename}${fileExtension}` });
        winston.verbose(`Associated original image due to thumbnail error for topic id ${tid} [${filename}${fileExtension}]`);

        return {pic:`/${subfolder}/${filename}${fileExtension}`}
    }
}