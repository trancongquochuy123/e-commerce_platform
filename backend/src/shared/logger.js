// src/shared/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'info', // info, warn, error
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        myFormat
    ),
    transports: [
        new transports.Console({ format: combine(colorize(), myFormat) }),
        new transports.File({ filename: 'logs/combined.log' }),
        new transports.File({ filename: 'logs/error.log', level: 'error' })
    ],
});

module.exports = logger;
