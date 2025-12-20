const Product = require("../../../models/product.model.js");
const { priceNewProduct } = require("../../../utils/products.js");

// [GET] /
module.exports.index = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    let products = [];

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // 'i' for case-insensitive
      const foundProducts = await Product.find({
        title: regex,
        deleted: false,
        status: "active",
      })
        .populate("product_category_id", "title")
        .limit(20)
        .exec();

      products = priceNewProduct(foundProducts);
    }

    res.json({
      success: true,
      message: keyword
        ? `Search results for "${keyword}"`
        : "No keyword provided",
      data: {
        keyword: keyword,
        count: products.length,
        products: products,
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
