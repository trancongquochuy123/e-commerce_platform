const User = require("../../../../models/user.model.js");
const md5 = require("md5");
const ForgotPassword = require("../../../../models/forgot-password.model.js");
const Cart = require("../../../../models/cart.model.js");
const generate = require("../../../../utils/generate");
const sendMailHelper = require("../../../../utils/sendMail.js");
// Thêm lớp tiện ích API Error và Response Formatter để đồng nhất phản hồi API
// Bạn nên đảm bảo các module này tồn tại trong ứng dụng của mình.
const ApiError = require("../../../../utils/apiError.js");
const ResponseFormatter = require("../../../../utils/response.js");

// [GET] /register (Route này thường không cần thiết trong API, nhưng giữ lại để đồng bộ)
// API Endpoint thường không cần GET cho trang đăng ký.
module.exports.register = async (req, res, next) => {
  // Trong API, đây có thể là một route không được sử dụng.
  return ResponseFormatter.success(
    res,
    null,
    "API endpoint to register users."
  );
};

// [POST] /register
module.exports.registerPost = async (req, res, next) => {
  try {
    const existEmail = await User.findOne({ email: req.body.email });
    if (existEmail) {
      // Thay thế req.flash và res.render bằng phản hồi JSON
      return next(new ApiError(400, "Email đã tồn tại!"));
    }

    const { fullName, email, password } = req.body;

    // *Kiểm tra cơ bản*
    if (!fullName || !email || !password) {
      return next(
        new ApiError(
          400,
          "Vui lòng cung cấp đầy đủ thông tin (Họ tên, Email, Mật khẩu)!"
        )
      );
    }

    const hashedPassword = md5(password);
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      // tokenUser sẽ được tạo trong Mongoose Pre-save Hook hoặc trong định nghĩa Model
    });
    await newUser.save();

    // Trong API, trả về token qua JSON hoặc trong header, không phải cookie, và không redirect.
    // Tuy nhiên, để giả lập gần nhất, ta có thể trả về tokenUser

    // *Lưu ý về Cookie:* Trong môi trường API, việc đặt cookie cần cẩn thận (CORS, SameSite).
    // res.cookie("tokenUser", newUser.tokenUser, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    // });

    // Trả về phản hồi thành công
    return ResponseFormatter.success(
      res,
      {
        userId: newUser._id,
        tokenUser: newUser.tokenUser, // Cân nhắc không trả về tokenUser ra ngoài trừ khi cần
      },
      "Đăng ký tài khoản thành công! Vui lòng đăng nhập."
    );
  } catch (err) {
    console.error("❌ Error registering user:", err);
    next(new ApiError(500, "Lỗi hệ thống khi đăng ký."));
  }
};

// [GET] /login (Route này thường không cần thiết trong API)
module.exports.login = async (req, res, next) => {
  // Trong API, đây có thể là một route không được sử dụng.
  return ResponseFormatter.success(res, null, "API endpoint to log in users.");
};

