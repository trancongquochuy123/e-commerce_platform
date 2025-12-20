const Product = require('../../../models/product.model.js');
const Cart = require('../../../models/cart.model.js');
const ResponseFormatter = require('../../../utils/response.js');
const ApiError = require('../../../utils/apiError.js');

/**
 * @desc    Get cart details
 * @route   GET /api/v1/cart
 * @access  Public (with cartId in cookies)
 */
const getCart = async (req, res, next) => {
    try {
        const cartId = req.cartId; // From middleware

        if (!cartId) {
            return ResponseFormatter.success(res, {
                cart: null,
                items: [],
                summary: {
                    totalItems: 0,
                    subtotal: 0,
                    discount: 0,
                    total: 0
                }
            }, 'Cart is empty');
        }

        const cart = await Cart.findById(cartId)
            .populate({
                path: 'products.product_id',
                match: { deleted: false, status: 'active' },
                select: '-deleted -deletedBy -updatedBy -__v'
            })
            .lean();

        if (!cart) {
            return ResponseFormatter.success(res, {
                cart: null,
                items: [],
                summary: {
                    totalItems: 0,
                    subtotal: 0,
                    discount: 0,
                    total: 0
                }
            }, 'Cart not found');
        }

        // Filter out invalid products and calculate prices
        const validProducts = cart.products.filter(item => item.product_id);
        
        let subtotal = 0;
        let discount = 0;

        const items = validProducts.map(item => {
            const product = item.product_id;
            const priceNew = (product.price - (product.price * product.discountPercentage / 100)).toFixed(2);
            const itemSubtotal = product.price * item.quantity;
            const itemTotal = priceNew * item.quantity;
            const itemDiscount = itemSubtotal - itemTotal;

            subtotal += itemSubtotal;
            discount += itemDiscount;

            return {
                _id: product._id,
                title: product.title,
                slug: product.slug,
                thumbnail: product.thumbnail,
                price: product.price,
                discountPercentage: product.discountPercentage,
                priceNew: parseFloat(priceNew),
                quantity: item.quantity,
                stock: product.stock,
                itemTotal: parseFloat(itemTotal.toFixed(2)),
                category: product.product_category_id
            };
        });

        const total = subtotal - discount;

        // Update cart if products were filtered
        if (validProducts.length !== cart.products.length) {
            await Cart.findByIdAndUpdate(cartId, {
                products: validProducts
            });
        }

        return ResponseFormatter.success(res, {
            cartId,
            items,
            summary: {
                totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
                subtotal: parseFloat(subtotal.toFixed(2)),
                discount: parseFloat(discount.toFixed(2)),
                total: parseFloat(total.toFixed(2))
            }
        }, 'Cart retrieved successfully');

    } catch (error) {
        console.error('❌ Get cart error:', error);
        next(new ApiError(500, 'Failed to retrieve cart'));
    }
};

/**
 * @desc    Add product to cart
 * @route   POST /api/v1/cart/add/:productId
 * @access  Public (with cartId in cookies)
 */
const addToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const quantity = parseInt(req.body.quantity) || 1;
        const cartId = req.cartId; // From middleware

        // Validate quantity
        if (quantity < 1) {
            throw new ApiError(400, 'Quantity must be greater than 0');
        }

        // Check product exists and is available
        const product = await Product.findOne({
            _id: productId,
            deleted: false,
            status: 'active'
        }).select('stock title price discountPercentage');

        if (!product) {
            throw new ApiError(404, 'Product not found or unavailable');
        }

        // Get or create cart
        let cart = await Cart.findById(cartId);
        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }

        // Check if product already in cart
        const existingProductIndex = cart.products.findIndex(
            item => item.product_id?.toString() === productId
        );

        if (existingProductIndex !== -1) {
            // Update quantity
            const newQuantity = cart.products[existingProductIndex].quantity + quantity;
            
            // Check stock
            if (newQuantity > product.stock) {
                throw new ApiError(400, `Only ${product.stock} items available in stock`);
            }

            cart.products[existingProductIndex].quantity = newQuantity;
        } else {
            // Check stock for new item
            if (quantity > product.stock) {
                throw new ApiError(400, `Only ${product.stock} items available in stock`);
            }

            // Add new product
            cart.products.push({
                product_id: productId,
                quantity
            });
        }

        await cart.save();

        // Return updated cart summary
        const updatedCart = await Cart.findById(cartId)
            .populate('products.product_id', 'title price discountPercentage thumbnail slug stock')
            .lean();

        const totalItems = updatedCart.products.reduce((sum, item) => sum + item.quantity, 0);

        return ResponseFormatter.success(res, {
            cartId,
            totalItems,
            addedProduct: {
                _id: product._id,
                title: product.title,
                quantity
            }
        }, 'Product added to cart successfully');

    } catch (error) {
        console.error('❌ Add to cart error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to add product to cart'));
    }
};

/**
 * @desc    Update product quantity in cart
 * @route   PATCH /api/v1/cart/update
 * @access  Public (with cartId in cookies)
 */
const updateCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const cartId = req.cartId;

        // Validate input
        if (!productId || !quantity) {
            throw new ApiError(400, 'Product ID and quantity are required');
        }

        const newQuantity = parseInt(quantity);
        if (newQuantity < 1) {
            throw new ApiError(400, 'Quantity must be greater than 0');
        }

        // Check product stock
        const product = await Product.findOne({
            _id: productId,
            deleted: false,
            status: 'active'
        }).select('stock');

        if (!product) {
            throw new ApiError(404, 'Product not found or unavailable');
        }

        if (newQuantity > product.stock) {
            throw new ApiError(400, `Only ${product.stock} items available in stock`);
        }

        // Update cart
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }

        const productIndex = cart.products.findIndex(
            item => item.product_id.toString() === productId
        );

        if (productIndex === -1) {
            throw new ApiError(404, 'Product not found in cart');
        }

        cart.products[productIndex].quantity = newQuantity;
        await cart.save();

        return ResponseFormatter.success(res, {
            productId,
            quantity: newQuantity
        }, 'Cart updated successfully');

    } catch (error) {
        console.error('❌ Update cart error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to update cart'));
    }
};

/**
 * @desc    Remove product from cart
 * @route   DELETE /api/v1/cart/delete/:productId
 * @access  Public (with cartId in cookies)
 */
const removeFromCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const cartId = req.cartId;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }

        const initialLength = cart.products.length;
        cart.products = cart.products.filter(
            item => item.product_id.toString() !== productId
        );

        if (cart.products.length === initialLength) {
            throw new ApiError(404, 'Product not found in cart');
        }

        await cart.save();

        return ResponseFormatter.success(res, {
            productId,
            remainingItems: cart.products.length
        }, 'Product removed from cart successfully');

    } catch (error) {
        console.error('❌ Remove from cart error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to remove product from cart'));
    }
};

/**
 * @desc    Clear entire cart
 * @route   DELETE /api/v1/cart/clear
 * @access  Public (with cartId in cookies)
 */
const clearCart = async (req, res, next) => {
    try {
        const cartId = req.cartId;

        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new ApiError(404, 'Cart not found');
        }

        cart.products = [];
        await cart.save();

        return ResponseFormatter.success(res, null, 'Cart cleared successfully');

    } catch (error) {
        console.error('❌ Clear cart error:', error);
        if (error instanceof ApiError) {
            return next(error);
        }
        next(new ApiError(500, 'Failed to clear cart'));
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};