const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const md5 = require("md5");
const dotenv = require("dotenv");
const path = require("path");

// ---------------------------------------------------------
// CONFIGURATION
// ---------------------------------------------------------

// Load environment variables from the root directory
dotenv.config({ path: path.join(__dirname, "../.env") });

// Enable Mongoose Debugging (Optional: Set to true if you need to see SQL-like logs)
mongoose.set("debug", false);

// ---------------------------------------------------------
// IMPORT MODELS
// ---------------------------------------------------------
// Using path.join ensures these work regardless of OS (Windows/Mac/Linux)
const User = require(path.join(__dirname, "../src/models/user.model.js"));
const Account = require(path.join(__dirname, "../src/models/account.model.js"));
const Role = require(path.join(__dirname, "../src/models/role.model.js"));
const Permission = require(path.join(
    __dirname,
    "../src/models/permission.model.js"
));
const ProductCategory = require(path.join(
    __dirname,
    "../src/models/product-category.model.js"
));
const Product = require(path.join(__dirname, "../src/models/product.model.js"));
const Cart = require(path.join(__dirname, "../src/models/cart.model.js"));
const Order = require(path.join(__dirname, "../src/models/order.model.js"));
const ForgotPassword = require(path.join(
    __dirname,
    "../src/models/forgot-password.model.js"
));
const SettingsGeneral = require(path.join(
    __dirname,
    "../src/models/settings-general.model.js"
));

// ---------------------------------------------------------
// IMPORT CONSTANTS
// ---------------------------------------------------------
const { PERMISSIONS } = require(path.join(__dirname, "../src/utils/constants"));

// ---------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------

// Helper function to create slug manually
const generateSlug = (text) => {
    return (
        text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-") // Replace spaces with -
            .replace(/[^\w\-]+/g, "") // Remove all non-word chars
            .replace(/\-\-+/g, "-") + // Replace multiple - with single -
        "-" +
        faker.string.alphanumeric(6)
    ); // Append random string
};

// Helper function to generate reviews
const generateReviews = (count = 3) => {
    const reviews = [];
    for (let i = 0; i < count; i++) {
        reviews.push({
            rating: faker.number.int({ min: 1, max: 5 }),
            comment: faker.lorem.sentence(),
            date: faker.date.past(),
            reviewerName: faker.person.fullName(),
            reviewerEmail: faker.internet.email(),
        });
    }
    return reviews;
};

// ---------------------------------------------------------
// DATABASE OPERATIONS
// ---------------------------------------------------------

// Database connection
const connectDB = async () => {
    try {
        // Cần thay đổi URI này nếu bạn không muốn expose mật khẩu của mình
        const uri =
            "mongodb+srv://trancongquochuy178:YL5LWrFuNw1GuRgl@cluster0.wd98cmf.mongodb.net/product-management";
        console.log(`🔌 Connecting to MongoDB...`);
        await mongoose.connect(uri);
        console.log("✓ Database connected successfully");
    } catch (error) {
        console.error("✗ Database connection failed:", error.message);
        process.exit(1);
    }
};

// Clear all collections
const clearDatabase = async () => {
    console.log("🧹 Clearing existing data...");
    try {
        await Promise.all([
            User.deleteMany({}),
            Account.deleteMany({}),
            Role.deleteMany({}),
            Permission.deleteMany({}),
            ProductCategory.deleteMany({}),
            Product.deleteMany({}),
            Cart.deleteMany({}),
            Order.deleteMany({}),
            ForgotPassword.deleteMany({}),
            SettingsGeneral.deleteMany({}),
        ]);
        console.log("✓ Database cleared");
    } catch (error) {
        console.error("✗ Error clearing database:", error.message);
        throw error;
    }
};

