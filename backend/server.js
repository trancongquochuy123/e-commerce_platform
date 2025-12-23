// server.js

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

// THƯ VIỆN BỔ SUNG CHO MVC & UTILITIES
const flash = require('express-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const moment = require('moment');
const multer = require('multer');
const favicon = require('serve-favicon');

// === [FIX VERCEL] THAY ĐỔI CẤU HÌNH MULTER ===
// Thay vì lưu vào disk (dest: 'uploads/'), ta lưu vào Memory (RAM)
// để tránh lỗi EROFS: read-only file system trên Vercel.
const upload = multer({ storage: multer.memoryStorage() }); 

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Import logger tùy chỉnh
const logger = require('./src/shared/logger.js');

require('dotenv').config();

// Import configs
const database = require('./config/database.js');
const corsConfig = require('./config/cors.js');
const systemConfig = require('./config/system.js');

// Import routes
const apiV1Routes = require('./src/api/v1/routes/index.route.js');
const adminRoutes = require('./src/admin/routes/index.route.js');

// Import middlewares
const { errorHandler, notFound } = require('./src/api/v1/middlewares/errorHandler.middleware.js');

// Connect to database
database.connect();

const app = express();

const port = process.env.PORT || 3000;

// ======================
// VIEW ENGINE (for Admin MVC & Client)
// ======================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// App locals - available in all views
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
app.locals.upload = upload;

// ======================
// SECURITY MIDDLEWARE
// ======================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Tắt để TinyMCE hoạt động
}));
app.use(cors(corsConfig));
app.use(compression());

// ======================
// REQUEST PARSING
// ======================
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'huydeptrai'));
app.use(methodOverride('_method'));

// ======================
// SWAGGER DOCUMENTATION
// ======================
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
        explorer: true
    })
);


// ======================
// SESSION, FLASH VÀ FAVICON
// ======================

// Cấu hình session store - dùng MongoDB thay vì MemoryStore
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'huydeptrai',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        maxAge: 60000 * 24, // 24 hours
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' // HTTPS only in production
    }
};

// Sử dụng MongoDB store nếu kết nối được, nếu không dùng MemoryStore
if (process.env.MONGODB_URI) {
    sessionConfig.store = MongoStore.create({
        mongoUrl: mongoUrl,
        touchAfter: 24 * 3600 // Lazy session update - tránh quá nhiều writes
    });
}

app.use(session(sessionConfig));

app.use(flash());

// Favicon - Kiểm tra file tồn tại trước khi dùng để tránh lỗi nếu thiếu file
const faviconPath = path.join(__dirname, 'public', 'images', 'favicon.ico');
try {
    app.use(favicon(faviconPath));
} catch (err) {
    console.log('Favicon not found, skipping...');
}


// ======================
// STATIC FILES
// ======================
app.use(express.static(path.join(__dirname, 'public')));

// [LƯU Ý QUAN TRỌNG]: Trên Vercel, thư mục 'uploads' sẽ rỗng vì ta không ghi file vào đó được.
// Bạn nên comment dòng này lại hoặc để đó nhưng hiểu là nó sẽ không phục vụ file upload mới.
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// ======================
// HEALTH CHECK & INFO
// ======================
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to E-Commerce API',
        version: '1.0.0',
        documentation: '/api/v1',
        endpoints: {
            health: '/health',
            api: '/api/v1',
            admin: `/${systemConfig.prefixAdmin}`
        },
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ======================
// ROUTES
// ======================
app.use('/api/v1', apiV1Routes);

// ADMIN MVC
adminRoutes(app); 


// ======================
// ERROR HANDLING
// ======================
app.use(notFound);
app.use(errorHandler);

// ======================
// START SERVER
// ======================
const server = app.listen(port, () => {
    // SỬ DỤNG logger
    logger.info('═══════════════════════════════════════');
    logger.info('🚀 Server Started Successfully!');
    logger.info(`📍 Server: http://localhost:${port}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 API v1: http://localhost:${port}/api/v1`);
    logger.info(`👨‍💼 Admin Panel: http://localhost:${port}/${systemConfig.prefixAdmin}`);
    logger.info(`💚 Health Check: http://localhost:${port}/health`);
    logger.info('═══════════════════════════════════════');
});

// GRACEFUL SHUTDOWN
const gracefulShutdown = (signal) => { /* ... */ };
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('uncaughtException', (error) => { /* ... */ });
process.on('unhandledRejection', (error) => { /* ... */ });

module.exports = app;