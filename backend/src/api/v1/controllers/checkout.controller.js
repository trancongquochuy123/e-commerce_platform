const Cart = require("../../../models/cart.model.js");
const Order = require("../../../models/order.model.js");
const Product = require("../../../models/product.model.js");
// Import các tiện ích API (Giả định)
const ResponseFormatter = require("../../../utils/response.js");
const ApiError = require("../../../utils/apiError.js");

// ========== STRIPE INTEGRATION ==========
// Initialize Stripe with test mode keys
const stripe = require("stripe")(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder"
);
// NOTE: Set STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY in your .env file

// Helper: decrement product stock after successful payment
async function decrementProductStock(products) {
  // products: [{ product_id, quantity }]
  if (!products || !products.length) return;

  const ops = products.map((item) => ({
    updateOne: {
      filter: { _id: item.product_id },
      update: { $inc: { stock: -Math.abs(item.quantity || 0) } },
    },
  }));

  await Product.bulkWrite(ops);
}

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

module.exports.getOrder = async (req, res, next) => {
  try {
    console.log("lkaskhdkajshdjkashdsjd", req.user)
    const userId = req.user ? req.user._id : req.user.id; // Lấy userId từ req.user nếu đã đăng nhập

    if (!userId) {
      return next(new ApiError(401, "Please log in to view your orders."));
    }

    const {
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { user_id: userId, status: { $nin: ["delivered", "cancelled"] } }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp đơn hàng mới nhất lên đầu
      .populate("products.product_id", "title thumbnail slug") // Lấy thông tin sản phẩm
      .skip(skip)
      .limit(parseInt(limit))
      .lean();


    if (!orders || orders.length === 0) {
      return ResponseFormatter.success(res, { orders: [] }, "No orders found for this user.");
    }

    const formattedOrders = orders.map(order => {
      let totalOrderPrice = 0;
      const products = order.products.map(item => {
        const productInfo = item.product_id;
        const finalPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
        const itemTotalPrice = finalPrice * item.quantity;
        totalOrderPrice += itemTotalPrice;

        return {
          productId: productInfo ? productInfo._id : null,
          title: productInfo ? productInfo.title : "Unknown Product",
          thumbnail: productInfo ? productInfo.thumbnail : null,
          slug: productInfo ? productInfo.slug : null,
          price: item.price,
          discountPercentage: item.discountPercentage,
          finalPrice: parseFloat(finalPrice.toFixed(2)),
          quantity: item.quantity,
          itemTotalPrice: parseFloat(itemTotalPrice.toFixed(2)),
        };
      });

      return {
        _id: order._id,
        userInfo: order.userInfo,
        products: products,
        method: order.method,
        status: order.status,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        totalOrderPrice: parseFloat(totalOrderPrice.toFixed(2)),
      };
    });

    const totalOrders = await Order.countDocuments(filter);

    // Pagination metadata
    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / parseInt(limit)),
      totalItems: totalOrders,
      limit: parseInt(limit),
    };

    return ResponseFormatter.success(
      res,
      {
        orders: formattedOrders,
        pagination
      },
      "Orders retrieved successfully."
    );
  } catch (err) {
    console.error("❌ Error retrive orders:", err);
    next(new ApiError(500, "Failed to retrive orders."));
  }
}