// Seed Permissions
const seedPermissions = async () => {
    console.log("🌱 Seeding Permissions...");
    const permissions = [
        // Products
        {
            key: PERMISSIONS.PRODUCTS_VIEW,
            label: "View Products",
            group: "Products",
        },
        {
            key: PERMISSIONS.PRODUCTS_CREATE,
            label: "Create Product",
            group: "Products",
        },
        {
            key: PERMISSIONS.PRODUCTS_EDIT,
            label: "Edit Product",
            group: "Products",
        },
        {
            key: PERMISSIONS.PRODUCTS_DELETE,
            label: "Delete Product",
            group: "Products",
        }, // Categories
        {
            key: PERMISSIONS.CATEGORIES_VIEW,
            label: "View Categories",
            group: "Categories",
        },
        {
            key: PERMISSIONS.CATEGORIES_CREATE,
            label: "Create Category",
            group: "Categories",
        },
        {
            key: PERMISSIONS.CATEGORIES_EDIT,
            label: "Edit Category",
            group: "Categories",
        },
        {
            key: PERMISSIONS.CATEGORIES_DELETE,
            label: "Delete Category",
            group: "Categories",
        }, // Orders
        { key: PERMISSIONS.ORDERS_VIEW, label: "View Orders", group: "Orders" },
        { key: PERMISSIONS.ORDERS_EDIT, label: "Edit Order", group: "Orders" },
        { key: PERMISSIONS.ORDERS_DELETE, label: "Delete Order", group: "Orders" }, // Users
        { key: PERMISSIONS.USERS_VIEW, label: "View Users", group: "Users" },
        { key: PERMISSIONS.USERS_EDIT, label: "Edit User", group: "Users" },
        { key: PERMISSIONS.USERS_DELETE, label: "Delete User", group: "Users" }, // Accounts
        {
            key: PERMISSIONS.ACCOUNTS_VIEW,
            label: "View Accounts",
            group: "Accounts",
        },
        {
            key: PERMISSIONS.ACCOUNTS_CREATE,
            label: "Create Account",
            group: "Accounts",
        },
        {
            key: PERMISSIONS.ACCOUNTS_EDIT,
            label: "Edit Account",
            group: "Accounts",
        },
        {
            key: PERMISSIONS.ACCOUNTS_DELETE,
            label: "Delete Account",
            group: "Accounts",
        }, // Roles
        { key: PERMISSIONS.ROLES_VIEW, label: "View Roles", group: "Roles" },
        { key: PERMISSIONS.ROLES_CREATE, label: "Create Role", group: "Roles" },
        { key: PERMISSIONS.ROLES_EDIT, label: "Edit Role", group: "Roles" },
        { key: PERMISSIONS.ROLES_DELETE, label: "Delete Role", group: "Roles" },
        {
            key: PERMISSIONS.ROLES_PERMISSIONS,
            label: "Manage Permissions",
            group: "Roles",
        }, // Settings
        {
            key: PERMISSIONS.SETTINGS_VIEW,
            label: "View Settings",
            group: "Settings",
        },
        {
            key: PERMISSIONS.SETTINGS_EDIT,
            label: "Edit Settings",
            group: "Settings",
        }, // Dashboard
        {
            key: PERMISSIONS.DASHBOARD_VIEW,
            label: "View Dashboard",
            group: "Dashboard",
        },
    ];

    try {
        const createdPermissions = await Permission.insertMany(permissions);
        console.log(`✓ Created ${createdPermissions.length} permissions`);
        return createdPermissions;
    } catch (error) {
        console.error("✗ Error seeding permissions:", error.message);
        throw error;
    }
};

// Seed Roles
const seedRoles = async (permissions) => {
    console.log("🌱 Seeding Roles..."); // KHẮC PHỤC LỖI: Sử dụng p.id (getter string) thay vì p._id để đảm bảo trích xuất ID hợp lệ
    const adminPermissionIds = permissions.map((p) => p.id);
    const createdRoles = [];
    const rolesData = [
        {
            title: "Admin",
            description: "Full access to all features",
            permissions: adminPermissionIds,
        },
        {
            title: "Manager",
            description: "Can manage products and orders",
            permissions: adminPermissionIds.filter((_, i) => i % 2 === 0),
        },
        {
            title: "Editor",
            description: "Can edit content",
            permissions: adminPermissionIds.filter((_, i) => i % 3 === 0),
        },
        {
            title: "Viewer",
            description: "Can only view content",
            permissions: adminPermissionIds.filter((_, i) => i % 4 === 0),
        },
    ];

    try {
        for (const roleData of rolesData) {
            const role = await Role.create(roleData);
            createdRoles.push(role);
        }
        console.log(`✓ Created ${createdRoles.length} roles`);
        return createdRoles;
    } catch (error) {
        console.error("✗ Error seeding roles:", error.message);
        throw error;
    }
};

