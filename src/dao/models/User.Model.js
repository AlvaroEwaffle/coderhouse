const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    age: Number,
    email: {
        type: String,
    
    },
    password: String,
    role: { type: String, default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    githubId: String,
    username: String
})

module.exports = mongoose.model('User', schema, 'users')