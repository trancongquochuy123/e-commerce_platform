const Order = require("../../models/order.model");
const User = require("../../models/user.model");
const Product = require("../../models/product.model");
const systemConfig = require("../../../config/system");

const filterStatusHelper = require("../../utils/filterStatus");
const searchHelper = require("../../utils/search");
const paginationHelper = require("../../utils/pagination");

// [GET] /orders
module.exports.index = async (req, res) => {
    try {
        const filterStatus = filterStatusHelper(req.query);

        let findOrders = {
            deleted: false,
        };

        if (req.query.status) {
            findOrders.status = req.query.status;
        }

        const objectSearch = searchHelper(req.query);

        if (objectSearch.regex) {
            findOrders["userInfo.fullName"] = objectSearch.regex;
        }

        // Pagination
        const countOrders = await Order.countDocuments(findOrders);

        const objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItem: 10,
            },
            req.query,
            countOrders
        );

        // Sort 
        let sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            const { sortKey, sortValue } = req.query;
            sort[sortKey] = sortValue === 'asc' ? 1 : -1;
        } else {
            sort.createdAt = -1;
        }

        const orders = await Order.find(findOrders)
            .populate("user_id", "email")
            .populate("products.product_id", "title slug price")
            .sort(sort)
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        res.render("admin/pages/orders/index", {
            pageTitle: "Quản lý đơn hàng",
            orders: orders,
            filterStatus: filterStatus,
            keyword: objectSearch.keyword,
            pagination: objectPagination,
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).render("error", { 
            message: "Lỗi khi tải danh sách đơn hàng" 
        });
    }
};

// [GET] /orders/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate("user_id")
            .populate("products.product_id");

        if (!order) {
            return res.status(404).render("error", { 
                message: "Đơn hàng không tồn tại" 
            });
        }

        // Calculate totals
        let subtotal = 0;
        order.products.forEach(item => {
            const price = item.price;
            const discount = (price * item.discountPercentage) / 100;
            const finalPrice = price - discount;
            subtotal += finalPrice * item.quantity;
        });

        res.render("admin/pages/orders/detail", {
            pageTitle: "Chi tiết đơn hàng",
            order: order,
            subtotal: subtotal,
        });
    } catch (error) {
        console.error("Error fetching order detail:", error);
        res.status(500).render("error", { 
            message: "Lỗi khi tải chi tiết đơn hàng" 
        });
    }
};

// [PATCH] /orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const { status, id } = req.params;

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                error: "Trạng thái không hợp lệ" 
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            id,
            { status: status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                error: "Đơn hàng không tồn tại" 
            });
        }

        // Redirect to order detail page instead of "back"
        res.redirect(`/${systemConfig.prefixAdmin}/orders/detail/${id}`);
    } catch (error) {
        console.error("Error changing order status:", error);
        res.status(500).json({ 
            error: "Lỗi khi cập nhật trạng thái" 
        });
    }
};

// [PATCH] /orders/delete/:id
module.exports.deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await Order.findByIdAndUpdate(
            id,
            { 
                deleted: true,
                deletedAt: new Date()
            }
        );

        res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ 
            error: "Lỗi khi xóa đơn hàng" 
        });
    }
};

// [PATCH] /orders/restore/:id
module.exports.restoreOrder = async (req, res) => {
    try {
        const { id } = req.params;

        await Order.findByIdAndUpdate(
            id,
            { 
                deleted: false,
                deletedAt: null
            }
        );

        res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    } catch (error) {
        console.error("Error restoring order:", error);
        res.status(500).json({ 
            error: "Lỗi khi khôi phục đơn hàng" 
        });
    }
};
