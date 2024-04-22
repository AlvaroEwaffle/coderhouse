const MongoStore = require('connect-mongo')
const session = require('express-session')
const defaultOptions = require('./defaultOptions')
const { dbName, mongoUrl } = require('../dbConfig')

const storage = MongoStore.create({
    dbName,
    mongoUrl,
    ttl: 60
})

module.exports = session({
    store: storage,
    cookie: { 
        secure : false, 
        maxAge: 60  * 1000 }, // 1 min
    ...defaultOptions
})