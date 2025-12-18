// Ví dụ: src/middlewares/auth.middleware.js

const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const systemConfig = require("../../../config/system");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }

    try {
        const user = await Account.findOne({ token: req.cookies.token })
            .select("-password")
            .lean();

        if (!user) {
            return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
        }

        const role = await Role.findOne({ _id: user.roleId })
            // KHẮC PHỤC LỖI: Thay thế "code" bằng "key" (trường mã quyền trong model Permission)
            .populate("permissions", "key") 
            .lean();

        let permissionCodes = [];

        if (role?.permissions?.length) {
            // KHẮC PHỤC LỖI: Thay thế item.code bằng item.key
            permissionCodes = role.permissions.map(item => item.key);
        }

        res.locals.user = user;
        res.locals.role = {
            ...role,
            permissions: permissionCodes
        };
        console.log("User:", user); 
        console.log("Role:", res.locals.role);

        next();
    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    }
};