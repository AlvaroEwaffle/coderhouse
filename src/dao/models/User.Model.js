const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
        unique: false
    },
    password: String,
})

module.exports = mongoose.model('User', schema, 'users')