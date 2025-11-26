const Product = require("../../../../models/product.model");
const ProductCategory = require("../../../../models/product-category.model");
const Account = require("../../../../models/account.model");
const ResponseFormatter = require("../../../../utils/response");
const ApiError = require("../../../../utils/apiError");
const { processDescription } = require("../../../../utils/handleDescriptionImage");
const { priceNewProduct } = require("../../../../utils/products");

/**
 * @desc    Get all products with filters, search, pagination
 * @route   GET /api/v1/admin/products
 * @access  Private (product_view)
 */
const getAllProducts = async (req, res, next) => {
    try {
        const {
            page = 1,
            limit = 20,
            status,
            feature,
            category,
            keyword,
            sortBy = 'position',
            order = 'desc',
            minPrice,
            maxPrice
        } = req.query;

        // Build filters
        const filters = { deleted: false };

        if (status && status !== 'all') {
            filters.status = status;
        }

        if (feature && feature !== 'all') {
            filters.feature = feature;
        }

        if (category) {
            filters.product_category_id = category;
        }

        if (keyword) {
            filters.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { sku: { $regex: keyword, $options: 'i' } },
                { brand: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            filters.price = {};
            if (minPrice) filters.price.$gte = parseFloat(minPrice);
            if (maxPrice) filters.price.$lte = parseFloat(maxPrice);
        }

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === 'asc' ? 1 : -1;

        // Execute queries
        const [products, totalProducts] = await Promise.all([
            Product.find(filters)
                .populate('product_category_id', 'title slug')
                .populate('createdBy.accountId', 'fullName email')
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(parseInt(limit))
                .lean()
                .exec(),
            
            Product.countDocuments(filters)
        ]);

        // Calculate prices and add creator info
        const productsWithDetails = await Promise.all(
            products.map(async (product) => {
                // Calculate discounted price
                product.priceNew = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);

                // Get last updater info
                if (product.updatedBy && product.updatedBy.length > 0) {
                    const lastUpdate = product.updatedBy[product.updatedBy.length - 1];
                    const updater = await Account.findById(lastUpdate.accountId)
                        .select('fullName email')
                        .lean();
                    
                    if (updater) {
                        product.lastUpdatedBy = {
                            name: updater.fullName,
                            email: updater.email,
                            date: lastUpdate.updatedAt
                        };
                    }
                }

                return product;
            })
        );

        // Pagination metadata
        const pagination = {
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalProducts / parseInt(limit)),
            totalItems: totalProducts,
            limit: parseInt(limit)
        };

        return ResponseFormatter.paginated(
            res,
            productsWithDetails,
            pagination,
            'Products retrieved successfully'
        );

    } catch (error) {
        console.error('❌ Get all products error:', error);
        next(new ApiError(500, 'Failed to fetch products'));
    }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/v1/admin/products/:id
 * @access  Private (product_view)
 */
const getProductById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findOne({
            _id: id,
            deleted: false
        })
            .populate('product_category_id', 'title slug')
            .populate('createdBy.accountId', 'fullName email')
            .lean()
            .exec();

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        // Calculate discounted price
        product.priceNew = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);

        // Get update history
        if (product.updatedBy && product.updatedBy.length > 0) {
            const updateHistory = await Promise.all(
                product.updatedBy.map(async (update) => {
                    const account = await Account.findById(update.accountId)
                        .select('fullName email')
                        .lean();
                    
                    return {
                        user: account ? {
                            name: account.fullName,
                            email: account.email
                        } : null,
                        date: update.updatedAt
                    };
                })
            );
            product.updateHistory = updateHistory.filter(h => h.user);
        }

        return ResponseFormatter.success(
            res,
            product,
            'Product retrieved successfully'
        );

    } catch (error) {
        console.error('❌ Get product by ID error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to fetch product'));
    }
};

/**
 * @desc    Create new product
 * @route   POST /api/v1/admin/products
 * @access  Private (product_create)
 */
const createProduct = async (req, res, next) => {
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
            createdAt: new Date()
        };

        // Handle thumbnail from multer + cloudinary middleware
        if (req.file && req.file.path) {
            req.body.thumbnail = req.file.path;
        }

        // Create product
        const product = new Product(req.body);
        await product.save();

        // Populate for response
        await product.populate('product_category_id', 'title slug');

        return ResponseFormatter.created(
            res,
            {
                _id: product._id,
                title: product.title,
                slug: product.slug,
                price: product.price,
                thumbnail: product.thumbnail,
                category: product.product_category_id
            },
            'Product created successfully'
        );

    } catch (error) {
        console.error('❌ Create product error:', error);
        next(new ApiError(500, 'Failed to create product'));
    }
};

/**
 * @desc    Update product (partial update)
 * @route   PATCH /api/v1/admin/products/:id
 * @access  Private (product_edit)
 */
const patchProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if product exists
        const existingProduct = await Product.findOne({
            _id: id,
            deleted: false
        });

        if (!existingProduct) {
            throw new ApiError(404, 'Product not found');
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
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                ...req.body,
                $push: {
                    updatedBy: {
                        accountId: res.locals.user._id,
                        updatedAt: new Date()
                    }
                }
            },
            { new: true, runValidators: true }
        )
            .populate('product_category_id', 'title slug')
            .lean();

        return ResponseFormatter.success(
            res,
            updatedProduct,
            'Product updated successfully'
        );

    } catch (error) {
        console.error('❌ Update product error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to update product'));
    }
};

