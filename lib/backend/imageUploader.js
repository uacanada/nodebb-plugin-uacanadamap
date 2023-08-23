'use strict';
const winston = require.main.require('winston');
const topics = require.main.require('./src/topics');
const file = require.main.require('./src/file');
const { uploadImage,resizeImage } = require.main.require('./src/image');

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.tiff', '.heic', '.bmp'];
const THUMB_WIDTH = 220
const THUMB_HEIGHT = THUMB_WIDTH
const THUMB_QUALITY = 90
const FOLDER = 'ucplaces'

module.exports = async function(req, tid) {
    if (!req.files || !req.files.image) {
        winston.warn("NO FILES: !req.files || !req.files.image");
        return;
    }

    winston.verbose("Initiating file upload process...");

    try {
        const imageFile = req.files.image;
        const fileExtension = getFileExtension(imageFile.mimetype);
        winston.verbose(`File extension: ${fileExtension}`);
        validateFileExtension(fileExtension);

        const filename = generateFilename(req, tid);
        winston.verbose(`Generated filename: ${filename}`);

        // Use uploadImage instead of saveFileToLocal
        const uploaded = await uploadImage(filename + fileExtension, FOLDER, imageFile);
        winston.verbose(`File uploaded. Path: ${uploaded.path}  ; URL: ${uploaded.url}`);

        const result = await adaptImage(filename, fileExtension, uploaded, tid);
        return result;
    } catch (error) {
        winston.warn(`Process error: ${error.message}`);
        return null
    }
};



async function adaptImage(filename, fileExtension, uploadedFile, tid) {
    winston.verbose("Adapting image...");

    const imagePath = uploadedFile.path;
    winston.verbose(`Using imagePath: ${imagePath}`);

    const thumbnailPath = generateThumbnailPath(imagePath, fileExtension);
    winston.verbose(`Generated thumbnail path: ${thumbnailPath}`);
    
    try {
        await resizeImage({  path: imagePath,  target: thumbnailPath,  width: THUMB_WIDTH,  height: THUMB_HEIGHT,  quality: THUMB_QUALITY });
        winston.verbose(`Image resized to: ${thumbnailPath}`);
        await topics.thumbs.associate({ id: tid, path: `/${FOLDER}/${filename}_thumb${fileExtension}` });
        winston.verbose(`Successfully associated thumbnail for topic id ${tid} [${filename}_thumb${fileExtension}]`);

        return {thumb: `/${FOLDER}/${filename}_thumb${fileExtension}`}
        
    } catch (error) {
        winston.warn(`Thumbnail generation error: ${error.message}`);
        await topics.thumbs.associate({ id: tid, path:`/${FOLDER}/${filename}${fileExtension}` });
        winston.verbose(`Associated original image due to thumbnail error for topic id ${tid} [${filename}${fileExtension}]`);

        return {pic:`/${FOLDER}/${filename}${fileExtension}`}
    }
}



function getFileExtension(mimetype) {
    /* NodeBB image.js already have  this... */
    const extension = file.typeToExtension(mimetype).toLowerCase();
    winston.verbose(`MIME type ${mimetype} resolved to extension: ${extension}`);
    return extension;
}

function validateFileExtension(fileExtension) {
    if (!allowedExtensions.includes(fileExtension)) {
        winston.warn(`Invalid file extension: ${fileExtension}`);
        throw new Error(`${fileExtension} File type not allowed`);
    }
}

function generateFilename(req, tid) {
    const filename = `${Math.floor(Date.now() / 1000)}u${req.uid}t${tid}`;
    winston.verbose(`Generated filename: ${filename}`);
    return filename;
}

function generateThumbnailPath(imagePath, fileExtension) {
    const thumbpath = imagePath.replace(fileExtension, `_thumb${fileExtension}`);
    winston.verbose(`Converted ${imagePath} to thumbnail path: ${thumbpath}`);
    return thumbpath;
}