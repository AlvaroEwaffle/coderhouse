const User = require('../../models/User.Model.js');

class MongoUserDAO {
    async getUserByEmail(email) {
        return await User.findOne({ email });
    }

    async createUser(userData) {
        console.log("--- DAO ---");
        console.log(userData);
        return await User.create({ ...userData });
    }
}

module.exports = new MongoUserDAO();
