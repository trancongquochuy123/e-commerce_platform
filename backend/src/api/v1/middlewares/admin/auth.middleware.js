const Account = require("../../../../models/account.model");
const Role = require("../../../../models/role.model");
const ApiError = require("../../../../utils/apiError");

/**
 * Require authentication middleware for API
 * Checks token from cookies or Authorization header
 */
module.exports.requireAuth = async (req, res, next) => {
    try {
        // Get token from cookies or Authorization header
        let token = req.cookies.token;
        
        // Fallback to Authorization header: "Bearer <token>"
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        if (!token) {
            return next(new ApiError(401, "Authentication required - No token provided"));
        }

        // Find user by token
        const user = await Account.findOne({ 
            token: token,
            deleted: false,
            status: 'active'
        })
            .select("-password")
            .lean();

        if (!user) {
            return next(new ApiError(401, "Invalid or expired token"));
        }

        // Get user role
        const role = await Role.findOne({ 
            _id: user.roleId,
            deleted: false,
            status: 'active'
        })
            .select("title permissions")
            .lean();

        if (!role) {
            return next(new ApiError(403, "User role not found or inactive"));
        }

        // Attach user and role to response locals and request
        res.locals.user = user;
        res.locals.role = role;
        req.user = user;
        req.role = role;

        next();

    } catch (error) {
        console.error("❌ Auth middleware error:", error);
        return next(new ApiError(500, "Authentication check failed"));
    }
};

/**
 * Optional authentication - doesn't block if no token
 * Useful for routes that work with or without auth
 */
module.exports.optionalAuth = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        
        if (!token && req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }

        // No token → continue without user
        if (!token) {
            return next();
        }

        const user = await Account.findOne({ 
            token: token,
            deleted: false,
            status: 'active'
        })
            .select("-password")
            .lean();

        if (user) {
            const role = await Role.findOne({ 
                _id: user.roleId,
                deleted: false,
                status: 'active'
            })
                .select("title permissions")
                .lean();

            if (role) {
                res.locals.user = user;
                res.locals.role = role;
                req.user = user;
                req.role = role;
            }
        }

        next();

    } catch (error) {
        console.error("⚠️ Optional auth error:", error);
        // Don't block on error, just continue
        next();
    }
};