// Seed Users
const seedUsers = async (count = 10) => {
    console.log("🌱 Seeding Users...");
    const users = [];
    for (let i = 0; i < count; i++) {
        users.push({
            fullName: faker.person.fullName(),
            email: faker.internet.email().toLowerCase(),
            password: md5("123456"), // Tất cả user mặc định là 123456
            phone: faker.phone.number(),
            avatar: faker.image.avatar(),
            status: faker.helpers.arrayElement(["active", "inactive"]),
        });
    }

    try {
        const createdUsers = await User.insertMany(users);
        console.log(`✓ Created ${createdUsers.length} users`);
        return createdUsers;
    } catch (error) {
        console.error("✗ Error seeding users:", error.message);
        throw error;
    }
};

/**
 * Thêm hàm seedRootAccount để tạo tài khoản Admin cố định
 */
const seedRootAccount = async (roles) => {
    console.log("🌱 Seeding Root Admin Account...");
    if (!roles || roles.length === 0) {
        console.warn("⚠️ No roles found. Skipping root account seeding.");
        return null;
    }

    const adminRole = roles.find((r) => r.title === "Admin");
    if (!adminRole) {
        console.warn("⚠️ Admin role not found. Skipping root account seeding.");
        return null;
    }

    const rootAccountData = {
        fullName: "Root Admin",
        email: "admin@example.com", // Tài khoản Admin cố định
        password: md5("123456"), // Mật khẩu cố định: 123456
        phone: "0123456789",
        avatar: faker.image.avatar(),
        roleId: adminRole._id,
        status: "active",
    };

    try {
        const rootAccount = await Account.create(rootAccountData);
        console.log(`✓ Created Root Admin account: ${rootAccount.email}`);
        return rootAccount;
    } catch (error) {
        if (error.code === 11000) {
            console.warn(
                "⚠️ Root Admin account already exists (Duplicate key error)."
            );
            return await Account.findOne({ email: "admin@example.com" });
        }
        console.error("✗ Error seeding root account:", error.message);
        throw error;
    }
};

// Seed Accounts
const seedAccounts = async (roles, count = 5) => {
    console.log("🌱 Seeding Accounts...");
    const createdAccounts = [];
    if (!roles || roles.length === 0) {
        console.warn("⚠️ No roles found. Skipping account seeding.");
        return createdAccounts;
    }
    for (let i = 0; i < count; i++) {
        try {
            const roleId = roles[Math.floor(Math.random() * roles.length)]._id;
            const account = await Account.create({
                fullName: faker.person.fullName(),
                email: faker.internet.email().toLowerCase(),
                password: md5("123456"), // Tất cả accounts mặc định là 123456
                phone: faker.phone.number(),
                avatar: faker.image.avatar(),
                roleId: roleId,
                status: faker.helpers.arrayElement(["active", "inactive"]),
            });
            createdAccounts.push(account);
        } catch (error) {
            console.error(`✗ Error creating account ${i}:`, error.message);
        }
    }

    console.log(`✓ Created ${createdAccounts.length} accounts`);
    return createdAccounts;
};

// ... (seedProductCategories, seedProducts, seedCarts, seedOrders, seedForgotPasswords, seedSettingsGeneral giữ nguyên) ...

// Seed Product Categories
const seedProductCategories = async (count = 10) => {
    console.log("🌱 Seeding Product Categories...");
    const createdCategories = [];
    const rootCategories = []; // Create root categories

    for (let i = 0; i < Math.ceil(count / 3); i++) {
        try {
            const title = faker.commerce.department() + " " + faker.string.alpha(3);
            const category = await ProductCategory.create({
                title: title,
                description: faker.lorem.sentence(),
                status: "active",
                position: i,
                parent_id: null,
                slug: generateSlug(title),
                images: [faker.image.url()],
                thumbnail: faker.image.url(),
            });
            createdCategories.push(category);
            rootCategories.push(category);
        } catch (error) {
            console.error(`✗ Error creating root category:`, error.message);
        }
    } // Create subcategories

    for (let i = 0; i < count - rootCategories.length; i++) {
        try {
            const parentId =
                rootCategories[Math.floor(Math.random() * rootCategories.length)]._id;
            const title = faker.commerce.productAdjective() + " " + faker.word.noun();
            const category = await ProductCategory.create({
                title: title,
                description: faker.lorem.sentence(),
                status: "active",
                position: i,
                parent_id: parentId,
                slug: generateSlug(title),
                images: [faker.image.url()],
                thumbnail: faker.image.url(),
            });
            createdCategories.push(category);
        } catch (error) {
            console.error(`✗ Error creating subcategory:`, error.message);
        }
    }

    console.log(`✓ Created ${createdCategories.length} product categories`);
    return createdCategories;
};

