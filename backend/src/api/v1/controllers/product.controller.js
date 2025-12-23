const ProductCategory = require("../../../models/product-category.model.js");
const Product = require("../../../models/product.model.js");
const ResponseFormatter = require("../../../utils/response.js");
const ApiError = require("../../../utils/apiError.js");
const { priceNewProduct, getPriceNew } = require("../../../utils/products.js");
const { getSubCategories } = require("../../../utils/product-category.js");

/**
 * @desc    Get all active products
 * @route   GET /api/v1/products
 * @access  Public
 * @query   ?page=1&limit=20&sort=createdAt&order=desc&category=slug&minPrice=0&maxPrice=1000
 */
const getAllProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            sort = "position",
            order = "desc",
            category,
            minPrice,
            maxPrice,
            brand,
            rating,
            search,
        } = req.query;

        // Build filter conditions
        const filters = {
            deleted: false,
            status: "active",
        };

        // Category filter
        if (category) {
            const categoryDoc = await ProductCategory.findOne({
                slug: category,
                deleted: false,
                status: "active",
            });
            if (categoryDoc) {
                filters.product_category_id = categoryDoc._id;
            }
        }

        // Price range filter
        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = parseFloat(minPrice);
            if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
        }

        // Brand filter
        if (brand) {
            filters.brand = brand;
        }

        // Rating filter
        if (rating) {
            filters.rating = { $gte: parseFloat(rating) };
        }

        // Search filter
        if (search) {
            filters.$or = [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
                { tags: { $in: [new RegExp(search, "i")] } },
            ];
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        // Execute queries in parallel
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

        // Pagination metadata
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
            "Products retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get products error:", error);
        next(new ApiError(500, "Failed to fetch products"));
    }
};

/**
 * @desc    Get single product by slug
 * @route   GET /api/v1/products/:slug
 * @access  Public
 */
const getProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const product = await Product.findOne({
            slug,
            deleted: false,
            status: "active",
        })
            .populate("product_category_id", "title slug")
            .select("-deleted -deletedBy -updatedBy -__v")
            .lean()
            .exec();

        if (!product) {
            throw new ApiError(404, "Product not found");
        }

        // Calculate discounted price
        product.priceNew = parseFloat(
            getPriceNew(product.price, product.discountPercentage)
        );

        // Calculate average rating from reviews
        if (product.reviews && product.reviews.length > 0) {
            const avgRating =
                product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                product.reviews.length;
            product.averageRating = parseFloat(avgRating.toFixed(1));
            product.totalReviews = product.reviews.length;
        } else {
            product.averageRating = product.rating || 0;
            product.totalReviews = 0;
        }

        // Get related products (same category)
        if (product.product_category_id) {
            const relatedProducts = await Product.find({
                product_category_id: product.product_category_id._id,
                _id: { $ne: product._id },
                deleted: false,
                status: "active",
            })
                .select("title slug thumbnail price discountPercentage rating")
                .limit(4)
                .lean();

            product.relatedProducts = [];
            relatedProducts.forEach((item) => {
                item.priceNew = priceNewProduct(item);
                product.relatedProducts.push(item);
            });
        }

        return ResponseFormatter.success(
            res,
            product,
            "Product retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get product detail error:", error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, "Failed to fetch product details"));
    }
};

/**
 * @desc    Get products by category (including subcategories)
 * @route   GET /api/v1/products/category/:slugCategory
 * @access  Public
 * @query   ?page=1&limit=20&sort=createdAt&order=desc
 */
const getProductsByCategory = async (req, res, next) => {
    try {
        const { slugCategory } = req.params;
        const {
            page = 1,
            limit = 24,
            sort = "createdAt",
            order = "desc",
        } = req.query;

        // Find parent category
        const parentCategory = await ProductCategory.findOne({
            slug: slugCategory,
            deleted: false,
            status: "active",
        }).lean();

        if (!parentCategory) {
            throw new ApiError(404, "Category not found");
        }

        // Get all subcategories
        const allSubCategories = await getSubCategories(parentCategory._id);
        const categoryIds = [
            parentCategory._id,
            ...allSubCategories.map((c) => c._id),
        ];

        // Build filters
        const filters = {
            product_category_id: { $in: categoryIds },
            deleted: false,
            status: "active",
        };

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        // Execute queries in parallel
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
        const productsWithPrices = [];

        products.forEach(product => {
            product.priceNew = priceNewProduct(product);
            productsWithPrices.push(product);
        })

        // Pagination metadata
        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / parseInt(limit)),
            totalItems: totalProducts,
            limit: parseInt(limit),
        };

        return ResponseFormatter.paginated(
            res,
            {
                category: {
                    _id: parentCategory._id,
                    title: parentCategory.title,
                    slug: parentCategory.slug,
                    description: parentCategory.description,
                },
                subcategories: allSubCategories.map((cat) => ({
                    _id: cat._id,
                    title: cat.title,
                    slug: cat.slug,
                })),
                products: productsWithPrices,
            },
            pagination,
            "Category products retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get category products error:", error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, "Failed to fetch category products"));
    }
};

/**
 * @desc    Get featured products
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
const getFeaturedProducts = async (req, res, next) => {
    try {
        const { limit = 8 } = req.query;

        const products = await Product.find({
            feature: "1",
            deleted: false,
            status: "active",
        })
            .populate("product_category_id", "title slug")
            .select("-deleted -deletedBy -updatedBy -__v")
            .sort({ position: 1 })
            .limit(parseInt(limit))
            .lean()
            .exec();

        const productsWithPrices = priceNewProduct(products);

        return ResponseFormatter.success(
            res,
            {
                products: productsWithPrices,
                count: productsWithPrices.length,
            },
            "Featured products retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get featured products error:", error);
        next(new ApiError(500, "Failed to fetch featured products"));
    }
};

/**
 * @desc    Get all categories
 * @route   GET /api/v1/products/categories
 * @access  Public
 */
const getAllCategories = async (req, res, next) => {
    try {
        const categories = await ProductCategory.find({
            deleted: false,
            status: "active",
        })
            .select("-deleted -deletedBy -updatedBy -__v")
            .sort({ position: 1 })
            .lean();

        // (Optional) Nếu muốn đếm số sản phẩm trong mỗi category:
        // for (const cat of categories) {
        //     cat.totalProducts = await Product.countDocuments({
        //         product_category_id: cat._id,
        //         deleted: false,
        //         status: 'active'
        //     });
        // }

        return ResponseFormatter.success(
            res,
            { categories },
            "Categories retrieved successfully"
        );
    } catch (error) {
        console.error("❌ Get categories error:", error);
        next(new ApiError(500, "Failed to fetch categories"));
    }
};

module.exports = {
    getAllProducts,
    getProductBySlug,
    getProductsByCategory,
    getFeaturedProducts,
    getAllCategories,
};
