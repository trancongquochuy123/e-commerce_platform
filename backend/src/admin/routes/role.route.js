const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

const controller = require('../controllers/role.controller');

/**
 * @swagger
 * /admin/roles:
 *   get:
 *     summary: Get all roles
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get("/", controller.index);

/**
 * @swagger
 * /admin/roles/create:
 *   get:
 *     summary: Get role creation form
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Creation form
 *   post:
 *     summary: Create new role
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Role created
 */
router.get("/create", controller.create);

/**
 * @swagger
 * /admin/roles/delete/{id}:
 *   delete:
 *     summary: Delete role
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role deleted
 */
router.delete("/delete/:id", controller.deleteRole);

// upload.none() cho phép multer xử lý dữ liệu dạng multipart mà không cần có file.
router.post("/create", upload.none(), controller.createRole);

/**
 * @swagger
 * /admin/roles/edit/{id}:
 *   get:
 *     summary: Get role edit form
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Edit form
 *   patch:
 *     summary: Update role
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Role updated
 */
router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",
    controller.editPatch
);

/**
 * @swagger
 * /admin/roles/detail/{id}:
 *   get:
 *     summary: Get role details
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Role details
 */
router.get("/detail/:id",
    controller.detail,
);

/**
 * @swagger
 * /admin/roles/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get("/permissions",
    controller.permissions,
);

// Cập nhật permissions
/**
 * @swagger
 * /admin/roles/permissions/update:
 *   post:
 *     summary: Update permissions
 *     tags:
 *       - Admin Roles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Permissions updated
 */
router.post('/permissions/update', controller.updatePermissions);


module.exports = router;