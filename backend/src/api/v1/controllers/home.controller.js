const Product = require('../../../models/product.model.js');
const { priceNewProduct } = require('../../../utils/products.js');
const ResponseFormatter = require('../../../utils/response.js');

/**
 * @desc    Get home page products (featured + latest)
 * @route   GET /api/v1/home
 * @access  Public
 */
const getHomeProducts = async (req, res, next) => {
    try {
        // Featured Products
        const featuredProducts = await Product.find({ feature: '1', deleted: false, status: 'active' })
            .populate('product_category_id', 'title')
            .limit(8)
            .exec();

        const newProducts = priceNewProduct(featuredProducts);
        // End Featured Products

        // Sort by createdAt desc
        const products = await Product.find({ deleted: false, status: 'active' })
            .populate('product_category_id', 'title')
            .sort({ createdAt: 'desc' })
            .limit(8)
            .exec();

        const newProductsSorted = priceNewProduct(products);

        res.render("client/pages/home/index.pug", {
            pageTitle: "Home",
            description: "Welcome to our home page!",
            featuredProducts: featuredProducts,
            products: newProducts,
            productsSorted: newProductsSorted,
        });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getHomeProducts
};