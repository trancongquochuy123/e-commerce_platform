/**
 * Application Constants
 */

// User status
const USER_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BANNED: 'banned'
};

// Order status
const ORDER_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PROCESSING: 'processing',
    SHIPPING: 'shipping',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
};

// Payment status
const PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
    REFUNDED: 'refunded'
};

// Payment methods
const PAYMENT_METHOD = {
    COD: 'cod',
    VNPAY: 'vnpay',
    MOMO: 'momo',
    BANK_TRANSFER: 'bank_transfer'
};

// Product status
const PRODUCT_STATUS = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

// Default pagination
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
};

// Sort options
const SORT_OPTIONS = {
    NEWEST: '-createdAt',
    OLDEST: 'createdAt',
    PRICE_LOW_HIGH: 'price',
    PRICE_HIGH_LOW: '-price',
    NAME_A_Z: 'title',
    NAME_Z_A: '-title',
    POPULAR: '-sold'
};

// Permissions
const PERMISSIONS = {
    // Products
    PRODUCTS_VIEW: 'products_view',
    PRODUCTS_CREATE: 'products_create',
    PRODUCTS_EDIT: 'products_edit',
    PRODUCTS_DELETE: 'products_delete',
    
    // Categories
    CATEGORIES_VIEW: 'categories_view',
    CATEGORIES_CREATE: 'categories_create',
    CATEGORIES_EDIT: 'categories_edit',
    CATEGORIES_DELETE: 'categories_delete',
    
    // Orders
    ORDERS_VIEW: 'orders_view',
    ORDERS_EDIT: 'orders_edit',
    ORDERS_DELETE: 'orders_delete',
    
    // Users
    USERS_VIEW: 'users_view',
    USERS_EDIT: 'users_edit',
    USERS_DELETE: 'users_delete',
    
    // Accounts
    ACCOUNTS_VIEW: 'accounts_view',
    ACCOUNTS_CREATE: 'accounts_create',
    ACCOUNTS_EDIT: 'accounts_edit',
    ACCOUNTS_DELETE: 'accounts_delete',
    
    // Roles
    ROLES_VIEW: 'roles_view',
    ROLES_CREATE: 'roles_create',
    ROLES_EDIT: 'roles_edit',
    ROLES_DELETE: 'roles_delete',
    ROLES_PERMISSIONS: 'roles_permissions',
    
    // Settings
    SETTINGS_VIEW: 'settings_view',
    SETTINGS_EDIT: 'settings_edit',
    
    // Dashboard
    DASHBOARD_VIEW: 'dashboard_view'
};

// Error codes
const ERROR_CODES = {
    // Authentication
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    TOKEN_EXPIRED: 'TOKEN_EXPIRED',
    INVALID_TOKEN: 'INVALID_TOKEN',
    
    // Validation
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    INVALID_INPUT: 'INVALID_INPUT',
    
    // Resources
    NOT_FOUND: 'NOT_FOUND',
    ALREADY_EXISTS: 'ALREADY_EXISTS',
    
    // Server
    INTERNAL_ERROR: 'INTERNAL_ERROR',
    DATABASE_ERROR: 'DATABASE_ERROR',
    
    // Rate limiting
    TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS'
};

// File upload
const UPLOAD = {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    MAX_FILES: 10,
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.webp']
};

// Email templates
const EMAIL_TEMPLATES = {
    WELCOME: 'welcome',
    VERIFY_EMAIL: 'verify-email',
    RESET_PASSWORD: 'reset-password',
    ORDER_CONFIRMATION: 'order-confirmation',
    ORDER_SHIPPED: 'order-shipped'
};

module.exports = {
    USER_STATUS,
    ORDER_STATUS,
    PAYMENT_STATUS,
    PAYMENT_METHOD,
    PRODUCT_STATUS,
    PAGINATION,
    SORT_OPTIONS,
    PERMISSIONS,
    ERROR_CODES,
    UPLOAD,
    EMAIL_TEMPLATES
};