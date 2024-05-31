// dtos/UserDTO.js
class UserDTO {
    constructor({ firstName, lastName, email, age, cart, password }) {
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.age = age;
      this.cart = cart;
      this.password = password;
    }
  }
  
  module.exports = UserDTO;
  