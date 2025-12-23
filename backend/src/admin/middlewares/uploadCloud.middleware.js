const cloudinary = require('../../../config/cloudinary');
const streamifier = require('streamifier');

const uploadSingleFile = (file, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const uploadCloudinary = (folder = 'products') => {
  return async (req, res, next) => {
    try {
      if (req.files) {
        // Handle thumbnail
        if (req.files.thumbnail && req.files.thumbnail.length > 0) {
          const thumbnailFile = req.files.thumbnail[0];
          const result = await uploadSingleFile(thumbnailFile, `${folder}/thumbnails`);
          req.body.thumbnail = result.secure_url;
        }

        // Handle multiple images
        if (req.files.images && req.files.images.length > 0) {
          const imageUploadPromises = req.files.images.map(file => uploadSingleFile(file, folder));
          const results = await Promise.all(imageUploadPromises);
          req.body.images = results.map(result => result.secure_url);
        }
      } else if (req.file) {
        // Fallback for single file upload (e.g. from other routes)
        const result = await uploadSingleFile(req.file, folder);
        req.body[req.file.fieldname] = result.secure_url;
      }
      next();
    } catch (err) {
      console.error("Upload error:", err);
      // It's better to pass the error to the next middleware
      next(err);
    }
  };
};

module.exports = { uploadCloudinary };