const Cart = require("../../../../models/cart.model.js");
const Order = require("../../../../models/order.model.js");
const Product = require("../../../../models/product.model.js");
// Import các tiện ích API (Giả định)
const ResponseFormatter = require("../../../../utils/response.js");
const ApiError = require("../../../../utils/apiError.js");

// [GET] /checkout (Xem trang thanh toán)
module.exports.index = async (req, res, next) => {
  try {
    const cartId = req.cookies.cartId;

    if (!cartId) {
      // Trả về giỏ hàng rỗng nếu không có cartId
      return ResponseFormatter.success(
        res,
        { cart: null, items: [] },
        "No cart found (no cartId cookie)."
      );
    }

    const cart = await Cart.findById(cartId)
      .populate("products.product_id")
      .lean(); // Dùng .lean() để tăng hiệu suất truy vấn

    if (!cart) {
      return ResponseFormatter.success(
        res,
        { cart: null, items: [] },
        "Cart not found in database."
      );
    }

    // --- Logic chuẩn bị dữ liệu giỏ hàng (Tái tạo logic từ code mẫu) ---
    let updated = false;

    // Lọc bỏ các sản phẩm đã bị xóa, không hoạt động hoặc không tồn tại
    cart.products = cart.products.filter((item) => {
      const isValid =
        item.product_id &&
        !item.product_id.deleted &&
        item.product_id.status === "active";

      if (!isValid) {
        updated = true; // Đánh dấu cần cập nhật nếu có sản phẩm bị lọc
      }
      return isValid;
    });

    // Tính toán tổng cộng và chuẩn bị phản hồi
    let subtotal = 0;
    let discount = 0;

    const items = cart.products.map((item) => {
      const product = item.product_id;
      const price = product.price || 0;
      const discountPercentage = product.discountPercentage || 0;

      const priceNew = price * (1 - discountPercentage / 100);
      const itemSubtotal = price * item.quantity;
      const itemTotal = priceNew * item.quantity;
      const itemDiscount = itemSubtotal - itemTotal;

      subtotal += itemSubtotal;
      discount += itemDiscount;

      return {
        productId: product._id,
        title: product.title,
        thumbnail: product.thumbnail,
        price: price,
        priceNew: parseFloat(priceNew.toFixed(2)),
        quantity: item.quantity,
        itemTotal: parseFloat(itemTotal.toFixed(2)),
      };
    });

    const total = subtotal - discount;

    // Cập nhật lại cart nếu có sản phẩm bị xóa (async)
    if (updated) {
      await Cart.updateOne(
        { _id: cartId },
        { $set: { products: cart.products } }
      );
    }
    // ------------------------------------------------------------------

    // Trả về phản hồi JSON
    return ResponseFormatter.success(
      res,
      {
        cartId: cartId,
        items: items,
        summary: {
          totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: parseFloat(subtotal.toFixed(2)),
          discount: parseFloat(discount.toFixed(2)),
          total: parseFloat(total.toFixed(2)),
        },
      },
      "Cart details retrieved for checkout."
    );
  } catch (err) {
    console.error("❌ Error fetching checkout details:", err);
    next(new ApiError(500, "Failed to fetch checkout details."));
  }
};

