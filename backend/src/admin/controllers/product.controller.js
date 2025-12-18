const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../../config/system");
const paginationHelper = require("../../utils/pagination");
const filterStatusHelper = require("../../utils/filterStatus");
const searchHelper = require("../../utils/search");
const { processDescription } = require("../../utils/handleDescriptionImage");
const { priceNewProduct } = require("../../utils/products");

/**
 * @desc    Get all products - Render admin product list page
 * @route   GET /admin/products
 * @access  Private (products_view)
 */
const getAllProducts = async (req, res) => {
  try {
    // Filter Status
    const filterStatus = filterStatusHelper(req.query);

    // Build filters
    const filters = { deleted: false };

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.feature) {
      filters.feature = req.query.feature;
    }

    if (req.query.category) {
      filters.product_category_id = req.query.category;
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
      sort.position = "desc";
    }

    // Execute query
    const products = await Product.find(filters)
      .populate("product_category_id", "title slug")
      .populate("createdBy.accountId", "fullName email")
      .sort(sort)
      .limit(objectPagination.limitItem)
      .skip(objectPagination.skip);

    // Calculate discounted prices
    products.forEach((product) => {
      product.priceNew = priceNewProduct(product);
    });

    res.render("admin/pages/products/index.pug", {
      pageTitle: "Products",
      description: "Manage your products",
      products: products,
      filterStatus: filterStatus,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    });
  } catch (error) {
    console.error("❌ Get all products error:", error);
    req.flash("error", "An error occurred while loading products.");
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  }
};

/**
 * @desc    Get single product by ID - Render product detail page
 * @route   GET /admin/products/detail/:id
 * @access  Private (products_view)
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    })
      .populate("product_category_id", "title slug")
      .populate("createdBy.accountId", "fullName email");

    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }

    // Calculate discounted price
    product.priceNew = priceNewProduct(product);

    res.render("admin/pages/products/detail.pug", {
      pageTitle: product.title,
      description: `Product details for ${product.title}`,
      product: product,
    });
  } catch (error) {
    console.error("❌ Get product by ID error:", error);
    req.flash("error", "An error occurred while loading product details.");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

/**
 * @desc    Render create product page
 * @route   GET /admin/products/create
 * @access  Private (product_create)
 */
const renderCreate = async (req, res) => {
  try {
    // Get all product categories for the dropdown
    const categories = await ProductCategory.find({
      deleted: false,
      status: "active",
    }).select("title _id");

    res.render("admin/pages/products/create.pug", {
      pageTitle: "Create Product",
      description: "Create a new product",
      categories: categories,
    });
  } catch (error) {
    console.error("❌ Render create page error:", error);
    req.flash("error", "An error occurred while loading create page.");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

/**
 * @desc    Render edit product page
 * @route   GET /admin/products/edit/:id
 * @access  Private (products_edit)
 */
const renderEdit = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({
      _id: id,
      deleted: false,
    }).populate("product_category_id", "title");

    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }

    // Get all product categories for the dropdown
    const categories = await ProductCategory.find({
      deleted: false,
    }).select("title _id");

    res.render("admin/pages/products/edit.pug", {
      pageTitle: "Edit Product",
      description: `Edit ${product.title}`,
      product: product,
      categories: categories,
    });
  } catch (error) {
    console.error("❌ Render edit page error:", error);
    req.flash("error", "An error occurred while loading edit page.");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  }
};

/**
 * @desc    Create new product
 * @route   POST /admin/products/create
 * @access  Private (product_create)
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

    // Add creator info
    req.body.createdBy = {
      accountId: res.locals.user._id,
      createdAt: new Date(),
    };

    // Handle thumbnail from multer + cloudinary middleware
    if (req.file && req.file.path) {
      req.body.thumbnail = req.file.path;
    }

    // Create product
    const product = new Product(req.body);
    await product.save();

    req.flash("success", "Product created successfully!");
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("❌ Create product error:", error);
    req.flash("error", "An error occurred while creating the product.");
    res.redirect(`/${systemConfig.prefixAdmin}/products/create`);
  }
};

/**
 * @desc    Update product (partial update)
 * @route   PATCH /admin/products/edit/:id
 * @access  Private (products_edit)
 */
const patchProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product exists
    const existingProduct = await Product.findOne({
      _id: id,
      deleted: false,
    });

    if (!existingProduct) {
      req.flash("error", "Product not found!");
      return res.redirect(`/${systemConfig.prefixAdmin}/products`);
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

    // Remove updatedBy if accidentally included
    delete req.body.updatedBy;
    delete req.body.createdBy;

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
    res.redirect(`/${systemConfig.prefixAdmin}/products`);
  } catch (error) {
    console.error("❌ Update product error:", error);
    req.flash("error", "An error occurred while updating the product.");
    res.redirect(`/${systemConfig.prefixAdmin}/products/edit/${req.params.id}`);
  }
};

