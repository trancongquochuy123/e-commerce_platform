const Product = require("../../../models/product.model.js");
const ResponseFormatter = require("../../../utils/response.js");
const ApiError = require("../../../utils/apiError.js");
const { priceNewProduct } = require("../../../utils/products.js");

// [GET] /
module.exports.index = async (req, res, next) => {
  try {
    const {
      keyword = "",
      page = 1,
      limit = 20,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    let products = [];

    if (keyword) {
      const regex = new RegExp(keyword, "i"); // 'i' for case-insensitive

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortOrder = order === "asc" ? 1 : -1;

      // Execute queries in parallel
      const [foundProducts, totalProducts] = await Promise.all([
        Product.find({
          title: regex,
          deleted: false,
          status: "active",
        })
          .populate("product_category_id", "title")
          .select("-deleted -deletedBy -updatedBy -__v")
          .sort({ [sort]: sortOrder })
          .skip(skip)
          .limit(parseInt(limit))
          .lean()
          .exec(),

        Product.countDocuments({
          title: regex,
          deleted: false,
          status: "active",
        }),
      ]);

      products = foundProducts.map((product) => {
        product.priceNew = priceNewProduct(product);
        return product;
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
        {
          keyword: keyword,
          count: products.length,
          products: products,
        },
        pagination,
        `Search results for "${keyword}"`
      );
    }

    return ResponseFormatter.success(
      res,
      {
        keyword: keyword,
        products: [],
      },
      "No keyword provided"
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    if (err instanceof ApiError) {
      return next(err);
    }
    next(new ApiError(500, "Failed to search products"));
  }
};
