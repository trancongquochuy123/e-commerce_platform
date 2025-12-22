const Product = require("../../../models/product.model");
const { priceNewProduct } = require("../../../utils/products");
const paginationHelper = require("../../../utils/pagination");
const ApiError = require("../../../utils/apiError");
const ResponseFormatter = require("../../../utils/response");

const getShopProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            order = "desc",
        } = req.query;

        let sort = {};
        if (req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.createdAt = "desc";
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        // Build filters - only show seller's own products
        const filters = {
            deleted: false,
            accountId: req.params.id, // Only seller's products
        };

        // Execute query
        const [products, totalProducts] = await Promise.all([
            Product.find(filters)
                .populate("product_category_id", "title slug")
                .select("-deleted -deletedBy -updatedBy -__v")
                .sort({ [sort]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit))
                .lean()
                .exec(),

            Product.countDocuments(filters),
        ]);

        // Calculate discounted prices
        products.forEach((product) => {
            product.priceNew = priceNewProduct(product);
        });

        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / parseInt(limit)),
            totalItems: totalProducts,
            limit: parseInt(limit),
        };

        return ResponseFormatter.paginated(
            res,
            products,
            pagination,
            "Shop products list retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get shop products error:", error);
        next(new ApiError(500, "Failed to fetch shop products"));
    }
};

module.exports = {
    getShopProducts
};