/**
 * @desc    Change product status
 * @route   PATCH /admin/products/change-status/:id
 * @access  Private (products_edit)
 */
const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
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
      req.flash("error", "Product not found!");
      return res.redirect(`/${systemConfig.prefixAdmin}/products`);
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
 * @desc    Bulk actions on products (change-multi)
 * @route   PATCH /admin/products/change-multi
 * @access  Private (products_edit)
 */
const bulkAction = async (req, res) => {
  try {
    const { type, ids } = req.body;

    let result;
    let message;

    switch (type) {
      case "active":
      case "inactive":
        result = await Product.updateMany(
          { _id: { $in: ids } },
          {
            status: type,
            $push: {
              updatedBy: {
                accountId: res.locals.user._id,
                updatedAt: new Date(),
              },
            },
          }
        );
        message = `${result.modifiedCount} products status changed to ${type}`;
        break;

      case "delete-all":
        result = await Product.updateMany(
          { _id: { $in: ids } },
          {
            deleted: true,
            deletedBy: {
              accountId: res.locals.user._id,
              deletedAt: new Date(),
            },
          }
        );
        message = `${result.modifiedCount} products deleted successfully`;
        break;

      default:
        req.flash("error", "Invalid action!");
        return res.redirect("back");
    }

    req.flash("success", message);
    res.redirect("back");
  } catch (error) {
    console.error("❌ Bulk action error:", error);
    req.flash("error", "An error occurred while performing bulk action.");
    res.redirect("back");
  }
};

/**
 * @desc    Change product position
 * @route   PATCH /admin/products/change-position/:id
 * @access  Private (products_edit)
 */
const changePosition = async (req, res) => {
  try {
    const { id } = req.params;
    const { position } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        position: parseInt(position),
        $push: {
          updatedBy: {
            accountId: res.locals.user._id,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).select("_id title position");

    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }

    req.flash("success", "Product position updated successfully!");
    res.redirect("back");
  } catch (error) {
    console.error("❌ Change position error:", error);
    req.flash("error", "An error occurred while changing product position.");
    res.redirect("back");
  }
};

/**
 * @desc    Toggle featured status
 * @route   PATCH /admin/products/toggle-feature/:id
 * @access  Private (products_edit)
 */
const toggleFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).select("feature");
    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }

    const newFeatureStatus = product.feature === "1" ? "0" : "1";

    await Product.findByIdAndUpdate(id, {
      feature: newFeatureStatus,
      $push: {
        updatedBy: {
          accountId: res.locals.user._id,
          updatedAt: new Date(),
        },
      },
    });

    req.flash(
      "success",
      `Product ${
        newFeatureStatus === "1" ? "featured" : "unfeatured"
      } successfully!`
    );
    res.redirect("back");
  } catch (error) {
    console.error("❌ Toggle feature error:", error);
    req.flash("error", "An error occurred while toggling featured status.");
    res.redirect("back");
  }
};

/**
 * @desc    Soft delete product
 * @route   PATCH /admin/products/delete/:id
 * @access  Private (products_delete)
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        deleted: true,
        deletedBy: {
          accountId: res.locals.user._id,
          deletedAt: new Date(),
        },
      },
      { new: true }
    ).select("_id title");

    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }

    req.flash("success", "Product deleted successfully!");
    res.redirect("back");
  } catch (error) {
    console.error("❌ Delete product error:", error);
    req.flash("error", "An error occurred while deleting the product.");
    res.redirect("back");
  }
};

/**
 * @desc    Restore deleted product
 * @route   PATCH /admin/products/restore/:id
 * @access  Private (products_edit)
 */
const restoreProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        deleted: false,
        $unset: { deletedBy: "" },
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
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }

    req.flash("success", "Product restored successfully!");
    res.redirect("back");
  } catch (error) {
    console.error("❌ Restore product error:", error);
    req.flash("error", "An error occurred while restoring the product.");
    res.redirect("back");
  }
};

/**
 * @desc    Permanently delete product
 * @route   DELETE /admin/products/permanent-delete/:id
 * @access  Private (products_delete + super admin)
 */
const permanentDeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      req.flash("error", "Product not found!");
      return res.redirect("back");
    }

    req.flash("success", "Product permanently deleted!");
    res.redirect("back");
  } catch (error) {
    console.error("❌ Permanent delete error:", error);
    req.flash(
      "error",
      "An error occurred while permanently deleting the product."
    );
    res.redirect("back");
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  renderCreate,
  renderEdit,
  createProduct,
  patchProduct,
  updateProduct: patchProduct, // Alias for PUT
  changeStatus,
  bulkAction,
  changePosition,
  toggleFeature,
  deleteProduct,
  restoreProduct,
  permanentDeleteProduct,
};