// [POST] /login
module.exports.loginPost = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Tìm người dùng
    const user = await User.findOne({ email, deleted: false }).select(
      "+password"
    ); // Giả định cần select rõ ràng password

    // 2. Kiểm tra người dùng
    if (!user) {
      return next(new ApiError(401, "Email hoặc mật khẩu không hợp lệ!"));
    }

    // 3. Kiểm tra mật khẩu (Sử dụng hàm của bạn là md5)
    if (md5(password) !== user.password) {
      // Lỗi trong code cũ: if (!md5(password) === user.password) là SAI cú pháp so sánh.
      // Đã sửa thành: if (md5(password) !== user.password)
      return next(new ApiError(401, "Email hoặc mật khẩu không hợp lệ!"));
    }

    // 4. Kiểm tra trạng thái
    if (user.status !== "active") {
      return next(
        new ApiError(403, "Tài khoản chưa được kích hoạt hoặc đã bị khóa!")
      );
    }

    // 5. Xử lý Giỏ hàng (Merge giỏ hàng tạm thời với giỏ hàng của người dùng)
    const cart = await Cart.findOne({ user_id: user._id });
    const tempCartId = req.cookies.cartId;

    if (cart) {
      // Nếu người dùng đã có giỏ hàng, đặt cartId từ giỏ hàng đó
      res.cookie("cartId", cart._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    } else if (tempCartId) {
      // Nếu người dùng chưa có giỏ hàng nhưng có giỏ hàng tạm thời (cookie)
      // Cập nhật giỏ hàng tạm thời đó thành giỏ hàng của người dùng
      await Cart.updateOne({ _id: tempCartId }, { user_id: user._id });
    } else {
      // Nếu không có giỏ hàng nào (cũ và tạm thời), tạo giỏ hàng mới
      const newCart = new Cart({ user_id: user._id, products: [] });
      await newCart.save();
      res.cookie("cartId", newCart._id.toString(), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }

    // 6. Đặt token và phản hồi
    res.cookie("tokenUser", user.tokenUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return ResponseFormatter.success(
      res,
      {
        userId: user._id,
        token: user.tokenUser, // Trả lại token để Client lưu trữ nếu cần
      },
      "Đăng nhập thành công!"
    );
  } catch (err) {
    console.error("❌ Error logging in user:", err);
    next(new ApiError(500, "Lỗi hệ thống khi đăng nhập."));
  }
};

// [GET] /logout
module.exports.logout = async (req, res, next) => {
  try {
    res.clearCookie("tokenUser");
    res.clearCookie("cartId");

    return ResponseFormatter.success(res, null, "Đăng xuất thành công!");
  } catch (err) {
    console.error("❌ Error logging out user:", err);
    next(new ApiError(500, "Lỗi hệ thống khi đăng xuất."));
  }
};

// [GET] /password/forgot (Thường không cần thiết trong API)
module.exports.forgotPassword = async (req, res, next) => {
  return ResponseFormatter.success(
    res,
    null,
    "API endpoint to request password reset."
  );
};

// [POST] /password/forgot
module.exports.forgotPasswordPost = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, deleted: false });

    if (!user) {
      // Để tăng cường bảo mật, không nên cho biết email tồn tại hay không.
      // Tuy nhiên, code gốc có trả về lỗi cụ thể, nên ta giữ nguyên.
      return next(new ApiError(404, "Email không tồn tại!"));
    }

    // 1. Xóa các yêu cầu cũ và Tạo mã OTP mới
    await ForgotPassword.deleteMany({ email });

    const otp = generate.generateOTP(8);
    const forgotPasswordEntry = new ForgotPassword({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 phút
    });
    await forgotPasswordEntry.save();

    // 2. Gửi email (Giữ nguyên template HTML cho email)
    const emailTemplate = `

<!DOCTYPE html>

<html lang="vi">

<head>

    <meta charset="UTF-8">

    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <meta http-equiv="X-UA-Compatible" content="IE=edge">

    <title>Xác thực OTP</title>

</head>

<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">

    <table role="presentation" style="width: 100%; border-collapse: collapse;">

        <tr>

            <td align="center" style="padding: 40px 0;">

                <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Content -->

                    <tr>

                        <td style="padding: 40px 30px;">

                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Xin chào!</h2>

                           

                            <p style="color: #666666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">

                                Bạn hoặc ai đó đã yêu cầu lấy mã OTP cho việc xác minh tài khoản trên hệ thống.

                            </p>

                           

                            <p style="color: #333333; font-size: 16px; font-weight: bold; margin: 0 0 15px 0;">

                                Mã OTP của bạn là:

                            </p>

                           

                            <!-- OTP Box -->

                            <table role="presentation" style="margin: 0 0 25px 0;">

                                <tr>

                                    <td style="

                                        font-size: 28px;

                                        font-weight: bold;

                                        color: #2e6bff;

                                        background-color: #f2f6ff;

                                        padding: 15px 30px;

                                        border-radius: 8px;

                                        border: 2px solid #d3e3ff;

                                        letter-spacing: 4px;

                                        text-align: center;

                                    ">

                                        ${otp}

                                    </td>

                                </tr>

                            </table>

                           

                            <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0 0 25px 0;">

                                Mã OTP sẽ hết hạn sau <strong style="color: #ff4757;">5 phút</strong>. Vui lòng không chia sẻ mã này với bất kỳ ai.

                            </p>

                           

                            <!-- Divider -->

                            <div style="border-top: 1px solid #e0e0e0; margin: 25px 0;"></div>

                           

                            <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 0 0 15px 0;">

                                Nếu bạn không yêu cầu lấy OTP, vui lòng bỏ qua email này.

                            </p>

                           

                            <p style="color: #666666; font-size: 15px; line-height: 1.6; margin: 0;">

                                Trân trọng,<br/>

                                <strong>Đội ngũ hỗ trợ hệ thống</strong>

                            </p>

                        </td>

                    </tr>

                   

                    <!-- Footer -->

                    <tr>

                        <td style="background-color: #f8f9fa; padding: 20px 30px; border-radius: 0 0 8px 8px;">

                            <p style="color: #999999; font-size: 12px; line-height: 1.5; margin: 0; text-align: center;">

                                Email này được gửi tự động, vui lòng không trả lời.

                            </p>

                        </td>

                    </tr>

                </table>

            </td>

        </tr>

    </table>

</body>

</html>

        `; // Cắt ngắn template
    await sendMailHelper.sendEmail(
      email,
      "🔐 Xác thực OTP - Không chia sẻ mã này",
      emailTemplate
    );

    // 3. Phản hồi thành công
    // Thay vì redirect, trả về thông báo và yêu cầu client chuyển sang bước OTP
    return ResponseFormatter.success(
      res,
      {
        email: email,
        nextStep: "/user/password/otp",
      },
      "Mã OTP đã được gửi đến email của bạn."
    );
  } catch (err) {
    console.error("❌ Error handling forgot password form submission:", err);
    next(new ApiError(500, "Lỗi hệ thống khi xử lý quên mật khẩu."));
  }
};

// [GET] /password/otp (Thường không cần thiết trong API)
module.exports.otpPassword = async (req, res, next) => {
  return ResponseFormatter.success(
    res,
    { email: req.query.email || "" },
    "API endpoint to verify OTP."
  );
};

