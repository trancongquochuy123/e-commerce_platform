const ProductCategory = require("../../../../models/product-category.model.js");
const Product = require("../../../../models/product.model.js");

const { priceNewProduct, getPriceNew } = require('../../../../utils/products.js');
const { getSubCategories } = require('../../../../utils/product-category.js');

// [GET] /api/products
module.exports.index = async (req, res) => {
    try {
        const products = await Product.find({
            deleted: false,
            status: "active",
        })
            .populate('product_category_id', 'title')
            .sort({ position: "desc" });

        const newProducts = priceNewProduct(products);

        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: newProducts
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

// [GET] /api/products/:slug
module.exports.detail = async (req, res) => {
    const slug = req.params.slug;

    try {
        const product = await Product
            .findOne({ slug: slug, deleted: false, status: "active" })
            .populate('product_category_id', 'title slug');

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        product.priceNew = getPriceNew(product.price, product.discountPercentage);

        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product
        });

    } catch (err) {
        console.error("Error fetching product details:", err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};


// [GET] /api/products/category/:slugCategory
module.exports.category = async (req, res) => {
    const slugCategory = req.params.slugCategory;

    try {
        // Lấy category cha
        const parentCategory = await ProductCategory.findOne({
            slug: slugCategory,
            deleted: false,
            status: "active"
        });

        if (!parentCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // Lấy category con
        const allSubCategories = await getSubCategories(parentCategory._id);

        const categoryIds = [parentCategory._id, ...allSubCategories.map(c => c._id)];

        const products = await Product
            .find({ product_category_id: { $in: categoryIds }, deleted: false, status: "active" })
            .populate('product_category_id', 'title')
            .sort({ createdAt: 'desc' });

        const newProducts = priceNewProduct(products);

        res.status(200).json({
            success: true,
            message: "Products in category fetched successfully",
            data: {
                category: parentCategory,
                products: newProducts
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
};

