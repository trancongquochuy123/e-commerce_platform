// src/shared/cache.js
const redis = require('redis');
const logger = require('./logger');

const redisClient = redis.createClient({
    url: process.env.REDIS_URL || 'redis://127.0.0.1:6379'
});

redisClient.on('error', (err) => logger.error('Redis Client Error', err));
redisClient.connect(); // Redis v4+

module.exports = {
    set: async (key, value, ttl = 3600) => { // ttl: seconds
        await redisClient.set(key, JSON.stringify(value), { EX: ttl });
    },
    get: async (key) => {
        const data = await redisClient.get(key);
        return data ? JSON.parse(data) : null;
    },
    del: async (key) => {
        await redisClient.del(key);
    }
};
