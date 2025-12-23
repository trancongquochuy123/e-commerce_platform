const mongoose = require('mongoose');
const logger = require('../src/shared/logger');

module.exports.connect = async () => { 
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info('✅ Connected to MongoDB successfully!');
    } catch (error) {
        logger.error('❌ Error connecting to MongoDB:', error);
    }
}

