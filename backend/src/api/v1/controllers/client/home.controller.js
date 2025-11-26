const Product = require('../../../../models/product.model.js');
const { priceNewProduct } = require('../../../../utils/products.js');
const ResponseFormatter = require('../../../../utils/response.js');
const ApiError = require('../../../../utils/apiError.js');

/**
 * @desc    Get home page products (featured + latest)
 * @route   GET /api/v1/home
 * @access  Public
 */
const getHomeProducts = async (req, res, next) => {
    try {
        // Base query conditions
        const baseConditions = {
            deleted: false,
            status: 'active'
        };

        // Parallel queries for better performance
        const [featuredProducts, latestProducts] = await Promise.all([
            // Featured products
            Product.find({
                ...baseConditions,
                feature: '1'
            })
                .populate('product_category_id', 'title slug')
                .select('-deleted -deletedBy -updatedBy -__v')
                .sort({ position: 1, createdAt: -1 })
                .limit(8)
                .lean()
                .exec(),

            // Latest products
            Product.find(baseConditions)
                .populate('product_category_id', 'title slug')
                .select('-deleted -deletedBy -updatedBy -__v')
                .sort({ createdAt: -1 })
                .limit(8)
                .lean()
                .exec()
        ]);

        // Calculate discounted prices
        const featuredWithPrices = priceNewProduct(featuredProducts);
        const latestWithPrices = priceNewProduct(latestProducts);

        // Format response
        const responseData = {
            featured: {
                title: 'Featured Products',
                items: featuredWithPrices,
                count: featuredWithPrices.length
            },
            latest: {
                title: 'Latest Products',
                items: latestWithPrices,
                count: latestWithPrices.length
            }
        };

        return ResponseFormatter.success(
            res,
            responseData,
            'Home products retrieved successfully'
        );

    } catch (error) {
        console.error('❌ Get home products error:', error);
        next(new ApiError(500, 'Failed to fetch home products'));
    }
};

module.exports = {
    getHomeProducts
};