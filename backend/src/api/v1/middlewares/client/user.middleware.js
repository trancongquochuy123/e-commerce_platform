const User = require("../../../../models/user.model");
const ApiError = require('../../../../utils/apiError.js'); 
// Giả định bạn có lớp ApiError hoặc sử dụng hàm tiện ích cho lỗi JSON

// Hàm tiện ích chuẩn hóa lỗi API
const unauthorizedResponse = (res, message) => {
    return res.status(401).json({
        code: 401,
        success: false,
        message: message || "Truy cập bị từ chối. Vui lòng đăng nhập.",
    });
};

const forbiddenResponse = (res, message) => {
    return res.status(403).json({
        code: 403,
        success: false,
        message: message || "Tài khoản không được phép truy cập.",
    });
};


// 1. requireAuth (BẮT BUỘC Đăng nhập)
// Dùng cho các route API cần bảo vệ (ví dụ: Đặt hàng, Xem hồ sơ)
module.exports.requireAuth = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    // Không có token -> Trả về lỗi 401
    if (!tokenUser) {
        return unauthorizedResponse(res, 'Yêu cầu token xác thực. Vui lòng đăng nhập.');
    }

    try {
        const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: 'active'
        }).select("-password -__v").lean();

        // Token không hợp lệ hoặc user không tồn tại/không hoạt động
        if (!user) {
            res.clearCookie("tokenUser");
            return unauthorizedResponse(res, 'Phiên đăng nhập không hợp lệ hoặc đã hết hạn.');
        }

        // Lưu thông tin user vào request để controller sử dụng
        req.user = user;
        
        next();
    } catch (error) {
        console.error("❌ API requireAuth middleware error:", error);
        res.clearCookie("tokenUser");
        return unauthorizedResponse(res, 'Lỗi hệ thống khi xác thực.');
    }
};

// 2. infoUser (Lấy thông tin User – KHÔNG bắt buộc)
// Dùng cho các route API công khai muốn biết ai đang gọi (ví dụ: Lấy sản phẩm nhưng có thêm giỏ hàng/yêu thích cá nhân)
module.exports.infoUser = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    // Không có token -> Bỏ qua và tiếp tục
    if (!tokenUser) {
        req.user = null;
        return next();
    }

    try {
        const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: 'active'
        }).select("-password -__v").lean();

        if (user) {
            // Lưu user vào request
            req.user = user;
        } else {
            // Token không hợp lệ -> Xóa cookie và đặt req.user = null
            res.clearCookie("tokenUser");
            req.user = null;
        }
        
        next();
    } catch (error) {
        console.error("❌ API infoUser middleware error:", error);
        res.clearCookie("tokenUser");
        req.user = null;
        next(); // Tiếp tục cho dù có lỗi, vì đây là middleware không bắt buộc
    }
};

// 3. checkLoggedIn (Ngăn User Đã Đăng nhập)
// Middleware này thường ít dùng trong API REST thuần túy, 
// nhưng nếu có, nó sẽ ngăn người dùng gọi lại /login hay /register.
module.exports.checkLoggedIn = async (req, res, next) => {
    const tokenUser = req.cookies.tokenUser;

    if (!tokenUser) {
        return next(); // Chưa login -> OK
    }

    try {
        const user = await User.findOne({
            tokenUser: tokenUser,
            deleted: false,
            status: 'active'
        }).select("_id").lean(); // Chỉ cần check sự tồn tại, không cần lấy hết thông tin

        // Nếu đã login -> Trả về lỗi 403 (Forbidden)
        if (user) {
            return forbiddenResponse(res, 'Bạn đã đăng nhập rồi. Vui lòng đăng xuất để thực hiện hành động này.');
        }
        
        // Token không hợp lệ -> Xóa cookie và cho phép tiếp tục
        res.clearCookie("tokenUser");
        next();
    } catch (error) {
        console.error("❌ API checkLoggedIn middleware error:", error);
        res.clearCookie("tokenUser");
        next();
    }
};