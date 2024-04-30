const bcrypt = require('bcrypt');

// Hash a password
const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

// Validate password
const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

module.exports = { hashPassword, isValidPassword };