/**
 * @desc    Change product status
 * @route   PATCH /api/v1/admin/products/:id/status
 * @access  Private (product_edit)
 */
const changeStatus = async (req, res, next) => {
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
                        updatedAt: new Date()
                    }
                }
            },
            { new: true }
        ).select('_id title status');

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return ResponseFormatter.success(
            res,
            {
                _id: product._id,
                title: product.title,
                status: product.status
            },
            'Product status updated successfully'
        );

    } catch (error) {
        console.error('❌ Change status error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to change product status'));
    }
};

/**
 * @desc    Bulk actions on products
 * @route   POST /api/v1/admin/products/bulk-action
 * @access  Private (product_edit)
 */
const bulkAction = async (req, res, next) => {
    try {
        const { action, ids } = req.body;

        let result;
        let message;

        switch (action) {
            case 'active':
            case 'inactive':
                result = await Product.updateMany(
                    { _id: { $in: ids } },
                    {
                        status: action,
                        $push: {
                            updatedBy: {
                                accountId: res.locals.user._id,
                                updatedAt: new Date()
                            }
                        }
                    }
                );
                message = `${result.modifiedCount} products status changed to ${action}`;
                break;

            case 'delete':
                result = await Product.updateMany(
                    { _id: { $in: ids } },
                    {
                        deleted: true,
                        deletedBy: {
                            accountId: res.locals.user._id,
                            deletedAt: new Date()
                        }
                    }
                );
                message = `${result.modifiedCount} products deleted successfully`;
                break;

            case 'feature':
                result = await Product.updateMany(
                    { _id: { $in: ids } },
                    { feature: '1' }
                );
                message = `${result.modifiedCount} products marked as featured`;
                break;

            case 'unfeature':
                result = await Product.updateMany(
                    { _id: { $in: ids } },
                    { feature: '0' }
                );
                message = `${result.modifiedCount} products unmarked as featured`;
                break;

            default:
                throw new ApiError(400, 'Invalid action');
        }

        return ResponseFormatter.success(
            res,
            {
                action,
                affectedCount: result.modifiedCount,
                totalRequested: ids.length
            },
            message
        );

    } catch (error) {
        console.error('❌ Bulk action error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to perform bulk action'));
    }
};

/**
 * @desc    Change product position
 * @route   PATCH /api/v1/admin/products/:id/position
 * @access  Private (product_edit)
 */
const changePosition = async (req, res, next) => {
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
                        updatedAt: new Date()
                    }
                }
            },
            { new: true }
        ).select('_id title position');

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return ResponseFormatter.success(
            res,
            product,
            'Product position updated successfully'
        );

    } catch (error) {
        console.error('❌ Change position error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to change product position'));
    }
};

/**
 * @desc    Toggle featured status
 * @route   PATCH /api/v1/admin/products/:id/feature
 * @access  Private (product_edit)
 */
const toggleFeature = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id).select('feature');
        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        const newFeatureStatus = product.feature === '1' ? '0' : '1';

        await Product.findByIdAndUpdate(id, {
            feature: newFeatureStatus,
            $push: {
                updatedBy: {
                    accountId: res.locals.user._id,
                    updatedAt: new Date()
                }
            }
        });

        return ResponseFormatter.success(
            res,
            {
                _id: id,
                feature: newFeatureStatus,
                isFeatured: newFeatureStatus === '1'
            },
            `Product ${newFeatureStatus === '1' ? 'featured' : 'unfeatured'} successfully`
        );

    } catch (error) {
        console.error('❌ Toggle feature error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to toggle featured status'));
    }
};

/**
 * @desc    Soft delete product
 * @route   DELETE /api/v1/admin/products/:id
 * @access  Private (product_delete)
 */
const deleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
            id,
            {
                deleted: true,
                deletedBy: {
                    accountId: res.locals.user._id,
                    deletedAt: new Date()
                }
            },
            { new: true }
        ).select('_id title');

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return ResponseFormatter.success(
            res,
            {
                _id: product._id,
                title: product.title
            },
            'Product deleted successfully'
        );

    } catch (error) {
        console.error('❌ Delete product error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to delete product'));
    }
};

/**
 * @desc    Restore deleted product
 * @route   PATCH /api/v1/admin/products/:id/restore
 * @access  Private (product_edit)
 */
const restoreProduct = async (req, res, next) => {
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
                        updatedAt: new Date()
                    }
                }
            },
            { new: true }
        ).select('_id title status');

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return ResponseFormatter.success(
            res,
            product,
            'Product restored successfully'
        );

    } catch (error) {
        console.error('❌ Restore product error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to restore product'));
    }
};

/**
 * @desc    Permanently delete product
 * @route   DELETE /api/v1/admin/products/:id/permanent
 * @access  Private (product_delete + super admin)
 */
const permanentDeleteProduct = async (req, res, next) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            throw new ApiError(404, 'Product not found');
        }

        return ResponseFormatter.success(
            res,
            {
                _id: id,
                title: product.title
            },
            'Product permanently deleted'
        );

    } catch (error) {
        console.error('❌ Permanent delete error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to permanently delete product'));
    }
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    patchProduct,
    updateProduct: patchProduct, // Alias for PUT
    changeStatus,
    bulkAction,
    changePosition,
    toggleFeature,
    deleteProduct,
    restoreProduct,
    permanentDeleteProduct
};