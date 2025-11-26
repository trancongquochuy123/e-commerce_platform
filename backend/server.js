const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const logger = require('./src/shared/logger.js');

require('dotenv').config();

// Import configs
const database = require('./config/database.js');
const corsConfig = require('./config/cors.js');
const systemConfig = require('./config/system.js');

// Import API routes
const apiV1Routes = require('./src/api/v1/routes/index.route.js');

// Import middlewares
const { errorHandler, notFound } = require('./src/api/v1/middlewares/errorHandler.middleware.js');

// Connect to database
database.connect();

const app = express();
const port = process.env.PORT || 3000;

// ======================
// SECURITY MIDDLEWARE
// ======================
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
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
// LOGGING
// ======================
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// ======================
// STATIC FILES
// ======================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/public', express.static(path.join(__dirname, 'public')));

// Tinymce (nếu cần cho rich text editor)
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
            api_v1: '/api/v1',
            admin: '/api/v1/admin',
            client: '/api/v1'
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
// API ROUTES V1
// ======================
app.use('/api/v1', apiV1Routes);

// Future API versions
// app.use('/api/v2', apiV2Routes);

// ======================
// ERROR HANDLING
// ======================
app.use(notFound); // 404 handler - Must be before error handler
app.use(errorHandler); // Global error handler - Must be last

// ======================
// START SERVER
// ======================
const server = app.listen(port, () => {
    logger.info('═══════════════════════════════════════');
    logger.info('🚀 Server Started Successfully!');
    logger.info(`📍 Server: http://localhost:${port}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 API v1: http://localhost:${port}/api/v1`);
    logger.info(`💚 Health Check: http://localhost:${port}/health`);
    logger.info('═══════════════════════════════════════');
});

// ======================
// GRACEFUL SHUTDOWN
// ======================
const gracefulShutdown = (signal) => {
    logger.info(`${signal} signal received: closing HTTP server`);
    server.close(() => {
        logger.info('✅ HTTP server closed');
        logger.info('📦 Closing database connection...');
        process.exit(0);
    });

    setTimeout(() => {
        logger.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logger.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
    logger.error(`${error.name}: ${error.message}`);
    logger.error(error.stack);
    process.exit(1);
});



// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    logger.error('❌ UNHANDLED REJECTION! Shutting down...');
    logger.error(error);
    server.close(() => process.exit(1));
});
module.exports = app;