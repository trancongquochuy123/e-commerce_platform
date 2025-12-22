const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../../config/system");
const paginationHelper = require("../../utils/pagination");
const filterStatusHelper = require("../../utils/filterStatus");
const searchHelper = require("../../utils/search");
const { processDescription } = require("../../utils/handleDescriptionImage");
const { priceNewProduct } = require("../../utils/products");

/**
 * @desc    Get seller's products - Render seller product list page
 * @route   GET /admin/seller/products
 * @access  Private (Shop role)
 */
const getMyProducts = async (req, res) => {
  try {
    // Filter Status
    const filterStatus = filterStatusHelper(req.query);

    // Build filters - only show seller's own products
    const filters = {
      deleted: false,
      accountId: res.locals.user._id, // Only seller's products
    };

    if (req.query.status) {
      filters.status = req.query.status;
    }

    // Search
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
      filters.$or = [
        { title: objectSearch.regex },
        { sku: objectSearch.regex },
        { brand: objectSearch.regex },
      ];
    }

    // Pagination
    const countProducts = await Product.countDocuments(filters);
    const objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItem: 10,
      },
      req.query,
      countProducts
    );

    // Sort
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
      sort[req.query.sortKey] = req.query.sortValue;
    } else {
      sort.createdAt = "desc";
    }

    // Execute query
    const products = await Product.find(filters)
      .populate("product_category_id", "title slug")
      .sort(sort)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);

    // Calculate discounted prices
    products.forEach((product) => {
      product.priceNew = priceNewProduct(product);
    });

    res.render("admin/pages/seller-products/index.pug", {
      pageTitle: "My Products",
      description: "Manage your products",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    console.error("❌ Get seller products error:", error);
    req.flash("error", "An error occurred while loading products.");
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  }
};

/**
 * @desc    Render create product page
 * @route   GET /admin/seller/products/create
 * @access  Private (Shop role)
 */
const renderCreate = async (req, res) => {
  try {
    // Get all product categories for the dropdown
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
    }).select("title _id");

    res.render("admin/pages/seller-products/create.pug", {
      pageTitle: "Create Product",
      description: "Create a new product",
      categories: categories,
    });
  } catch (error) {
    console.error("❌ Render create page error:", error);
    req.flash("error", "An error occurred while loading create page.");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
  }
};

/**
 * @desc    Create new product
 * @route   POST /admin/seller/products/create
 * @access  Private (Shop role)
 */
