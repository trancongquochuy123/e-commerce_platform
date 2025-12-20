const Role = require("../../models/role.model");
const ApiError = require("../../utils/apiError");

/**
 * Factory function để tạo permission middleware
 * Dùng trong từng route cụ thể
 */
/**
 * Check permission for Admin MVC (not API)
 */
module.exports.requirePermission = function (requiredPermission) {
    return function (req, res, next) {
        const role = res.locals.role;

        if (!role) {
            req.flash("error", "Your account has no role assigned");
            return res.redirect("/admin/auth/login");
        }

        if (!role.permissions || !Array.isArray(role.permissions)) {
            req.flash("error", "Your role permissions are invalid");
            return res.redirect("/admin/auth/login");
        }

        // Admin Full Access
        if (role.title === "Super Admin" || role.title === "Admin") {
            return next();
        }

        // Check if role contains permission
        const hasPermission = role.permissions.includes(requiredPermission);

        if (!hasPermission) {
            req.flash("error", `You don't have permission: ${requiredPermission}`);
            return res.redirect("/admin/403");
        }

        next();
    };
};


/**
 * General permission checker - Kiểm tra user có bất kỳ permission nào
 * Dùng để mount vào router chính
 */
module.exports.checkRole = async (req, res, next) => {
    try {
        const role = res.locals.role;

        if (!role) {
            return next(new ApiError(403, "No role assigned to user"));
        }

        // Kiểm tra role có permissions không
        if (!role.permissions || !Array.isArray(role.permissions)) {
            return next(new ApiError(403, "Invalid role permissions"));
        }

        // Nếu có role hợp lệ → pass
        next();
    } catch (error) {
        console.error("Role check error:", error);
        return next(new ApiError(500, "Role check failed"));
    }
};

/**
 * Check if user is super admin
 */
module.exports.isSuperAdmin = async (req, res, next) => {
    try {
        const role = res.locals.role;

        if (!role) {
            return next(new ApiError(403, "No role assigned"));
        }

        if (role.title !== 'Super Admin' && role.title !== 'Admin') {
            return next(new ApiError(403, "Super Admin access required"));
        }

        next();
    } catch (error) {
        console.error("Super admin check error:", error);
        return next(new ApiError(500, "Admin check failed"));
    }
};