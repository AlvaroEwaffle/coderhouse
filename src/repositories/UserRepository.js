// repositories/UserRepository.js
const UserDAO = require('../dao/mongo_dao/UsersDAO');
const UserDTO = require('../dto/UserDTO');

class UserRepository {
    constructor() {
        this.userDAO = UserDAO;
    }
    async createUser(userDTO) {
        console.log("--- Repository ---");
        console.log(userDTO);
        return await this.userDAO.createUser(userDTO);
    }

    async getUserById(id) {
        return await this.userDAO.getUserById(id);
    }

    async getUserByEmail(email) {
        return await this.userDAO.getUserByEmail(email);
    }

    // Otros métodos...
}

module.exports = new UserRepository();
