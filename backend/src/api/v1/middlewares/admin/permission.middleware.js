const Role = require("../../../../models/role.model");
const ApiError = require("../../../../utils/apiError");

/**
 * Factory function để tạo permission middleware
 * Dùng trong từng route cụ thể
 */
module.exports.requirePermission = function (requiredPermission) {
    return async function (req, res, next) {
        try {
            const role = res.locals.role; // Đã được gán từ requireAuth

            if (!role) {
                return next(new ApiError(403, "No role assigned"));
            }

            // role.permissions là mảng chuỗi: ['product_read', 'product_create', ...]
            const hasPermission = role.permissions.includes(requiredPermission);

            if (!hasPermission) {
                return next(new ApiError(403, `Permission denied: ${requiredPermission} required`));
            }

            next();
        } catch (error) {
            console.error("Permission middleware error:", error);
            return next(new ApiError(500, "Permission check failed"));
        }
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