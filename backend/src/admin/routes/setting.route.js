const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const { uploadCloudinary } = require('../middlewares/uploadCloud.middleware.js');

const controller = require('../controllers/setting.controller.js');

router.get("/general", controller.generalGet);

router.post("/general", 
    upload.single('logo'), 
    uploadCloudinary('settings/general'), 
    controller.generalPost);

module.exports = router;