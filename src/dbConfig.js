const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    dbName: 'test',
    mongoUrl: process.env.MONGO_DB
} 