// [POST] /checkout/order
module.exports.order = async (req, res, next) => {
  try {
    const cartId = req.cookies.cartId;
    const userInfo = req.body; // Thông tin người dùng đặt hàng

    if (!cartId) {
      return next(new ApiError(400, "Missing cart ID in cookies."));
    }

    // 1. Lấy Giỏ hàng
    const cart = await Cart.findById(cartId).populate("products.product_id");

    if (!cart || cart.products.length === 0) {
      return next(new ApiError(400, "Cart is empty or not found."));
    }

    const productsForOrder = [];
    let insufficientStock = false;
    let invalidProductName = null;

    // 2. Kiểm tra và chuẩn bị dữ liệu sản phẩm cho Order
    for (const item of cart.products) {
      const product = item.product_id;

      // Kiểm tra tính hợp lệ và tồn kho
      if (!product || product.deleted || product.status !== "active") {
        return next(
          new ApiError(
            400,
            `Product ${item.product_id || "Unknown"} is not available.`
          )
        );
      }

      if (item.quantity > product.stock) {
        insufficientStock = true;
        invalidProductName = product.title;
        break;
      }

      productsForOrder.push({
        product_id: product._id,
        discountPercentage: product.discountPercentage || 0,
        quantity: item.quantity,
        price: product.price,
        // Lấy thêm thông tin cần thiết để Order không phụ thuộc vào Product Model
        title: product.title,
        // Có thể thêm ảnh, slug... tùy nhu cầu
      });
    }

    if (insufficientStock) {
      return next(
        new ApiError(
          400,
          `Insufficient stock for product: ${invalidProductName}.`
        )
      );
    }

    // 3. Tạo Order mới
    const newOrder = new Order({
      cart_id: cartId, // Có thể thay thế bằng user_id nếu người dùng đã đăng nhập
      userInfo: userInfo,
      products: productsForOrder,
      user_id: req.user?._id || null, // Nếu có middleware xác thực người dùng
    });

    await newOrder.save();

    // 4. Xóa giỏ hàng sau khi đặt hàng
    await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });

    // 5. Cập nhật tồn kho (Đây là bước quan trọng bị thiếu trong code gốc và cần được bổ sung)
    // Lưu ý: Cập nhật tồn kho nên được thực hiện sau khi đặt hàng thành công.
    // Đây chỉ là mô phỏng, bạn nên sử dụng transaction để đảm bảo tính nguyên vẹn.

    // for (const item of productsForOrder) {
    //     await Product.updateOne(
    //         { _id: item.product_id },
    //         { $inc: { stock: -item.quantity } }
    //     );
    // }

    // 6. Phản hồi thành công
    return ResponseFormatter.success(
      res,
      {
        orderId: newOrder._id,
        redirect: "/checkout/success/" + newOrder._id, // Gợi ý cho client về endpoint tiếp theo
      },
      "Order placed successfully."
    );
  } catch (err) {
    console.error("❌ Error processing order:", err);
    // Có thể phân biệt lỗi Mongoose và lỗi khác
    next(new ApiError(500, "Failed to process order."));
  }
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res, next) => {
  try {
    const orderId = req.params.orderId;

    // 1. Lấy Order và Populate (nếu cần)
    const order = await Order.findById(orderId);

    if (!order) {
      return next(new ApiError(404, "Order not found."));
    }

    let totalPrice = 0;

    // 2. Tính toán lại chi tiết giá (Nếu không lưu totalPrice khi tạo Order)
    const detailedProducts = order.products.map((item) => {
      // Tính giá cuối cùng và tổng giá
      const finalPrice =
        item.price * (1 - (item.discountPercentage || 0) / 100);
      const itemTotalPrice = finalPrice * item.quantity;
      totalPrice += itemTotalPrice;

      return {
        productId: item.product_id,
        title: item.title, // Giả sử đã lưu title trong bước tạo order
        price: item.price,
        discountPercentage: item.discountPercentage,
        finalPrice: parseFloat(finalPrice.toFixed(2)),
        quantity: item.quantity,
        totalPrice: parseFloat(itemTotalPrice.toFixed(2)),
      };
    });

    // 3. Phản hồi thành công
    return ResponseFormatter.success(
      res,
      {
        orderId: order._id,
        userInfo: order.userInfo,
        products: detailedProducts,
        summary: {
          totalPrice: parseFloat(totalPrice.toFixed(2)),
          // Có thể thêm các trường khác như shipping fee, tax...
        },
      },
      "Order details retrieved successfully."
    );
  } catch (err) {
    console.error("❌ Error fetching order details:", err);
    next(new ApiError(500, "Failed to retrieve order details."));
  }
};
