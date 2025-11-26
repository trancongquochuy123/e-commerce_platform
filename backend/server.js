const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

require('dotenv').config();

// Import configs
const database = require('./config/database.js');
const corsConfig = require('./config/cors.js');
const systemConfig = require('./config/system.js');

// Import API routes
const apiV1Routes = require('./src/api/v1/routes/index.route.js');

// Import middlewares
const errorHandler = require('./src/api/v1/middlewares/errorHandler.middleware.js');
const notFound = require('./src/api/v1/middlewares/notFound.middleware.js');

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
    console.log('═══════════════════════════════════════');
    console.log('🚀 Server Started Successfully!');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Server: http://localhost:${port}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API v1: http://localhost:${port}/api/v1`);
    console.log(`💚 Health Check: http://localhost:${port}/health`);
    console.log('═══════════════════════════════════════');
});

// ======================
// GRACEFUL SHUTDOWN
// ======================
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} signal received: closing HTTP server`);
    server.close(() => {
        console.log('✅ HTTP server closed');
        console.log('📦 Closing database connection...');
        // Close database connection if needed
        // mongoose.connection.close();
        process.exit(0);
    });

    // Force close after 10s
    setTimeout(() => {
        console.error('❌ Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
    console.error(error.name, error.message);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('❌ UNHANDLED REJECTION! Shutting down...');
    console.error(error);
    server.close(() => {
        process.exit(1);
    });
});

module.exports = app;