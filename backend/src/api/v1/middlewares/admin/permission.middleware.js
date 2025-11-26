const Role = require("../../../../models/role.model");

module.exports = function (requiredPermission) {
    return async function (req, res, next) {
        try {
            const role = res.locals.role;   // đã được gán từ requireAuth

            if (!role) {
                return res.status(403).send("Không có quyền truy cập");
            }

            // role.permissions là 1 mảng chuỗi: ['product_read', 'product_create', ...]
            const hasPermission = role.permissions.includes(requiredPermission);

            if (!hasPermission) {
                return res.status(403).render("admin/pages/errors/403", {
                    message: "Bạn không có quyền thực hiện hành động này!"
                });
            }

            next();
        } catch (error) {
            console.error("Permission middleware error:", error);
            return res.status(500).send("Server error");
        }
    };
};
