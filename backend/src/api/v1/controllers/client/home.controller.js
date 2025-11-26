const Product = require('../../../../models/product.model.js');
const { priceNewProduct } = require('../../../../utils/products.js');

// [GET] /api/home
module.exports.index = async (req, res) => {
    try {
        // 1. Featured Products
        const featuredProducts = await Product.find({
            feature: '1',
            deleted: false,
            status: 'active'
        })
            .populate('product_category_id', 'title')
            .limit(8)
            .exec();

        const featuredProductsNew = priceNewProduct(featuredProducts);

        // 2. Products sorted by createdAt DESC
        const products = await Product.find({
            deleted: false,
            status: 'active'
        })
            .populate('product_category_id', 'title')
            .sort({ createdAt: 'desc' })
            .limit(8)
            .exec();

        const productsSortedNew = priceNewProduct(products);

        // 3. Response dạng API
        res.status(200).json({
            success: true,
            message: "Home products fetched successfully",
            data: {
                featuredProducts: featuredProductsNew,
                products: productsSortedNew
            }
        });

    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};