// Seed Products
const seedProducts = async (categories, accounts, count = 50) => {
    console.log("🌱 Seeding Products...");
    const products = [];
    const brands = [
        "Apple",
        "Samsung",
        "Sony",
        "LG",
        "Dell",
        "HP",
        "Canon",
        "Nikon",
    ];
    if (categories.length === 0) {
        console.log("Skipping products seeding because no categories exist");
        return [];
    }

    for (let i = 0; i < count; i++) {
        const title = faker.commerce.productName();
        const price = faker.number.int({ min: 1, max: 1000 });
        const discount = faker.number.int({ min: 0, max: 50 });
        const category = categories[Math.floor(Math.random() * categories.length)]; // Đảm bảo luôn có account để gán createdBy
        const createdByAccount =
            accounts.length > 0
                ? accounts[Math.floor(Math.random() * accounts.length)]
                : null;
        products.push({
            title: title,
            slug: generateSlug(title),
            description: faker.commerce.productDescription(),
            product_category_id: category._id,
            category: category.title, // Add optional denormalized field if your schema supports it
            price: price,
            discountPercentage: discount,
            rating: faker.number.int({ min: 1, max: 5 }),
            stock: faker.number.int({ min: 0, max: 500 }),
            tags: faker.helpers.multiple(() => faker.word.words(), {
                count: { min: 1, max: 3 },
            }),
            brand: faker.helpers.arrayElement(brands),
            sku: faker.string.alphanumeric(10).toUpperCase(),
            weight: parseFloat((Math.random() * 10 + 1).toFixed(2)),
            dimensions: {
                width: faker.number.int({ min: 10, max: 100 }),
                height: faker.number.int({ min: 10, max: 100 }),
                depth: faker.number.int({ min: 10, max: 100 }),
            },
            warrantyInformation: "12 Months Warranty",
            shippingInformation: "Shipping in 2-3 days",
            availabilityStatus: faker.helpers.arrayElement([
                "In Stock",
                "Out of Stock",
                "Low Stock",
            ]),
            reviews: generateReviews(),
            images: [faker.image.url()],
            thumbnail: faker.image.url(),
            status: "active",
            feature: faker.helpers.arrayElement(["0", "1"]),
            position: i,
            createdBy: createdByAccount ? { accountId: createdByAccount._id } : null,
        });
    }

    try {
        const createdProducts = await Product.insertMany(products);
        console.log(`✓ Created ${createdProducts.length} products`);
        return createdProducts;
    } catch (error) {
        console.error("✗ Error seeding products:", error.message);
        throw error;
    }
};

// Seed Carts
const seedCarts = async (users, products, count = 5) => {
    console.log("🌱 Seeding Carts...");
    const carts = [];
    if (users.length === 0 || products.length === 0) return [];

    for (let i = 0; i < Math.min(count, users.length); i++) {
        const cartProducts = [];
        const productCount = faker.number.int({ min: 1, max: 5 });
        for (let j = 0; j < productCount; j++) {
            const randomProduct =
                products[Math.floor(Math.random() * products.length)];
            cartProducts.push({
                product_id: randomProduct._id,
                quantity: faker.number.int({ min: 1, max: 5 }),
            });
        }
        carts.push({
            user_id: users[i]._id,
            products: cartProducts,
        });
    }

    try {
        const createdCarts = await Cart.insertMany(carts);
        console.log(`✓ Created ${createdCarts.length} carts`);
        return createdCarts;
    } catch (error) {
        console.error("✗ Error seeding carts:", error.message);
        throw error;
    }
};