module.exports.getBought = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null; // Lấy userId từ req.user nếu đã đăng nhập

    if (!userId) {
      return next(new ApiError(401, "Please log in to view your orders."));
    }

    const {
      page = 1,
      limit = 10,
    } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = { user_id: userId, status: "delivered" }

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 }) // Sắp xếp đơn hàng mới nhất lên đầu
      .populate("products.product_id", "title thumbnail slug") // Lấy thông tin sản phẩm
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    if (!orders || orders.length === 0) {
      return ResponseFormatter.success(res, { orders: [] }, "No orders found for this user.");
    }

    const formattedOrders = orders.map(order => {
      let totalOrderPrice = 0;
      const products = order.products.map(item => {
        const productInfo = item.product_id;
        const finalPrice = item.price * (1 - (item.discountPercentage || 0) / 100);
        const itemTotalPrice = finalPrice * item.quantity;
        totalOrderPrice += itemTotalPrice;

        return {
          productId: productInfo ? productInfo._id : null,
          title: productInfo ? productInfo.title : "Unknown Product",
          thumbnail: productInfo ? productInfo.thumbnail : null,
          slug: productInfo ? productInfo.slug : null,
          price: item.price,
          discountPercentage: item.discountPercentage,
          finalPrice: parseFloat(finalPrice.toFixed(2)),
          quantity: item.quantity,
          itemTotalPrice: parseFloat(itemTotalPrice.toFixed(2)),
        };
      });

      return {
        _id: order._id,
        userInfo: order.userInfo,
        products: products,
        method: order.method,
        status: order.status,
        isPaid: order.isPaid,
        paidAt: order.paidAt,
        createdAt: order.createdAt,
        totalOrderPrice: parseFloat(totalOrderPrice.toFixed(2)),
      };
    });

    const totalOrders = await Order.countDocuments(filter);

    // Pagination metadata
    const pagination = {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / parseInt(limit)),
      totalItems: totalOrders,
      limit: parseInt(limit),
    };

    return ResponseFormatter.success(
      res,
      { orders: formattedOrders, pagination },
      "Products bought retrieved successfully."
    );
  } catch (err) {
    console.error("❌ Error retrive products bought:", err);
    next(new ApiError(500, "Failed to retrive products bought."));
  }
}
// [POST] /checkout/order
// Handles order creation with optional Stripe payment
// If paymentMethod='stripe': creates PaymentIntent and requires clientSecret confirmation
// If paymentMethod='cod': creates order immediately
module.exports.order = async (req, res, next) => {
  try {
    const cartId = req.cookies.cartId;
    const { userInfo, paymentMethod = "cod", paymentMethodId } = req.body;

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
    let totalAmount = 0; // Track total for Stripe

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

      // Calculate discounted price and item total
      const discountedPrice =
        product.price * (1 - (product.discountPercentage || 0) / 100);
      const itemTotal = discountedPrice * item.quantity;
      totalAmount += itemTotal;

      productsForOrder.push({
        product_id: product._id,
        discountPercentage: product.discountPercentage || 0,
        quantity: item.quantity,
        price: product.price,
        title: product.title,
        sellerId: product.accountId, // Store seller reference for Stripe split
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

    // ========== STRIPE PAYMENT INTEGRATION ==========
    let stripePaymentIntentId = null;
    let clientSecret = null;

    if (paymentMethod === "stripe") {
      try {
        // Convert amount to cents for Stripe
        const amountInCents = Math.round(totalAmount * 100);

        // Create Stripe PaymentIntent
        // NOTE: For Stripe Connect, we'll keep payment with platform account
        // and use automatic transfers to seller accounts
        const paymentIntent = await stripe.paymentIntents.create({
          amount: amountInCents,
          currency: "usd",
          payment_method_types: ["card"],
          // Metadata to link order to Stripe
          metadata: {
            cartId: cartId.toString(),
            userEmail: userInfo.email || "guest@customer.com",
          },
          // For Stripe Connect: automatic transfer to seller (will implement with charges)
          // transfer_group: `order_${new Date().getTime()}`,
        });

        stripePaymentIntentId = paymentIntent.id;
        clientSecret = paymentIntent.client_secret;

        console.log(
          `✅ Stripe PaymentIntent created: ${stripePaymentIntentId}`
        );
      } catch (stripeError) {
        console.error("❌ Stripe PaymentIntent creation failed:", stripeError);
        return next(
          new ApiError(500, `Payment processing failed: ${stripeError.message}`)
        );
      }
    }

    // 3. Tạo Order mới
    const newOrder = new Order({
      cart_id: cartId,
      userInfo: userInfo,
      products: productsForOrder,
      user_id: req.user?._id || null,
      method: paymentMethod,
      stripePaymentIntentId: stripePaymentIntentId,
      isPaid: paymentMethod === "cod", // COD is immediately "paid" (will be settled in person)
      // isPaid remains false for Stripe until confirmed
    });

    await newOrder.save();

    // 4. Giảm tồn kho ngay khi thanh toán thành công (COD)
    if (paymentMethod === "cod") {
      await decrementProductStock(productsForOrder);
      newOrder.paidAt = new Date();
      newOrder.status = "delivered"
      await newOrder.save();
    }

    // 5. Xóa giỏ hàng sau khi đặt hàng
    await Cart.updateOne({ _id: cartId }, { $set: { products: [] } });

    // 6. Prepare response based on payment method
    const responseData = {
      orderId: newOrder._id,
      paymentMethod: paymentMethod,
    };

    if (paymentMethod === "stripe" && clientSecret) {
      // For Stripe orders: return clientSecret for frontend payment confirmation
      responseData.clientSecret = clientSecret;
      responseData.message =
        "PaymentIntent created. Complete payment on frontend.";
    } else {
      // For COD: immediately redirect to success page
      responseData.redirect = "/checkout/success/" + newOrder._id;
      responseData.message = "Order placed successfully (COD).";
    }

    return ResponseFormatter.success(res, responseData, responseData.message);
  } catch (err) {
    console.error("❌ Error processing order:", err);
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
        paymentMethod: order.method,
        isPaid: order.isPaid,
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

// ========== STRIPE PAYMENT CONFIRMATION ==========

// [POST] /checkout/confirm-payment
// Frontend calls this AFTER user confirms payment with Stripe
// to verify PaymentIntent status and mark order as paid
module.exports.confirmPayment = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return next(new ApiError(400, "Missing orderId in request."));
    }

    // 1. Find order
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new ApiError(404, "Order not found."));
    }

    // Already paid (idempotent): return success without altering stock again
    if (order.isPaid) {
      return ResponseFormatter.success(
        res,
        {
          orderId: order._id,
          isPaid: true,
          redirect: `/checkout/success/${orderId}`,
          message: "Payment already confirmed.",
        },
        "Payment already confirmed."
      );
    }

    if (!order.stripePaymentIntentId) {
      return next(new ApiError(400, "Order does not have Stripe payment."));
    }

    // 2. Check PaymentIntent status from Stripe
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        order.stripePaymentIntentId
      );

      // 3. If payment succeeded, mark order as paid
      if (paymentIntent.status === "succeeded") {
        // Decrement stock for all products in the order
        await decrementProductStock(order.products);

        order.isPaid = true;
        order.paidAt = new Date();
        await order.save();

        console.log(
          `✅ Order ${orderId} marked as paid. PaymentIntent: ${paymentIntent.id}`
        );

        // ========== STRIPE CONNECT: TRANSFER TO SELLER ==========
        // For each product, transfer 90% to seller, keep 10% platform fee
        // This happens AFTER payment is confirmed
        try {
          for (const product of order.products) {
            const discountedPrice =
              product.price * (1 - (product.discountPercentage || 0) / 100);
            const itemTotal = Math.round(
              discountedPrice * product.quantity * 100
            ); // Convert to cents
            const sellerAmount = Math.round(itemTotal * 0.9); // 90% to seller

            // TODO: Create Transfer to seller's Stripe Connected Account
            // This requires seller's Stripe account ID (stripeAccountId) in Account model
            // For now, logging the calculation
            console.log(
              `📤 Transfer pending - Product ${product.product_id}: ${sellerAmount} cents to seller ${product.sellerId}`
            );

            // IMPLEMENTATION FOR PRODUCTION:
            // await stripe.transfers.create({
            //   amount: sellerAmount,
            //   currency: 'usd',
            //   destination: seller.stripeAccountId, // Requires Account.stripeAccountId field
            //   transfer_group: `order_${orderId}`,
            //   metadata: { orderId: orderId.toString(), productId: product.product_id.toString() }
            // });
          }
        } catch (transferError) {
          console.error(
            "⚠️  Transfer to seller failed (non-critical):",
            transferError.message
          );
          // Continue - payment is confirmed even if transfer fails
          // In production, you'd retry this separately
        }

        return ResponseFormatter.success(
          res,
          {
            orderId: order._id,
            isPaid: true,
            redirect: `/checkout/success/${orderId}`,
            message: "Payment confirmed successfully.",
          },
          "Payment confirmed successfully."
        );
      } else if (paymentIntent.status === "requires_action") {
        return next(new ApiError(402, "Payment requires additional action."));
      } else {
        return next(
          new ApiError(402, `Payment failed. Status: ${paymentIntent.status}`)
        );
      }
    } catch (stripeError) {
      console.error(
        "❌ Stripe PaymentIntent verification failed:",
        stripeError
      );
      return next(
        new ApiError(500, `Failed to verify payment: ${stripeError.message}`)
      );
    }
  } catch (err) {
    console.error("❌ Error confirming payment:", err);
    next(new ApiError(500, "Failed to confirm payment."));
  }
};