const createProduct = async (req, res) => {
  try {
    // Parse numeric fields
    req.body.price = parseFloat(req.body.price);
    req.body.discountPercentage = parseFloat(req.body.discountPercentage) || 0;
    req.body.stock = parseInt(req.body.stock);

    // Handle position
    if (!req.body.position || req.body.position === "") {
      const countProducts = await Product.countDocuments();
      req.body.position = countProducts + 1;
    } else {
      req.body.position = parseInt(req.body.position);
    }

    // Process description images (upload to Cloudinary)
    if (req.body.description) {
      req.body.description = await processDescription(req.body.description);
    }

    // Assign product to seller
    req.body.accountId = res.locals.user._id;

    // Add creator info
    req.body.createdBy = {
      accountId: res.locals.user._id,
      createdAt: new Date(),
    };

    // The thumbnail and images are already in req.body by the uploadCloudinary middleware

    // Create product
    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Product created successfully!");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
  } catch (error) {
    console.error("❌ Create product error:", error);
    req.flash("error", "An error occurred while creating the product.");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products/create`);
  }
};

/**
 * @desc    Render edit product page
 * @route   GET /admin/seller/products/edit/:id
 * @access  Private (Shop role)
 */
const renderEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
      accountId: res.locals.user._id, // Ownership check
    }).populate("product_category_id", "title");

    if (!product) {
      req.flash("error", "Product not found or you don't have permission.");
      return res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
    }

    // Get all product categories for the dropdown
    const categories = await ProductCategory.find({
      deleted: false,
    }).select("title _id");

    res.render("admin/pages/seller-products/edit.pug", {
      pageTitle: "Edit Product",
      description: `Edit ${product.title}`,
      product: product,
      categories: categories,
    });
  } catch (error) {
    console.error("❌ Render edit page error:", error);
    req.flash("error", "An error occurred while loading edit page.");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
  }
};

/**
 * @desc    Update product (partial update)
 * @route   PATCH /admin/seller/products/edit/:id
 * @access  Private (Shop role)
 */
const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists and belongs to seller
    const existingProduct = await Product.findOne({
      _id: id,
      deleted: false,
      accountId: res.locals.user._id, // Ownership check
    });

    if (!existingProduct) {
      req.flash("error", "Product not found or you don't have permission.");
      return res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
    }

    // Parse numeric fields if provided
    if (req.body.price) req.body.price = parseFloat(req.body.price);
    if (req.body.discountPercentage !== undefined) {
      req.body.discountPercentage = parseFloat(req.body.discountPercentage);
    }
    if (req.body.stock) req.body.stock = parseInt(req.body.stock);
    if (req.body.position) req.body.position = parseInt(req.body.position);

    // Process description images
    if (req.body.description) {
      req.body.description = await processDescription(req.body.description);
    }

    // Handle new thumbnail
    if (req.file && req.file.path) {
      req.body.thumbnail = req.file.path;
    }

    // Remove fields that shouldn't be updated
    delete req.body.updatedBy;
    delete req.body.createdBy;
    delete req.body.accountId; // Prevent changing ownership

    // Update product
    await Product.findByIdAndUpdate(
      id,
      {
        ...req.body,
        $push: {
          updatedBy: {
            accountId: res.locals.user._id,
            updatedAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    req.flash("success", "Product updated successfully!");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
  } catch (error) {
    console.error("❌ Update product error:", error);
    req.flash("error", "An error occurred while updating the product.");
    res.redirect(
      `/${systemConfig.prefixAdmin}/seller/products/edit/${req.params.id}`
    );
  }
};

/**
 * @desc    Change product status
 * @route   PATCH /admin/seller/products/change-status/:id
 * @access  Private (Shop role)
 */
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        accountId: res.locals.user._id, // Ownership check
      },
      {
        status,
        $push: {
          updatedBy: {
            accountId: res.locals.user._id,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).select("_id title status");

    if (!product) {
      req.flash("error", "Product not found or you don't have permission.");
      return res.redirect("back");
    }

    req.flash("success", "Product status updated successfully!");
    res.redirect("back");
  } catch (error) {
    console.error("❌ Change status error:", error);
    req.flash("error", "An error occurred while changing product status.");
    res.redirect("back");
  }
};

/**
 * @desc    Soft delete product
 * @route   DELETE /admin/seller/products/delete/:id
 * @access  Private (Shop role)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      {
        _id: id,
        deleted: false,
        accountId: res.locals.user._id, // Ownership check
      },
      {
        deleted: true,
        deletedBy: {
          accountId: res.locals.user._id,
          deletedAt: new Date(),
        },
      },
      { new: true }
    );

    if (!product) {
      req.flash("error", "Product not found or you don't have permission.");
      return res.redirect("back");
    }

    req.flash("success", "Product deleted successfully!");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
  } catch (error) {
    console.error("❌ Delete product error:", error);
    req.flash("error", "An error occurred while deleting the product.");
    res.redirect("back");
  }
};

/**
 * @desc    Get single product by ID - Render product detail page
 * @route   GET /admin/seller/products/detail/:id
 * @access  Private (Shop role)
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
      accountId: res.locals.user._id, // Ownership check
    }).populate("product_category_id", "title slug");

    if (!product) {
      req.flash("error", "Product not found or you don't have permission.");
      return res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
    }

    // Calculate discounted price
    product.priceNew = priceNewProduct(product);

    res.render("admin/pages/seller-products/detail.pug", {
      pageTitle: product.title,
      description: `Product details for ${product.title}`,
      product: product,
    });
  } catch (error) {
    console.error("❌ Get product by ID error:", error);
    req.flash("error", "An error occurred while loading product details.");
    res.redirect(`/${systemConfig.prefixAdmin}/seller/products`);
  }
};

module.exports = {
  getMyProducts,
  renderCreate,
  createProduct,
  renderEdit,
  patchProduct,
  changeStatus,
  deleteProduct,
  getProductById,
};