// [POST] /password/otp
module.exports.otpPasswordPost = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new ApiError(400, "Email và OTP là bắt buộc!"));
    }

    // 1. Tìm OTP hợp lệ (chưa hết hạn)
    const otpEntry = await ForgotPassword.findOne({
      email,
      otp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpEntry) {
      return next(new ApiError(400, "Mã OTP không hợp lệ hoặc đã hết hạn!"));
    }

    // 2. Xoá OTP sau khi dùng
    await ForgotPassword.deleteOne({ _id: otpEntry._id });

    // 3. Tìm người dùng và cấp token tạm thời (cho bước reset password)
    const user = await User.findOne({ email, deleted: false });
    if (!user) {
      return next(new ApiError(404, "Người dùng không tồn tại!"));
    }

    // Đặt token cho người dùng (Giả định tokenUser là một session token)
    res.cookie("tokenUser", user.tokenUser, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000, // 10 phút, đủ cho việc reset
    });

    // 4. Phản hồi thành công
    return ResponseFormatter.success(
      res,
      {
        email,
        nextStep: "/user/password/reset",
      },
      "Xác thực OTP thành công. Chuyển sang bước đặt lại mật khẩu."
    );
  } catch (err) {
    console.error("❌ Error verifying OTP:", err);
    next(new ApiError(500, "Lỗi hệ thống khi xác thực OTP."));
  }
};

// [GET] /password/reset (Thường không cần thiết trong API)
module.exports.resetPassword = async (req, res, next) => {
  return ResponseFormatter.success(
    res,
    { email: req.query.email || "" },
    "API endpoint to reset password."
  );
};

// [POST] /password/reset
module.exports.resetPasswordPost = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const tokenUser = req.cookies.tokenUser;

    if (!tokenUser) {
      return next(
        new ApiError(
          401,
          "Không có token xác thực. Vui lòng thử lại quy trình Quên mật khẩu."
        )
      );
    }

    if (newPassword !== confirmPassword) {
      return next(
        new ApiError(400, "Mật khẩu mới và mật khẩu xác nhận không khớp!")
      );
    }

    const hashedPassword = md5(newPassword);

    // Cập nhật mật khẩu bằng tokenUser (đã được đặt ở bước OTP)
    const result = await User.updateOne(
      { tokenUser, email, deleted: false }, // Thêm email để kiểm tra kỹ hơn
      { $set: { password: hashedPassword } }
    );

    if (result.matchedCount === 0) {
      return next(
        new ApiError(
          404,
          "Không tìm thấy người dùng hợp lệ hoặc token đã hết hạn."
        )
      );
    }

    // Xóa tokenUser tạm thời sau khi reset
    res.clearCookie("tokenUser");

    return ResponseFormatter.success(
      res,
      null,
      "Đặt lại mật khẩu thành công! Vui lòng đăng nhập."
    );
  } catch (err) {
    console.error("❌ Error resetting password:", err);
    next(new ApiError(500, "Lỗi hệ thống khi đặt lại mật khẩu."));
  }
};

// [GET] /info
module.exports.info = async (req, res, next) => {
  try {
    // Giả định req.user được gán từ middleware xác thực tokenUser
    if (!req.user) {
      return next(
        new ApiError(401, "Truy cập bị từ chối. Vui lòng đăng nhập.")
      );
    }

    const user = await User.findOne({
      _id: req.user._id,
      deleted: false,
    }).select("-password -tokenUser -deleted -__v");

    if (!user) {
      return next(new ApiError(404, "Người dùng không tồn tại."));
    }

    return ResponseFormatter.success(
      res,
      { user },
      "Lấy thông tin người dùng thành công."
    );
  } catch (err) {
    console.error("❌ Error getting user info:", err);
    next(new ApiError(500, "Lỗi hệ thống khi lấy thông tin người dùng."));
  }
};

// [POST] /info
module.exports.infoPost = async (req, res, next) => {
  try {
    // Giả định req.user được gán từ middleware xác thực tokenUser
    if (!req.user) {
      return next(
        new ApiError(401, "Truy cập bị từ chối. Vui lòng đăng nhập.")
      );
    }

    const { fullName, email, phone } = req.body;

    // Kiểm tra xem email mới đã tồn tại chưa (nếu email được cập nhật)
    if (email && email !== req.user.email) {
      const existEmail = await User.findOne({ email });
      if (existEmail) {
        return next(new ApiError(400, "Email mới đã tồn tại trong hệ thống!"));
      }
    }

    const updateData = { fullName, email, phone };

    await User.updateOne(
      { _id: req.user._id, deleted: false },
      { $set: updateData }
    );

    return ResponseFormatter.success(
      res,
      {
        userId: req.user._id,
        updatedFields: updateData,
      },
      "Cập nhật thông tin thành công!"
    );
  } catch (err) {
    console.error("❌ Error updating user info:", err);
    next(new ApiError(500, "Lỗi hệ thống khi cập nhật thông tin."));
  }
};
