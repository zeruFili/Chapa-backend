// logger.js
const winston = require('winston');
require('winston-mongodb');

const logger = winston.createLogger({
  level: 'info', // Default log level
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }), // Optional: Log to a file
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/chapa',
      collection: 'logs',
      level: 'info',
    }),
  ],
});

module.exports = logger;