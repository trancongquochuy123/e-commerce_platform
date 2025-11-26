const express = require('express');
const router = express.Router();
const multer = require('multer');
// const storageMulter = require('../../../../utils/storageMulter.js');
const { uploadCloudinary } = require('../../middlewares/admin/uploadCloud.middleware.js');

const upload = multer();

const controller = require('../../../v1/controllers/admin/product.controller.js');

const validate = require('../../validators/admin/product.validator.js');

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.patch("/change-multi/", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

// Multer
router.post('/create',
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'), 
    validate.createProduct,
    controller.createProduct
);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloudinary('products/thumbnails'),
    validate.createProduct,
    controller.editPatch
);

router.get("/detail/:id",
    controller.detail,
);


module.exports = router;