// Seed Orders
const seedOrders = async (carts, products, users, count = 10) => {
    console.log("🌱 Seeding Orders...");
    const orders = [];
    const methods = ["cod", "online"];
    const statuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];
    if (carts.length === 0) return [];

    for (let i = 0; i < Math.min(count, carts.length); i++) {
        const cart = carts[i];
        const orderProducts = [];
        if (cart.products && cart.products.length > 0) {
            cart.products.forEach((item) => {
                const productDetail = products.find((p) =>
                    p._id.equals(item.product_id)
                );
                if (productDetail) {
                    orderProducts.push({
                        product_id: productDetail._id,
                        price: productDetail.price,
                        discountPercentage: productDetail.discountPercentage || 0,
                        quantity: item.quantity,
                    });
                }
            });
        } else {
            const product = products[Math.floor(Math.random() * products.length)];
            orderProducts.push({
                product_id: product._id,
                price: product.price,
                discountPercentage: 0,
                quantity: 1,
            });
        }
        orders.push({
            cart_id: cart._id,
            userInfo: {
                fullName: faker.person.fullName(),
                phone: faker.phone.number(),
                address: faker.location.streetAddress(),
                note: faker.lorem.sentence(),
            },
            products: orderProducts,
            method: faker.helpers.arrayElement(methods),
            status: faker.helpers.arrayElement(statuses),
        });
    }

    try {
        const createdOrders = await Order.insertMany(orders);
        console.log(`✓ Created ${createdOrders.length} orders`);
        return createdOrders;
    } catch (error) {
        console.error("✗ Error seeding orders:", error.message);
        throw error;
    }
};

// Seed Forgot Password
const seedForgotPasswords = async (count = 3) => {
    console.log("🌱 Seeding Forgot Passwords...");
    const forgotPasswords = [];
    for (let i = 0; i < count; i++) {
        forgotPasswords.push({
            email: faker.internet.email(),
            otp: faker.string.numeric(6),
            expiresAt: faker.date.soon({ days: 1 }),
        });
    }

    try {
        const createdForgotPasswords = await ForgotPassword.insertMany(
            forgotPasswords
        );
        console.log(
            `✓ Created ${createdForgotPasswords.length} forgot password records`
        );
        return createdForgotPasswords;
    } catch (error) {
        console.error("✗ Error seeding forgot passwords:", error.message);
        throw error;
    }
};

// Seed Settings General
const seedSettingsGeneral = async () => {
    console.log("🌱 Seeding General Settings...");
    const settings = {
        websiteName: "E-Commerce Platform",
        logo: faker.image.url(),
        phoneNumber: faker.phone.number(),
        address: faker.location.streetAddress(),
        email: "support@ecommerce.com",
        copyright: `© ${new Date().getFullYear()} E-Commerce Platform. All rights reserved.`,
    };

    try {
        await SettingsGeneral.deleteMany({});
        const createdSettings = await SettingsGeneral.create(settings);
        console.log("✓ Created settings general");
        return createdSettings;
    } catch (error) {
        console.error("✗ Error seeding settings general:", error.message);
        throw error;
    }
};

// Recover Database Function
const recoverDatabase = async () => {
    try {
        console.log("\n🔄 Starting database recovery...\n");
        await connectDB();
        await clearDatabase();
        console.log("\n✅ Database recovery completed successfully!\n");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Recovery failed:", error.message);
        process.exit(1);
    }
};

// Main seeding function
const seedDatabase = async () => {
    try {
        console.log("\n🚀 STARTING DATABASE SEEDING...\n");
        await connectDB();
        await clearDatabase(); // Seed in order (Sequential execution to ensure relationships)
        const permissions = await seedPermissions();
        const roles = await seedRoles(permissions); // 1. Seed Root Admin Account
        const rootAccount = await seedRootAccount(roles); // 2. Seed other Users and Accounts

        const users = await seedUsers(10); // Ghép Root Account và các tài khoản ngẫu nhiên khác.
        const accounts = [rootAccount, ...(await seedAccounts(roles, 5))].filter(
            Boolean
        );

        const categories = await seedProductCategories(10);
        const products = await seedProducts(categories, accounts, 50);
        const carts = await seedCarts(users, products, 5);
        await seedOrders(carts, products, users, 10);
        await seedForgotPasswords(3);
        await seedSettingsGeneral();
        console.log("\n✨ Database seeding completed successfully!\n");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    }
};

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];

if (require.main === module) {
    if (command === "recover") {
        recoverDatabase();
    } else {
        seedDatabase();
    }
}

module.exports = { seedDatabase, clearDatabase };
